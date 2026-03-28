import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, oB, sI } from '../../constants/styles';
import { StatusBadge } from '../../components/ui/Badge';
import { Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function QuoteInbox() {
    const { buyer, setScr } = useApp();
    const [quotes, setQuotes] = useState([]);
    const [co, setCo] = useState('');
    const [showCo, setShowCo] = useState(null);

    useEffect(() => {
        async function load() {
            if (!buyer?.id) return;
            const { data } = await supabase
                .from('quotes')
                .select('*, requirements!inner(buyer_id)')
                .eq('requirements.buyer_id', buyer.id)
                .order('created_at', { ascending: false });
            if (data) setQuotes(data);
        }
        load();
    }, [buyer?.id]);

    async function accept(id) {
        await supabase.from('quotes').update({ status: 'accepted' }).eq('id', id);
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: 'accepted' } : q));
    }

    async function counter(id) {
        const price = parseInt(co);
        if (!price) return;
        await supabase.from('quotes').update({ status: 'countered', counter_price: price }).eq('id', id);
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: 'countered', counter_price: price } : q));
        setShowCo(null);
        setCo('');
    }

    const best = quotes.length ? Math.min(...quotes.map(q => q.price)) : 0;

    return (
        <div style={{ padding: '24px 20px' }}>
            <BackButton onClick={() => setScr('profile')} />
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>Quotes ({quotes.length})</h2>

            {quotes.length === 0 && (
                <div style={{ textAlign: 'center', padding: 32, color: C.mut }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                    Waiting for store quotes…
                </div>
            )}

            {best > 0 && (
                <div style={{ ...cd, marginBottom: 16, borderColor: C.grn + '44', background: C.grn + '08', padding: '12px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.grn }}>Best: Rs.{best.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 11, color: C.sec, marginTop: 4 }}>
                        from {quotes.reduce((a, b) => a.price < b.price ? a : b)?.product_name}
                    </div>
                </div>
            )}

            {quotes.map(q => (
                <div key={q.id} style={{ ...cd, marginBottom: 10, borderColor: q.status === 'accepted' ? C.grn + '44' : C.brd }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>{q.product_name}</div>
                            <div style={{ fontSize: 11, color: C.mut }}>
                                {new Date(q.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <StatusBadge s={q.status} />
                    </div>

                    <div style={{ background: C.surf, borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: q.price === best ? C.grn : C.gold }}>
                            Rs.{q.price.toLocaleString('en-IN')}{q.price === best ? ' (lowest)' : ''}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 10 }}>
                            {q.installation && <span style={{ color: C.org }}>{Ic.wrench()} {q.installation}</span>}
                            {q.warranty && <span style={{ color: C.grn }}>{Ic.shield()} {q.warranty}</span>}
                        </div>
                        {q.counter_price && (
                            <div style={{ marginTop: 8, fontSize: 12, color: C.blu }}>Your counter: Rs.{q.counter_price.toLocaleString('en-IN')}</div>
                        )}
                    </div>

                    {q.status === 'pending' && (
                        <div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <button style={{ ...gB, flex: 1, padding: 10, fontSize: 13 }} onClick={() => accept(q.id)}>Accept</button>
                                <button style={{ ...oB, flex: 1, padding: 10, fontSize: 12 }} onClick={() => setShowCo(showCo === q.id ? null : q.id)}>Counter offer</button>
                            </div>
                            {showCo === q.id && (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input style={{ ...sI, flex: 1, padding: '8px 12px' }} placeholder="Rs. Your price" value={co} onChange={e => setCo(e.target.value)} />
                                    <button style={{ ...gB, padding: '8px 16px', fontSize: 12 }} onClick={() => counter(q.id)}>Send</button>
                                </div>
                            )}
                        </div>
                    )}

                    {q.status === 'accepted' && (
                        <div style={{ background: C.grn + '11', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: C.grn }}>
                            {Ic.check()} Accepted
                        </div>
                    )}
                    {q.status === 'countered' && (
                        <div style={{ background: C.blu + '11', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: C.blu }}>
                            Counter sent — waiting for store response
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
