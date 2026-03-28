-- HeyBuddy Database Schema v1.0
-- Run this in Supabase SQL Editor

-- ─── Buyers ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buyers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      TEXT UNIQUE NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OTPs (demo: visible on screen, SMS later) ────────────────────────────────
CREATE TABLE IF NOT EXISTS otps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      TEXT NOT NULL,
  otp        TEXT NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes'),
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Agents (stores) ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          TEXT UNIQUE NOT NULL,
  shop_name      TEXT NOT NULL,
  area           TEXT NOT NULL,
  categories     TEXT[]  DEFAULT '{}',
  wallet_balance INTEGER DEFAULT 0,
  is_verified    BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Requirements (buyer product requests) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS requirements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id     UUID REFERENCES buyers(id) ON DELETE CASCADE,
  category     TEXT NOT NULL,
  location     TEXT NOT NULL,
  products     JSONB DEFAULT '[]',
  quiz_answers JSONB DEFAULT '{}',
  status       TEXT DEFAULT 'active',   -- active | closed | cancelled
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Quotes from agents ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES requirements(id) ON DELETE CASCADE,
  agent_id       UUID REFERENCES agents(id) ON DELETE CASCADE,
  product_name   TEXT NOT NULL,
  price          INTEGER NOT NULL,
  installation   TEXT,
  warranty       TEXT,
  status         TEXT DEFAULT 'pending',  -- pending | accepted | countered | rejected
  counter_price  INTEGER,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Marketplace leads ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_leads (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES requirements(id) ON DELETE SET NULL,
  category       TEXT NOT NULL,
  area           TEXT NOT NULL,
  model          TEXT,
  budget         TEXT,
  cost           INTEGER DEFAULT 100,
  is_available   BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Lead purchases by agents ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lead_purchases (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id   UUID REFERENCES agents(id) ON DELETE CASCADE,
  lead_id    UUID REFERENCES marketplace_leads(id) ON DELETE CASCADE,
  cost       INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agent_id, lead_id)
);

-- ─── Wallet transactions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id    UUID REFERENCES agents(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,    -- positive = credit, negative = debit
  type        TEXT NOT NULL,       -- recharge | lead_purchase | refund
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id   UUID REFERENCES buyers(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed: marketplace demo leads ─────────────────────────────────────────────
INSERT INTO marketplace_leads (category, area, model, budget, cost) VALUES
  ('AC',      'Sector 75',      '2T Split',    '40K-50K',  100),
  ('Fridge',  'Sector 120',     '600L+',       '55K-70K',  100),
  ('TV',      'Sector 50',      '55in OLED',   '80K-1.1L', 80),
  ('AC',      'Gr.Noida West',  '1.5T Inv',    '32K-38K',  100),
  ('Laptop',  'Sector 62',      'MacBook M3',  '1.2L+',    120)
ON CONFLICT DO NOTHING;

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE buyers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps               ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents             ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements       ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_leads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_purchases     ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;

-- Public read on marketplace_leads
CREATE POLICY "Marketplace leads are public" ON marketplace_leads
  FOR SELECT USING (is_available = TRUE);

-- Open insert for buyers/agents (auth handled at app level via OTP)
CREATE POLICY "Anyone can insert buyer"   ON buyers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select buyer"   ON buyers FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can insert agent"   ON agents FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select agent"   ON agents FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can update agent"   ON agents FOR UPDATE USING (TRUE);
CREATE POLICY "Anyone can insert otp"     ON otps   FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select otp"     ON otps   FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can update otp"     ON otps   FOR UPDATE USING (TRUE);
CREATE POLICY "Anyone can insert req"     ON requirements FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select req"     ON requirements FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can insert quote"   ON quotes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select quote"   ON quotes FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can update quote"   ON quotes FOR UPDATE USING (TRUE);
CREATE POLICY "Anyone can insert purchase" ON lead_purchases FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select purchase" ON lead_purchases FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can insert wallet"  ON wallet_transactions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select wallet"  ON wallet_transactions FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can insert notif"   ON notifications FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can select notif"   ON notifications FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can update notif"   ON notifications FOR UPDATE USING (TRUE);
CREATE POLICY "Agents can update marketplace_leads" ON marketplace_leads FOR UPDATE USING (TRUE);
