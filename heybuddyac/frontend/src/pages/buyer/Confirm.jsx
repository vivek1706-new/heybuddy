import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, oB } from '../../constants/styles';
import { STORES } from '../../constants/data';
import { Ic } from '../../components/ui/Icons';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function Confirm() {
    const { prods, loc, localityId, ph, buyer, cat, reset } = useApp();
    const [matchedDealers, setMatchedDealers] = useState([]);
    const [extraIds, setExtraIds] = useState([]);
    const [adding, setAdding] = useState(false);
    const [showInstall, setShowInstall] = useState(false);
    const [slot, setSlot] = useState('');
    const [saved, setSaved] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Save requirement to Supabase on mount (once)
    async function save() {
        if (!buyer?.id || saved) return;
        setSubmitting(true);
        setError(null);
        try {
            const finalLocalityId = localityId;

            // 2. Map Brand to Brand Master UUID
            const brandGuess = prods[0]?.name?.split(' ')[0] || 'LG';
            const { data: brandData } = await supabase
                .from('brand_master')
                .select('id')
                .ilike('name', brandGuess)
                .limit(1);
            const brandId = brandData?.[0]?.id || null;

            // 3. Insert Requirement
            const { data: req, error: reqErr } = await supabase.from('requirements').insert({
                buyer_id: buyer.id,
                category: cat?.name || '',
                location: loc,
                locality_id: finalLocalityId,
                brand_id: brandId,
                products: prods,
                status: 'active',
            }).select().single();

            if (reqErr) throw reqErr;

            if (req) {
                // 4. Hyper-Local 5KM Distribution Engine
                let eligibleDealerIds = [];
                if (finalLocalityId) {
                    const { data: neighbors } = await supabase
                        .from('locality_5km_map')
                        .select('source_lmterfnum')
                        .eq('nearby_lmterfnum', finalLocalityId);
                    
                    const nearIds = (neighbors || []).map(n => n.source_lmterfnum);
                    nearIds.push(finalLocalityId);

                    const { data: matchedAgents } = await supabase
                        .from('agents')
                        .select('id, shop_name, phone, email, area')
                        .in('locality_id', nearIds);
                    
                    setMatchedDealers(matchedAgents || []);
                    eligibleDealerIds = (matchedAgents || []).map(a => a.id);

                    // Create Lead Assignments
                    if (eligibleDealerIds.length > 0) {
                        const assignments = eligibleDealerIds.map(id => ({
                            requirement_id: req.id,
                            agent_id: id,
                            status: 'new'
                        }));
                        await supabase.from('lead_assignments').insert(assignments);
                    }
                }

                // 5. Fetch Matched Emails and Fire API!
                const { data: assignments } = await supabase
                    .from('lead_assignments')
                    .select('agent_id, agents(email)')
                    .eq('requirement_id', req.id);

                const dealerEmails = assignments?.map(a => a.agents?.email).filter(e => e) || [];

                if (dealerEmails.length > 0) {
                    await fetch('/api/send-lead-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            dealerEmails,
                            buyerPhone: ph,
                            leadDetails: {
                                category: cat?.name || 'Category',
                                brand: prods[0]?.name?.split(' ')[0] || 'Requested Brand',
                                location: loc
                            }
                        })
                    }).catch(err => console.error("Email trigger failed:", err));
                }

                // (Fallback) Create public marketplace lead
                await supabase.from('marketplace_leads').insert({
                    requirement_id: req.id,
                    category: cat?.name || '',
                    area: loc.split(',')[0],
                    model: prods.map(p => p.name).join(', '),
                    budget: prods[0]?.price || '',
                    cost: cat?.cost || 100,
                });

                // Notification for buyer
                await supabase.from('notifications').insert({
                    buyer_id: buyer.id,
                    text: `Request sent to local dealers via hyper-local engine for ${cat?.name}`,
                });

                setSaved(true);
            }
        } catch (err) {
            console.error('Submission failed:', err);
            setError('We encountered a problem sending your request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        save();
    }, []);

    if (error) return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ color: C.red, fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Submission Error</h2>
            <p style={{ color: C.sec, fontSize: 13, marginBottom: 24 }}>{error}</p>
            <button style={{ ...gB, width: '100%', padding: 14 }} onClick={save}>Retry Submission</button>
            <button style={{ ...oB, width: '100%', marginTop: 12 }} onClick={reset}>Back to Start</button>
        </div>
    );

    if (submitting) return (
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${C.gold}33`, borderTopColor: C.gold, borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Securing your lead...</h2>
            <p style={{ color: C.sec, fontSize: 13 }}>Connecting to optimized local routing node.</p>
        </div>
    );

    return (
        <div style={{ padding: '24px 20px' }}>
            {/* Dynamic Status Icon */}
            <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: (matchedDealers.length > 0 ? C.grn : C.gold) + '22', 
                border: '2px solid ' + (matchedDealers.length > 0 ? C.grn : C.gold),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
            }}>
                {matchedDealers.length > 0 ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.grn} strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <div style={{ color: C.gold }}>{Ic.search({ sz: 28 })}</div>
                )}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', margin: '0 0 4px' }}>
                {matchedDealers.length > 0 ? 'Requirement sent!' : 'No local dealers found yet'}
            </h2>
            <p style={{ color: C.sec, fontSize: 13, textAlign: 'center', marginBottom: 12, padding: '0 20px', lineHeight: 1.4 }}>
                {matchedDealers.length > 0 
                    ? <span><span style={{ color: C.gold, fontWeight: 600 }}>{prods.length} model{prods.length > 1 ? 's' : ''}</span> matched with <span style={{ color: C.gold, fontWeight: 600 }}>{matchedDealers.length} stores</span></span>
                    : `We've received your requirement for ${cat?.name}. Since no authorized dealers are currently mapped within 5km of your location, we've posted this to our global marketplace for manual matching.`
                }
            </p>
            <div style={{ fontSize: 12, color: C.sec, textAlign: 'center', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {Ic.loc()} {loc}
            </div>
            <div style={{ fontSize: 12, color: C.grn, textAlign: 'center', marginBottom: 20, fontWeight: 600 }}>Verified: +91-{ph}</div>

            {/* Models */}
            <div style={{ ...cd, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>Models</div>
                {prods.map(p => (
                    <div key={p.id} style={{ fontSize: 13, color: C.sec, marginBottom: 3 }}>— {p.name}</div>
                ))}
            </div>

            {/* Stores */}
            <div style={{ ...cd, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 8 }}>
                    Authorized Local Dealers ({matchedDealers.length})
                </div>
                {matchedDealers.length > 0 ? (
                    matchedDealers.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid ' + C.brd }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.shop_name}</div>
                                <div style={{ fontSize: 11, color: C.mut }}>{s.area} — Verified Portal Seller</div>
                            </div>
                            <span style={{ fontSize: 11, color: C.grn, background: C.grn + '15', padding: '2px 8px', borderRadius: 4, height: 'fit-content' }}>Matched</span>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: C.mut, fontSize: 13 }}>
                        No dealers found within explicitly mapped 5km routing paths for this locality.
                    </div>
                )}
                {!adding && STORES.length > 5 && (
                    <button style={{ ...oB, width: '100%', marginTop: 10, fontSize: 12 }} onClick={() => setAdding(true)}>
                        + Add more stores
                    </button>
                )}
                {adding && STORES.slice(5).filter(s => !extraIds.includes(s.id)).map(s => (
                    <div
                        key={s.id}
                        onClick={() => setExtraIds(prev => [...prev, s.id])}
                        style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid ' + C.brd, cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                        <span style={{ fontSize: 12, color: C.gold }}>+ Add</span>
                    </div>
                ))}
            </div>

            {/* Installation booking */}
            <div style={{ ...cd, marginBottom: 14, borderColor: C.org + '33' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    {Ic.truck()}
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.org }}>Pre-book installation (optional)</span>
                </div>
                {!showInstall
                    ? (
                        <button style={{ ...oB, width: '100%', fontSize: 12, borderColor: C.org, color: C.org }} onClick={() => setShowInstall(true)}>
                            Schedule installation
                        </button>
                    ) : (
                        <div>
                            <div style={{ fontSize: 11, color: C.mut, marginBottom: 6 }}>Preferred time slot</div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                {['9AM-12PM', '12PM-3PM', '3PM-6PM'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSlot(s)}
                                        style={{ ...oB, padding: '6px 12px', fontSize: 11, borderRadius: 16, borderColor: slot === s ? C.org : C.brd, color: slot === s ? C.org : C.sec, background: slot === s ? C.org + '15' : 'transparent' }}
                                    >{s}</button>
                                ))}
                            </div>
                            {slot && (
                                <div style={{ background: C.grn + '11', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: C.grn }}>
                                    {Ic.check()} Preference saved for {slot}
                                </div>
                            )}
                        </div>
                    )
                }
            </div>

            <button style={{ ...oB, width: '100%' }} onClick={reset}>Browse more</button>
        </div>
    );
}
