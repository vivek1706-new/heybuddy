-- ==========================================
-- 1. MASTER TABLE: LEAD VALUE / PRICING
-- ==========================================
-- This determines the exact cost of a lead based on Category and City
CREATE TABLE IF NOT EXISTS category_lead_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  cost_per_lead DECIMAL NOT NULL,
  UNIQUE(category, city)
);

-- ==========================================
-- 2. DEALER SUBSCRIPTION CONTRACTS
-- ==========================================
-- Tracks the payment and the overall lead commitments
CREATE TABLE IF NOT EXISTS dealer_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  amount_paid DECIMAL NOT NULL,
  package_months INT DEFAULT 3,         -- E.g., a 3-month contract
  total_leads_bought INT NOT NULL,      -- E.g., 90 leads total
  leads_per_month INT NOT NULL,         -- E.g., 30 leads per month (Calculated automatically)
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,                 -- start_date + package_months
  status TEXT DEFAULT 'active'          -- active | expired | paused
);

-- ==========================================
-- 3. MONTHLY DELIVERY TRACKING
-- ==========================================
-- Tracks exactly how many leads have been delivered to the dealer per month
CREATE TABLE IF NOT EXISTS dealer_monthly_delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  billing_month DATE NOT NULL,          -- E.g., '2026-04-01' (Stored as the 1st of the month)
  leads_delivered INT DEFAULT 0,        -- Increments every time the algorithm matches them
  leads_target INT NOT NULL,            -- Brought over from their subscription leads_per_month
  UNIQUE(agent_id, billing_month)
);

-- ==========================================
-- 4. SEED DATA FOR TESTING
-- ==========================================
-- Seed 1: Pricing Rules
INSERT INTO category_lead_pricing (category, city, cost_per_lead) VALUES 
  ('Air Conditioner', 'Noida', 150.00),
  ('Air Conditioner', 'Greater Noida', 120.00),
  ('Refrigerator', 'Noida', 100.00)
ON CONFLICT (category, city) DO UPDATE SET cost_per_lead = EXCLUDED.cost_per_lead;

-- Seed 2: Agent Subscription (Agent A bought a 3 Month Pack for ACs in Noida)
-- Let's say Agent A paid Rs. 13,500 for 90 leads over 3 months (30/month at 150/lead)
INSERT INTO dealer_subscriptions (agent_id, amount_paid, package_months, total_leads_bought, leads_per_month, start_date, end_date)
VALUES (
  '10000000-0000-0000-0000-000000000001', 
  13500.00, 
  3, 
  90, 
  30, 
  NOW(), 
  NOW() + interval '3 months'
);

-- Seed 3: Current Month Delivery Tracking for Agent A (Starts at 0 delivered out of 30)
INSERT INTO dealer_monthly_delivery (agent_id, billing_month, leads_delivered, leads_target)
VALUES (
  '10000000-0000-0000-0000-000000000001', 
  DATE_TRUNC('month', CURRENT_DATE), -- e.g., April 1st, 2026
  0, 
  30
);
