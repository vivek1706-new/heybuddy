-- ═══════════════════════════════════════════════════════════════════
-- Migration: Wire up lmterfnum-based locality matching
-- Run this entire file in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- STEP 1: Add lmterfnum column to agents and requirements
ALTER TABLE agents ADD COLUMN IF NOT EXISTS lmterfnum INTEGER;
CREATE INDEX IF NOT EXISTS idx_agents_lmterfnum ON agents(lmterfnum);

ALTER TABLE requirements ADD COLUMN IF NOT EXISTS lmterfnum INTEGER;
CREATE INDEX IF NOT EXISTS idx_requirements_lmterfnum ON requirements(lmterfnum);

-- STEP 2: Backfill lmterfnum for all existing agents by area
UPDATE agents SET lmterfnum = 70239 WHERE area ILIKE '%Sector 15%'    AND area ILIKE '%Noida%';
UPDATE agents SET lmterfnum = 70244 WHERE area ILIKE '%Sector 18%'    AND area ILIKE '%Noida%';
UPDATE agents SET lmterfnum = 70293 WHERE area ILIKE '%Sector 50%'    AND area ILIKE '%Noida%';
UPDATE agents SET lmterfnum = 70297 WHERE area ILIKE '%Sector 62%'    AND area ILIKE '%Noida%';
UPDATE agents SET lmterfnum = 78757 WHERE area ILIKE '%Sector 44%'    AND area ILIKE '%Gurgaon%';
UPDATE agents SET lmterfnum = 77815 WHERE area ILIKE '%Hauz Khas%';
UPDATE agents SET lmterfnum = 70496 WHERE area ILIKE '%Indirapuram%';
UPDATE agents SET lmterfnum = 95690 WHERE area ILIKE '%Greater Noida West%';

-- STEP 3: Verify — should show 0 agents with NULL lmterfnum after backfill
SELECT area, lmterfnum, COUNT(*) as agent_count
FROM agents
GROUP BY area, lmterfnum
ORDER BY area;
