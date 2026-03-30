-- 1. Master Tables for Locality
CREATE TABLE IF NOT EXISTS locality_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS nearby_locality_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_locality_id UUID REFERENCES locality_master(id) ON DELETE CASCADE,
  target_locality_id UUID REFERENCES locality_master(id) ON DELETE CASCADE,
  distance_km DECIMAL NOT NULL,
  UNIQUE(source_locality_id, target_locality_id)
);

-- 2. Master Tables for Brands
CREATE TABLE IF NOT EXISTS brand_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dealer_brand_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brand_master(id) ON DELETE CASCADE,
  UNIQUE(agent_id, brand_id)
);

-- 3. Lead Assignments (to send specific leads to specific dealers)
CREATE TABLE IF NOT EXISTS lead_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending | viewed | accepted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requirement_id, agent_id)
);

-- 4. Alter Existing Tables
ALTER TABLE agents ADD COLUMN IF NOT EXISTS locality_id UUID REFERENCES locality_master(id);
ALTER TABLE agents ADD COLUMN IF NOT EXISTS preferred_radius_km DECIMAL DEFAULT 5.0;

ALTER TABLE requirements ADD COLUMN IF NOT EXISTS locality_id UUID REFERENCES locality_master(id);
ALTER TABLE requirements ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brand_master(id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE locality_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE nearby_locality_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_brand_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read on locality_master" ON locality_master FOR SELECT USING (TRUE);
CREATE POLICY "Public read on nearby_locality_master" ON nearby_locality_master FOR SELECT USING (TRUE);
CREATE POLICY "Public read on brand_master" ON brand_master FOR SELECT USING (TRUE);
CREATE POLICY "Public read on dealer_brand_mapping" ON dealer_brand_mapping FOR SELECT USING (TRUE);
CREATE POLICY "Agents can see their assigned leads" ON lead_assignments FOR SELECT USING (TRUE); -- Can be restricted to auth.uid() if user linked
CREATE POLICY "Anyone can insert assignment" ON lead_assignments FOR INSERT WITH CHECK (TRUE);

-- ─── 6. SEED DATA FOR TESTING ─────────────────────────────────────────────

-- Insert Localities (e.g., Delhi NCR)
INSERT INTO locality_master (id, name, city) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Sector 15, Noida', 'Noida'),
  ('22222222-2222-2222-2222-222222222222', 'Sector 16, Noida', 'Noida'),
  ('33333333-3333-3333-3333-333333333333', 'Sector 18, Noida', 'Noida'),
  ('44444444-4444-4444-4444-444444444444', 'Sector 50, Noida', 'Noida')
ON CONFLICT (name) DO NOTHING;

-- Insert Distances (Map Sector 15 distances to others)
INSERT INTO nearby_locality_master (source_locality_id, target_locality_id, distance_km) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1.5), -- Sec 15 -> Sec 16
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 3.0), -- Sec 15 -> Sec 18
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 8.0)  -- Sec 15 -> Sec 50
ON CONFLICT DO NOTHING;

-- Insert Brands
INSERT INTO brand_master (id, name, category) VALUES
  ('aaaa0000-0000-0000-0000-000000000000', 'LG', 'Air Conditioner'),
  ('bbbb0000-0000-0000-0000-000000000000', 'Samsung', 'Air Conditioner'),
  ('cccc0000-0000-0000-0000-000000000000', 'Daikin', 'Air Conditioner')
ON CONFLICT (name) DO NOTHING;

-- ─── 7. THE LOGIC (POSTGRES DB FUNCTION) ──────────────────────────────────
-- This function runs when a new requirement is submitted and distributes 
-- the lead directly to the inbox of up to 5 matching dealers!

CREATE OR REPLACE FUNCTION distribute_lead_to_dealers(p_req_id UUID, p_limit INT DEFAULT 5) 
RETURNS void AS $$
DECLARE
    r_locality_id UUID;
    r_brand_id UUID;
BEGIN
    -- 1. Grab the Lead's specific Locality and Brand
    SELECT locality_id, brand_id INTO r_locality_id, r_brand_id
    FROM requirements WHERE id = p_req_id;

    IF r_locality_id IS NULL OR r_brand_id IS NULL THEN
        RETURN; -- Missing criteria
    END IF;

    -- 2. Find matching dealers based on Radius AND Brand
    -- Insert them into the new 'lead_assignments' table 
    INSERT INTO lead_assignments (requirement_id, agent_id)
    SELECT 
        p_req_id, 
        a.id
    FROM agents a
    -- Check if dealer is in the buyer's locality OR a nearby locality
    JOIN nearby_locality_master nlm 
      ON (nlm.target_locality_id = a.locality_id AND nlm.source_locality_id = r_locality_id)
         OR (a.locality_id = r_locality_id AND nlm.distance_km = 0)
    -- Check if dealer sells the requested brand
    JOIN dealer_brand_mapping dbm 
      ON dbm.agent_id = a.id
    WHERE 
      dbm.brand_id = r_brand_id
      -- The Magic Rule: Their Preferred Radius must be >= the Distance
      AND a.preferred_radius_km >= COALESCE(nlm.distance_km, 0)
    ORDER BY nlm.distance_km ASC, a.wallet_balance DESC -- Tie breaker: Nearest, then richest
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
