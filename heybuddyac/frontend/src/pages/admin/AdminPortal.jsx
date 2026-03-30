import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { C } from '../../constants/colors';
import { oB, cd } from '../../constants/styles';

export default function AdminPortal() {
    const [authPass, setAuthPass] = useState('');
    const [logged, setLogged] = useState(false);

    const [dealers, setDealers] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [brands, setBrands] = useState([]);
    const [leads, setLeads] = useState([]);

    const [sel, setSel] = useState(null); // Selected Dealer
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (logged) {
            loadData();
        }
    }, [logged]);

    async function loadData() {
        setLoading(true);
        // Run concurrent fetches
        const [dRes, locRes, brRes, lrRes] = await Promise.all([
            supabase.from('agents').select('*').order('created_at', { ascending: false }),
            supabase.from('locality_master').select('*'),
            supabase.from('brand_master').select('*'),
            supabase.from('requirements').select('*, locality_master(name), brand_master(name)').order('created_at', { ascending: false }).limit(50)
        ]);

        setDealers(dRes.data || []);
        setLocalities(locRes.data || []);
        setBrands(brRes.data || []);
        setLeads(lrRes.data || []);
        setLoading(false);
    }

    async function fetchDealerBrands(agentId) {
        const { data } = await supabase.from('dealer_brand_mapping').select('brand_id').eq('agent_id', agentId);
        return data?.map(d => d.brand_id) || [];
    }

    async function openDealer(d) {
        const brandIds = await fetchDealerBrands(d.id);
        setSel({ ...d, brandIds, amount_paid: d.wallet_balance || 0 });
    }

    async function saveDealer() {
        setLoading(true);
        // 1. Update Agent Core info
        await supabase.from('agents').update({
            shop_name: sel.shop_name,
            area: sel.area,
            locality_id: sel.locality_id,
            preferred_radius_km: sel.preferred_radius_km,
            wallet_balance: sel.amount_paid,
            is_verified: sel.is_verified,
            email: sel.email
        }).eq('id', sel.id);

        // 2. Update Brand Mappings (Delete all, then Re-insert)
        await supabase.from('dealer_brand_mapping').delete().eq('agent_id', sel.id);
        if (sel.brandIds.length > 0) {
            const inserts = sel.brandIds.map(bId => ({ agent_id: sel.id, brand_id: bId }));
            await supabase.from('dealer_brand_mapping').insert(inserts);
        }

        setSel(null);
        await loadData();
    }

    // Toggle array item helper
    const toggleBrand = (bId) => {
        if (sel.brandIds.includes(bId)) {
            setSel({ ...sel, brandIds: sel.brandIds.filter(id => id !== bId) });
        } else {
            setSel({ ...sel, brandIds: [...sel.brandIds, bId] });
        }
    };

    if (!logged) {
        return (
            <div style={{ padding: 40, textAlign: 'center', background: C.bg, minHeight: '100vh', color: '#fff', fontFamily: 'system-ui' }}>
                <h1 style={{ color: C.gold }}>Admin Control Room</h1>
                <p style={{ color: C.mut, marginBottom: 30 }}>Restricted Area. Enter Master Password.</p>
                <input
                    type="password"
                    value={authPass}
                    onChange={e => setAuthPass(e.target.value)}
                    style={{ padding: '14px 20px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: 16 }}
                    placeholder="Enter admin2026"
                />
                <br /><br />
                <button onClick={() => authPass === 'admin2026' && setLogged(true)} style={{ ...oB, padding: '12px 30px', fontSize: 16 }}>Activate</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px 40px', background: C.bg, minHeight: '100vh', color: '#fff', fontFamily: 'system-ui' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1e293b' }}>
                <h1 style={{ color: C.gold, margin: 0, fontSize: 24 }}>HeyBuddy Back-Office</h1>
                <button onClick={loadData} style={{ ...oB, padding: '8px 16px', fontSize: 13, background: '#1e293b', border: '1px solid #334155' }}>{loading ? 'Syncing...' : 'Refresh Engines'}</button>
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
                {/* LEFT COL: Dealer List */}
                <div style={{ flex: 1, ...cd, maxHeight: '80vh', overflowY: 'auto', background: 'transparent', borderColor: '#1e293b', padding: 16 }}>
                    <h3 style={{ marginTop: 0, color: C.sec, fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Dealer Approvals ({dealers.length})</h3>
                    {dealers.map(d => (
                        <div key={d.id} onClick={() => openDealer(d)} style={{ padding: 14, background: sel?.id === d.id ? '#1e293b' : C.card, marginBottom: 10, borderRadius: 8, cursor: 'pointer', border: `1px solid ${d.is_verified ? C.grn + '55' : C.org + '88'}`, transition: '0.2s' }}>
                            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{d.shop_name} {!d.is_verified && <span style={{ color: C.org, fontSize: 12 }}>● Pending</span>}</div>
                            <div style={{ fontSize: 12, color: C.mut }}>{d.phone} • {d.area}</div>
                        </div>
                    ))}
                </div>

                {/* MIDDLE COL: Selected Dealer Editor */}
                <div style={{ flex: 1.5, ...cd, maxHeight: '80vh', overflowY: 'auto', background: '#0f172a', borderColor: '#1e293b', padding: 24 }}>
                    {sel ? (
                        <div>
                            <h3 style={{ marginTop: 0, color: C.gold, fontSize: 18, borderBottom: '1px solid #334155', paddingBottom: 12 }}>Modify Algorithm Parameters</h3>

                            <label style={labelStyle}>Shop Name</label>
                            <input value={sel.shop_name || ''} onChange={e => setSel({ ...sel, shop_name: e.target.value })} style={inputStyle} />

                            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Phone Number (Login ID)</label>
                                    <input value={sel.phone || ''} readOnly style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Alert Email (Resend Target)</label>
                                    <input value={sel.email || ''} onChange={e => setSel({ ...sel, email: e.target.value })} style={inputStyle} />
                                </div>
                            </div>

                            <label style={{ ...labelStyle, marginTop: 16 }}>Store Physical Address</label>
                            <input value={sel.area || ''} onChange={e => setSel({ ...sel, area: e.target.value })} style={inputStyle} />

                            <div style={{ background: '#1e293b', padding: 16, borderRadius: 8, marginTop: 24, border: '1px solid #334155' }}>
                                <h4 style={{ margin: '0 0 12px 0', color: '#38bdf8', fontSize: 14 }}>Geographic Reach (Radius)</h4>
                                <label style={labelStyle}>Master Locality Anchor</label>
                                <select value={sel.locality_id || ''} onChange={e => setSel({ ...sel, locality_id: e.target.value })} style={inputStyle}>
                                    <option value="">-- Unassigned (Cannot receive leads) --</option>
                                    {localities.map(l => <option key={l.id} value={l.id}>{l.name} ({l.city})</option>)}
                                </select>

                                <label style={{ ...labelStyle, marginTop: 16 }}>Service Radius (KM) for Hyper-Local Fetching</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <input type="range" min="1" max="50" step="0.5" value={sel.preferred_radius_km || 5} onChange={e => setSel({ ...sel, preferred_radius_km: parseFloat(e.target.value) })} style={{ flex: 1 }} />
                                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 18, background: '#020617', padding: '4px 12px', borderRadius: 6, border: '1px solid #334155' }}>{sel.preferred_radius_km || 5} KM</div>
                                </div>
                            </div>

                            <label style={{ ...labelStyle, marginTop: 24 }}>Authorized Inventory Mappings (Brands)</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                                {brands.map(b => (
                                    <div
                                        key={b.id}
                                        onClick={() => toggleBrand(b.id)}
                                        style={{ padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: sel.brandIds?.includes(b.id) ? C.gold + '22' : '#1e293b', border: `1px solid ${sel.brandIds?.includes(b.id) ? C.gold : '#334155'}`, color: sel.brandIds?.includes(b.id) ? C.gold : C.mut, transition: '0.2s' }}
                                    >
                                        {sel.brandIds?.includes(b.id) && '✓ '} {b.name}
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px dashed #334155', margin: '24px 0' }} />

                            <label style={labelStyle}>Amount Paid / Wallet Credits (Rs)</label>
                            <input type="number" value={sel.amount_paid || 0} onChange={e => setSel({ ...sel, amount_paid: parseInt(e.target.value) })} style={{ ...inputStyle, background: '#022c22', border: '1px solid #10b981', color: '#10b981', fontSize: 18, fontWeight: 700 }} />

                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 24, marginBottom: 32, gap: 12, background: sel.is_verified ? C.grn + '11' : C.org + '11', padding: 16, borderRadius: 8, border: `1px solid ${sel.is_verified ? C.grn : C.org}` }}>
                                <input type="checkbox" checked={sel.is_verified || false} onChange={e => setSel({ ...sel, is_verified: e.target.checked })} style={{ width: 22, height: 22, accentColor: C.grn }} />
                                <span style={{ fontWeight: 700, fontSize: 15, color: sel.is_verified ? C.grn : C.org }}>{sel.is_verified ? 'ACCOUNT IS VERIFIED & ACTIVE' : 'PENDING ACTIVATION'}</span>
                            </div>

                            <button onClick={saveDealer} style={{ ...oB, width: '100%', background: C.gold, color: '#000', border: 'none', padding: '16px', fontSize: 16, fontWeight: 800, borderRadius: 8, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                                {loading ? 'Committing Changes...' : 'Save & Push to Algorithm Engine'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ color: C.mut, textAlign: 'center', marginTop: 120 }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
                            Select a dealer to configure their location mapping<br />and hyper-local algorithm targets.
                        </div>
                    )}
                </div>

                {/* RIGHT COL: Live Leads Log */}
                <div style={{ flex: 1, ...cd, maxHeight: '80vh', overflowY: 'auto', background: 'transparent', borderColor: '#1e293b', padding: 16 }}>
                    <h3 style={{ marginTop: 0, color: '#38bdf8', fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Live Request Feed</h3>
                    {leads.map(l => (
                        <div key={l.id} style={{ padding: 14, background: '#0f172a', marginBottom: 10, borderRadius: 8, border: '1px solid #1e293b' }}>
                            <div style={{ fontSize: 11, color: C.mut, marginBottom: 6, fontWeight: 600 }}>{new Date(l.created_at).toLocaleString()}</div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 2 }}>{l.brand_master?.name || 'Any Brand'} {l.category}</div>
                            <div style={{ fontSize: 13, color: '#38bdf8' }}>📍 {l.locality_master?.name || l.location}</div>
                        </div>
                    ))}
                    {leads.length === 0 && <div style={{ fontSize: 13, color: C.mut }}>No leads captured yet.</div>}
                </div>
            </div>
        </div>
    );
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: C.mut, marginBottom: 6, textTransform: 'uppercase' };
const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: '#020617',
    border: '1px solid #334155',
    borderRadius: 8,
    color: '#fff',
    fontSize: 15,
    marginBottom: 8,
    boxSizing: 'border-box',
    outline: 'none',
    transition: '0.2s'
};
