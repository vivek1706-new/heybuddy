import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, oB, sI } from '../../constants/styles';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import { Ic } from '../../components/ui/Icons';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function AgentDash() {
    const { agent, updateAgentWallet } = useApp();
    const [mt, setMt] = useState('assigned');   // 'assigned' | 'marketplace'
    const [st, setSt] = useState('all');        // 'all' | 'new' | 'contacted'
    const [asl, setAsl] = useState([]);         // assigned leads
    const [mkl, setMkl] = useState([]);         // marketplace leads
    const [anim, setAnim] = useState(null);
    const [sq, setSq] = useState(null);
    const [qv, setQv] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLeads();
    }, [agent]);

    async function loadLeads() {
        if (!agent) return;
        setLoading(true);

        // Load leads purchased by this agent (Assigned Leads)
        const { data: purchased } = await supabase
            .from('lead_purchases')
            .select('marketplace_leads(*)')
            .eq('agent_id', agent.id);

        if (purchased) {
            setAsl(purchased.map(p => p.marketplace_leads));
        }

        // Load available marketplace leads
        const { data: marketplace } = await supabase
            .from('marketplace_leads')
            .select('*')
            .eq('is_available', true);

        if (marketplace) setMkl(marketplace);
        setLoading(false);
    }

    async function buyLead(lead) {
        if (!agent || agent.wallet_balance < lead.cost) return;

        setLoading(true);
        // 1. Deduct wallet
        await updateAgentWallet(agent.id, -lead.cost, 'lead_purchase', `Unlocked lead: ${lead.buyer}`);

        // 2. Register purchase
        await supabase.from('lead_purchases').insert({
            agent_id: agent.id,
            lead_id: lead.id,
            cost: lead.cost
        });

        // 3. Update marketplace lead availability (if limit reached)
        // For demo, we just remove it from marketplace
        await supabase.from('marketplace_leads').update({ is_available: false }).eq('id', lead.id);

        setAnim(lead.id);
        setTimeout(() => setAnim(null), 1200);

        // Local update
        setMkl(prev => prev.filter(x => x.id !== lead.id));
        setAsl(prev => [...prev, lead]);
        setLoading(false);
    }

    const leadsToShow = mt === 'assigned' ? asl : mkl;
    const score = asl.length > 5 ? 'Gold' : asl.length > 2 ? 'Silver' : 'Bronze';

    return (
        <div style={{ padding: '24px 20px' }}>
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                    <div style={{ fontSize: 13, color: C.sec }}>Workshop / Store</div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: '4px 0 0' }}>{agent?.shop_name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        {Ic.trophy()}
                        <span style={{ fontSize: 12, fontWeight: 700, color: score === 'Gold' ? C.gold : C.sec }}>{score} Agent</span>
                    </div>
                </div>
                <div style={{ ...cd, padding: '8px 12px', textAlign: 'center', background: C.gold + '0A', borderColor: C.gold + '33', position: 'relative' }}>
                    <div style={{ fontSize: 10, color: C.mut }}>WALLET</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: agent?.wallet_balance > 200 ? C.gold : C.red }}>
                        Rs.{agent?.wallet_balance?.toLocaleString()}
                    </div>
                    {anim && <div style={{ position: 'absolute', top: -8, right: -4, background: C.red, color: C.txt, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, animation: 'slideUp 1s ease forwards' }}>Deducted</div>}
                </div>
            </div>

            <div style={{ display: 'flex', marginBottom: 16, borderRadius: 10, overflow: 'hidden', border: '1px solid ' + C.brd }}>
                <button onClick={() => setMt('assigned')} style={{ flex: 1, padding: '12px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: mt === 'assigned' ? C.gold + '22' : 'transparent', color: mt === 'assigned' ? C.gold : C.mut }}>
                    My Leads ({asl.length})
                </button>
                <button onClick={() => setMt('marketplace')} style={{ flex: 1, padding: '12px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: mt === 'marketplace' ? C.blu + '22' : 'transparent', color: mt === 'marketplace' ? C.blu : C.mut, borderLeft: '1px solid ' + C.brd, display: 'flex', alignItems: 'center', justify: 'center', gap: 6 }}>
                    {Ic.cart()} Buy ({mkl.length})
                </button>
            </div>

            {mt === 'assigned' ? (
                <div>
                    {asl.length === 0 && <div style={{ textAlign: 'center', padding: 28, color: C.mut }}>No leads yet. Buy from marketplace to get started!</div>}
                    {asl.map(l => (
                        <div key={l.id} style={{ ...cd, marginBottom: 10, borderColor: C.brd }}>
                            <div style={{ display: 'flex', justify: 'space-between', marginBottom: 6 }}>
                                <div><span style={{ fontSize: 14, fontWeight: 700 }}>Buyer {l.id.slice(0, 4)}</span><div style={{ fontSize: 11, color: C.sec }}>{l.area}</div></div>
                                <div style={{ textAlign: 'right' }}><div style={{ fontSize: 10, color: C.mut }}>Today</div></div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                                <Badge bg={C.gold + '15'} c={C.gold}>{l.category}</Badge>
                                <Badge bg={C.surf} c={C.sec}>{l.model}</Badge>
                                <Badge bg={C.blu + '15'} c={C.blu}>UNLOCKED</Badge>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button style={{ ...gB, flex: 1, padding: 10, fontSize: 13 }}>{Ic.phone()} Call</button>
                                <button style={{ ...oB, padding: '10px 14px', fontSize: 11 }}>{Ic.send()} Quote</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {mkl.length === 0 && <div style={{ textAlign: 'center', padding: 28, color: C.mut }}>No marketplace leads available right now.</div>}
                    {mkl.map(l => (
                        <div key={l.id} style={{ ...cd, marginBottom: 10, borderColor: C.blu + '33' }}>
                            <div style={{ display: 'flex', justify: 'space-between', marginBottom: 6 }}>
                                <div><span style={{ fontSize: 14, fontWeight: 700 }}>Nearby Buyer</span><div style={{ fontSize: 11, color: C.sec, marginTop: 2 }}>{l.area}</div></div>
                                <div style={{ fontSize: 10, color: C.mut }}>Live</div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                                <Badge bg={C.gold + '15'} c={C.gold}>{l.category}</Badge>
                                <Badge bg={C.surf} c={C.sec}>{l.model}</Badge>
                                <Badge bg={C.blu + '15'} c={C.blu}>Rs.{l.cost}</Badge>
                            </div>
                            <button
                                style={{ ...gB, width: '100%', padding: 10, fontSize: 13, opacity: agent?.wallet_balance >= l.cost ? 1 : 0.4 }}
                                onClick={() => buyLead(l)}
                                disabled={loading}
                            >
                                Buy - Rs.{l.cost}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: "@keyframes slideUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-20px)}}" }} />
        </div>
    );
}
