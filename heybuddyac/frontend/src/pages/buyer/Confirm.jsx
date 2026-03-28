import { useState } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, oB } from '../../constants/styles';
import { STORES } from '../../constants/data';
import { Ic } from '../../components/ui/Icons';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function Confirm() {
    const { prods, loc, ph, buyer, cat, reset } = useApp();
    const [extraIds, setExtraIds] = useState([]);
    const [adding, setAdding] = useState(false);
    const [showInstall, setShowInstall] = useState(false);
    const [slot, setSlot] = useState('');
    const [saved, setSaved] = useState(false);

    // Save requirement to Supabase on mount (once)
    useState(() => {
        async function save() {
            if (!buyer?.id || saved) return;
            const { data: req } = await supabase.from('requirements').insert({
                buyer_id: buyer.id,
                category: cat?.name || '',
                location: loc,
                products: prods,
                status: 'active',
            }).select().single();

            // Create marketplace lead
            if (req) {
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
                    text: `Request sent to ${5 + extraIds.length} stores for ${cat?.name}`,
                });
            }
            setSaved(true);
        }
        save();
    }, []);

    return (
        <div style={{ padding: '24px 20px' }}>
            {/* Success icon */}
            <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: C.grn + '22', border: '2px solid ' + C.grn,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
            }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.grn} strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', margin: '0 0 4px' }}>Requirement sent!</h2>
            <p style={{ color: C.sec, fontSize: 13, textAlign: 'center', marginBottom: 4 }}>
                <span style={{ color: C.gold, fontWeight: 600 }}>{prods.length} model{prods.length > 1 ? 's' : ''}</span>
                {' to '}
                <span style={{ color: C.gold, fontWeight: 600 }}>{5 + extraIds.length} stores</span>
            </p>
            <p style={{ fontSize: 12, color: C.sec, textAlign: 'center', marginBottom: 4 }}>{Ic.loc()} {loc}</p>
            <p style={{ fontSize: 12, color: C.grn, textAlign: 'center', marginBottom: 20 }}>Verified: +91-{ph}</p>

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
                    Stores ({5 + extraIds.length})
                </div>
                {STORES.slice(0, 5).concat(STORES.filter(s => extraIds.includes(s.id))).map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + C.brd }}>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                            <div style={{ fontSize: 10, color: C.mut }}>{s.dist} — {s.hours}</div>
                        </div>
                        <span style={{ fontSize: 11, color: C.grn }}>{s.resp}</span>
                    </div>
                ))}
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
