import { useState } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, oB } from '../../constants/styles';
import { PRODS } from '../../constants/data';
import { StarRating } from '../../components/ui/Badge';
import { Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';

export default function Results() {
    const { cat, setProds, setScr } = useApp();
    const prods = PRODS[cat?.id] || PRODS.ac;
    const [sel, setSel] = useState([]);
    const [showEmi, setShowEmi] = useState(null);

    function toggleSel(id) {
        setSel(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }

    function handleGetPrice() {
        const selected = prods.filter(p => sel.includes(p.id));
        setProds(selected);
        setScr('confirm');
    }

    return (
        <div style={{ padding: '24px 20px' }}>
            <BackButton onClick={() => setScr('quiz')} />
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>Best {cat?.name}s for you</h2>
            <p style={{ color: C.gold, fontSize: 12, margin: '0 0 16px', fontWeight: 600 }}>Select models to get offline price</p>

            {prods.map(prod => {
                const on = sel.includes(prod.id);
                return (
                    <div key={prod.id} style={{ ...cd, padding: 0, overflow: 'hidden', marginBottom: 12, borderColor: on ? C.gold : C.brd }}>
                        {/* Select row */}
                        <div
                            onClick={() => toggleSel(prod.id)}
                            style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', background: on ? C.gold + '08' : 'transparent' }}
                        >
                            <div style={{
                                width: 22, height: 22, borderRadius: 6,
                                border: '2px solid ' + (on ? C.gold : C.brd),
                                background: on ? C.gold : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{prod.name}</div>
                                <div style={{ fontSize: 11, color: C.mut }}>{prod.model}</div>
                            </div>
                            <StarRating r={prod.rating} />
                        </div>

                        {/* Details */}
                        <div style={{ padding: '0 16px 14px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                                {Object.entries(prod.specs).map(([k, v]) => (
                                    <span key={k} style={{ background: C.surf, border: '1px solid ' + C.brd, borderRadius: 6, padding: '3px 8px', fontSize: 10, color: C.sec }}>
                                        {k}: <span style={{ color: C.txt, fontWeight: 500 }}>{v}</span>
                                    </span>
                                ))}
                            </div>

                            <div style={{ background: C.surf, borderRadius: 8, padding: '10px 12px', marginBottom: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <div>
                                        <div style={{ fontSize: 10, color: C.mut }}>Est. range</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>Rs.{prod.price}</div>
                                    </div>
                                    <span style={{ fontSize: 9, color: C.mut, background: C.gold + '11', padding: '2px 6px', borderRadius: 4 }}>Indicative</span>
                                </div>
                                <div style={{ fontSize: 10, color: C.mut, fontStyle: 'italic', marginBottom: 6 }}>Source: {prod.src}</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: C.blu }}>{Ic.emi()} Rs.{prod.emi}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: C.org }}>{Ic.wrench()} {prod.install}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: C.grn }}>{Ic.shield()} {prod.warranty}</span>
                                </div>
                            </div>

                            <div
                                onClick={() => setShowEmi(showEmi === prod.id ? null : prod.id)}
                                style={{ fontSize: 11, color: C.blu, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                                {Ic.emi()} Check EMI options
                            </div>

                            {showEmi === prod.id && (
                                <div style={{ ...cd, padding: 10, marginTop: 8, background: C.blu + '08', borderColor: C.blu + '33' }}>
                                    {[['HDFC', 'Rs.1,890/mo x24 (0%)'], ['Bajaj', 'Rs.1,950/mo x24'], ['ICICI', 'Rs.2,100/mo x18']].map(([bank, detail], i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 2 ? '1px solid ' + C.brd : 'none' }}>
                                            <span style={{ fontSize: 12, color: C.sec }}>{bank}</span>
                                            <span style={{ fontSize: 12, color: C.txt, fontWeight: 600 }}>{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            <div style={{ ...cd, borderColor: C.blu + '33', background: C.blu + '08', marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: C.gold }} />
                    <span style={{ fontSize: 12, color: C.sec }}>Ask agents to suggest alternatives</span>
                </label>
            </div>

            {/* Sticky CTA */}
            <div style={{ position: 'sticky', bottom: 0, background: C.dark, paddingTop: 12, paddingBottom: 8 }}>
                <button
                    style={{ ...gB, width: '100%', padding: 14, opacity: sel.length ? 1 : 0.4, pointerEvents: sel.length ? 'auto' : 'none' }}
                    onClick={handleGetPrice}
                >
                    Get best price for {sel.length} model{sel.length !== 1 ? 's' : ''}
                </button>
            </div>
        </div>
    );
}
