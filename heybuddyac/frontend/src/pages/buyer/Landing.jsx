import { C } from '../../constants/colors';
import { cd } from '../../constants/styles';
import { CATS } from '../../constants/data';
import { catIcon } from '../../components/ui/Icons';
import { useApp } from '../../store/AppContext';

export default function Landing() {
    const { setCat, setScr } = useApp();

    function handleCat(cat) {
        setCat(cat);
        setScr('location');
    }

    return (
        <div style={{ padding: '32px 20px' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                    fontSize: 11, letterSpacing: '0.25em', color: C.gold,
                    textTransform: 'uppercase', marginBottom: 12, fontWeight: 600,
                }}>
                    Research online · Buy offline · Best price
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                    Find the Best <span style={{ color: C.gold }}>Local Deal</span>
                    <br />on Every Appliance
                </h1>
                <p style={{ color: C.sec, fontSize: 14, marginTop: 12 }}>
                    Compare products, get quotes from verified stores near you.
                </p>
            </div>

            {/* Category grid */}
            <div style={{ fontSize: 12, color: C.sec, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontWeight: 600 }}>
                What are you looking to buy?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }}>
                {CATS.map(cat => {
                    const Icon = catIcon[cat.id];
                    return (
                        <div
                            key={cat.id}
                            onClick={() => handleCat(cat)}
                            className="cat-card"
                            style={{ ...cd, padding: '16px 8px', textAlign: 'center', cursor: 'pointer' }}
                        >
                            <div style={{ marginBottom: 6 }}><Icon /></div>
                            <div style={{ fontSize: 10, fontWeight: 600 }}>{cat.name}</div>
                        </div>
                    );
                })}
            </div>

            {/* Stats */}
            <div style={{ ...cd, display: 'flex', justifyContent: 'space-around', textAlign: 'center', background: C.gold + '08', borderColor: C.gold + '22' }}>
                {[['2,400+', 'Stores'], ['18K+', 'Buyers'], ['4.6', 'Rating']].map(([val, label], i) => (
                    <div key={i}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>{val}</div>
                        <div style={{ fontSize: 10, color: C.sec, marginTop: 2 }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
