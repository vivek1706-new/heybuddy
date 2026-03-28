import { useState } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, sI, oB } from '../../constants/styles';
import { CATS } from '../../constants/data';
import { Ic, catIcon } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';

export default function AgentOnboard() {
    const { ph, createAgent, setAgentOnboarded } = useApp();
    const [step, setStep] = useState(0);
    const [shop, setShop] = useState('');
    const [area, setArea] = useState('');
    const [cats, setCats] = useState([]);
    const [amt, setAmt] = useState(1000);
    const [loading, setLoading] = useState(false);

    function tCat(id) {
        setCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    }

    async function handleFinish() {
        setLoading(true);
        await createAgent({
            phone: ph,
            shopName: shop,
            area,
            categories: cats,
            walletBalance: amt,
        });
        setAgentOnboarded(true);
        setLoading(false);
    }

    if (step === 0) return (
        <div style={{ padding: '32px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: C.gold + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    {Ic.trophy()}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Register as Agent</h2>
            </div>

            <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: C.mut, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Shop name</label>
                <input style={sI} placeholder="e.g. Sargam Electronics" value={shop} onChange={e => setShop(e.target.value)} />
            </div>

            <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: C.mut, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Location</label>
                <input style={sI} placeholder="e.g. Sector 18, Noida" value={area} onChange={e => setArea(e.target.value)} />
            </div>

            <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: C.mut, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Categories</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {CATS.map(c => {
                        const Icon = catIcon[c.id];
                        const on = cats.includes(c.id);
                        return (
                            <div key={c.id} onClick={() => tCat(c.id)} style={{ ...cd, padding: '10px 4px', textAlign: 'center', cursor: 'pointer', borderColor: on ? C.gold : C.brd, background: on ? C.gold + '0A' : C.card }}>
                                <div style={{ marginBottom: 3 }}><Icon sz={18} /></div>
                                <div style={{ fontSize: 9, fontWeight: 600, color: on ? C.gold : C.sec }}>{c.name}</div>
                                <div style={{ fontSize: 8, color: C.mut }}>Rs.{c.cost}/lead</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                style={{ ...gB, width: '100%', padding: 14, opacity: shop && area && cats.length ? 1 : 0.4, pointerEvents: shop && area && cats.length ? 'auto' : 'none' }}
                onClick={() => setStep(1)}
            >
                Wallet setup
            </button>
        </div>
    );

    return (
        <div style={{ padding: '32px 20px' }}>
            <BackButton onClick={() => setStep(0)} />
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800 }}>Wallet</h2>
                <p style={{ color: C.sec, fontSize: 13 }}>For marketplace leads only</p>
            </div>

            <div style={{ ...cd, borderColor: C.gold + '33', marginBottom: 20 }}>
                {[
                    ['Assigned = FREE', 'Auto-matched'],
                    ['Full details visible', 'Name, phone'],
                    ['Buy MORE from marketplace', 'Unassigned leads'],
                    ['Dynamic pricing', 'Rs.60-120 by category']
                ].map((x, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.gold + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: C.gold, flexShrink: 0 }}>{i + 1}</div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{x[0]}</div>
                            <div style={{ fontSize: 11, color: C.mut }}>{x[1]}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
                {[500, 1000, 2500, 5000].map(a => (
                    <div key={a} onClick={() => setAmt(a)} style={{ ...cd, padding: '10px 4px', textAlign: 'center', cursor: 'pointer', borderColor: amt === a ? C.gold : C.brd, background: amt === a ? C.gold + '0A' : C.card }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: amt === a ? C.gold : C.txt }}>Rs.{a.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <button style={{ ...gB, width: '100%', padding: 14 }} onClick={handleFinish} disabled={loading}>
                {loading ? 'Processing...' : `Pay Rs.${amt.toLocaleString()} and go live`}
            </button>
        </div>
    );
}
