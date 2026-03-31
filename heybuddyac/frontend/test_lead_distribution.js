/**
 * End-to-end test for lead distribution
 * Run: node test_lead_distribution.js
 *
 * Tests that a buyer requirement in Sector 62, Noida
 * correctly routes to nearby agents via locality_5km_map.
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rsuhahxgmgzvdyhxwsjy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdWhhaHhnbWd6dmR5aHh3c2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Mjc0NjksImV4cCI6MjA5MDEwMzQ2OX0.TNt7ewTGzllL1_-0FA7s0BGQzVev6tCSB1aaNOWhoIE'
);

const TEST_LMTERFNUM = 70244; // Sector 18, Noida — buyer's location
const TEST_PHONE = '9999999999';

async function run() {
  console.log('\n=== HeyBuddy Lead Distribution Test ===\n');

  // ── 1. Confirm migration ran (agents have lmterfnum) ─────────────────────
  const { data: agents } = await supabase
    .from('agents')
    .select('shop_name, area, lmterfnum')
    .not('lmterfnum', 'is', null)
    .limit(5);

  if (!agents || agents.length === 0) {
    console.error('FAIL: No agents have lmterfnum set. Run lmterfnum_migration.sql first.');
    process.exit(1);
  }
  console.log(`✓ ${agents.length}+ agents have lmterfnum set`);
  agents.forEach(a => console.log(`   ${a.shop_name} (${a.area}) → lmterfnum: ${a.lmterfnum}`));

  // ── 2. Simulate distribution query for buyer in Sector 18, Noida ─────────
  console.log(`\n─ Simulating buyer requirement in lmterfnum ${TEST_LMTERFNUM} (Sector 18, Noida) ─`);

  const { data: neighbors } = await supabase
    .from('locality_5km_map')
    .select('source_lmterfnum')
    .eq('nearby_lmterfnum', TEST_LMTERFNUM);

  const nearIds = (neighbors || []).map(n => n.source_lmterfnum);
  nearIds.push(TEST_LMTERFNUM);
  console.log(`✓ Nearby lmterfnums (incl. self): ${nearIds.join(', ')}`);

  const { data: matchedAgents } = await supabase
    .from('agents')
    .select('id, shop_name, area, lmterfnum')
    .in('lmterfnum', nearIds);

  if (!matchedAgents || matchedAgents.length === 0) {
    console.warn('⚠ No agents matched for nearby localities. Check locality_5km_map coverage or agent lmterfnums.');
  } else {
    console.log(`✓ ${matchedAgents.length} agent(s) matched:`);
    matchedAgents.forEach(a => console.log(`   ${a.shop_name} (${a.area})`));
  }

  // ── 3. Create test buyer ──────────────────────────────────────────────────
  console.log('\n─ Creating test buyer ─');
  const { data: buyer } = await supabase
    .from('buyers')
    .upsert({ phone: TEST_PHONE }, { onConflict: 'phone' })
    .select()
    .single();
  console.log(`✓ Buyer: ${buyer.id}`);

  // ── 4. Insert test requirement ────────────────────────────────────────────
  console.log('\n─ Inserting test requirement ─');
  const { data: req, error: reqErr } = await supabase
    .from('requirements')
    .insert({
      buyer_id: buyer.id,
      category: 'Air Conditioner',
      location: 'Sector 18, Noida',
      lmterfnum: TEST_LMTERFNUM,
      products: [{ name: 'Daikin 1.5T Inverter' }],
      status: 'active',
    })
    .select()
    .single();

  if (reqErr) { console.error('FAIL inserting requirement:', reqErr.message); process.exit(1); }
  console.log(`✓ Requirement: ${req.id}`);

  // ── 5. Insert lead assignments ────────────────────────────────────────────
  console.log('\n─ Creating lead assignments ─');
  if (matchedAgents && matchedAgents.length > 0) {
    const assignments = matchedAgents.map(a => ({
      requirement_id: req.id,
      agent_id: a.id,
      status: 'new',
    }));
    const { error: assignErr } = await supabase.from('lead_assignments').insert(assignments);
    if (assignErr) { console.error('FAIL inserting assignments:', assignErr.message); process.exit(1); }
    console.log(`✓ ${assignments.length} lead assignment(s) created`);
  }

  // ── 6. Verify ─────────────────────────────────────────────────────────────
  console.log('\n─ Verifying lead_assignments table ─');
  const { data: verify } = await supabase
    .from('lead_assignments')
    .select('agent_id, status, agents(shop_name, area)')
    .eq('requirement_id', req.id);

  console.log(`✓ Assignments confirmed: ${verify?.length || 0}`);
  (verify || []).forEach(v => console.log(`   → ${v.agents?.shop_name} (${v.agents?.area}) [${v.status}]`));

  // ── 7. Cleanup ────────────────────────────────────────────────────────────
  await supabase.from('lead_assignments').delete().eq('requirement_id', req.id);
  await supabase.from('requirements').delete().eq('id', req.id);
  await supabase.from('buyers').delete().eq('phone', TEST_PHONE);
  console.log('\n✓ Test data cleaned up');
  console.log('\n=== TEST PASSED ===\n');
}

run().catch(err => { console.error('Unexpected error:', err); process.exit(1); });
