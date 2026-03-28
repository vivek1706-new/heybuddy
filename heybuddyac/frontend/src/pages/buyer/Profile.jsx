import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, oB } from '../../constants/styles';
import { StatusBadge } from '../../components/ui/Badge';
import { Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function Profile() {
    const { ph, buyer, setScr } = useApp();
    const [reqs, setReqs] = useState([]);

    useEffect(() => {
        async function load() {
            if (!buyer?.id) return;
            const { data } = await supabase
                .from('requirements')
                .select('*, quotes(count)')
                .eq('buyer_id', buyer.id)
                .order('created_at', { ascending: false });
            if (data) setReqs(data);
        }
        load();
    }, [buyer?.id]);

    async function cancelReq(id) {
        await supabase.from('requirements').update({ status: 'cancelled' }).eq('id', id);
        setReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
    }

    return (
        <div style={{ padding: '24px 20px' }}>
            <BackButton onClick={() => setScr('landing')} />

            {/* User header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: C.gold + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Ic.user()}
                </div>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>My Profile</div>
                    <div style={{ fontSize: 12, color: C.mut }}>+91-{ph}</div>
                </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>My Requests</div>

            {reqs.length === 0 && (
                <div style={{ textAlign: 'center', padding: 32, color: C.mut }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                    No requests yet. Browse appliances to get started!
                </div>
            )}

            {reqs.map(r => {
                const quoteCount = r.quotes?.[0]?.count || 0;
                return (
                    <div key={r.id} style={{ ...cd, marginBottom: 10, opacity: r.status === 'cancelled' ? 0.5 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{r.category} — {r.location}</div>
                            <StatusBadge s={r.status} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.mut, marginBottom: 8 }}>
                            <span>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            {quoteCount > 0 && (
                                <span style={{ color: C.gold, cursor: 'pointer' }} onClick={() => setScr('quotes')}>
                                    {quoteCount} quote{quoteCount > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        {r.status === 'active' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                                {quoteCount > 0 && (
                                    <button style={{ ...gB, flex: 1, padding: 8, fontSize: 12 }} onClick={() => setScr('quotes')}>
                                        View quotes
                                    </button>
                                )}
                                <button
                                    style={{ ...oB, padding: '8px 12px', fontSize: 11, borderColor: C.red, color: C.red }}
                                    onClick={() => cancelReq(r.id)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
