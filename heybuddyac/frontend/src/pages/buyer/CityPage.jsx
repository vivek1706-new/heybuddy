import { C } from '../../constants/colors';
import { cd, gB } from '../../constants/styles';
import { catIcon } from '../../components/ui/Icons';
import { CATS } from '../../constants/data';
import { NOIDA_LOCALITIES } from '../../constants/localities';
import { useApp } from '../../store/AppContext';

export default function CityPage() {
    const { setCat, setScr } = useApp();
    const noida = NOIDA_LOCALITIES.filter(l => l.city === 'Noida');
    const greaterNoida = NOIDA_LOCALITIES.filter(l => l.city === 'Greater Noida');

    function handleCat(cat) {
        setCat(cat);
        window.history.replaceState(null, '', '/');
        setScr('location');
    }

    return (
        <div style={{ padding: '32px 20px' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>
                    Electronics Dealers in <span style={{ color: C.gold }}>Noida & Greater Noida</span>
                </h1>
                <p style={{ color: C.sec, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    Find verified local dealers for AC, Fridge, TV, Laptop and more.
                    Compare prices from stores near your locality.
                </p>
            </div>

            {/* Quick category select */}
            <div style={{ ...cd, marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
                    Shop by Category
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {CATS.map(cat => {
                        const Icon = catIcon[cat.id];
                        return (
                            <div key={cat.id} onClick={() => handleCat(cat)}
                                style={{ ...cd, padding: '12px 4px', textAlign: 'center', cursor: 'pointer' }}>
                                <div style={{ marginBottom: 4 }}><Icon sz={20} /></div>
                                <div style={{ fontSize: 9, fontWeight: 600, color: C.sec }}>{cat.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Noida localities */}
            <div style={{ ...cd, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
                    Noida Localities ({noida.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {noida.map(l => (
                        <a key={l.id} href={'/' + l.slug}
                            style={{
                                background: C.surf, border: '1px solid ' + C.brd,
                                borderRadius: 8, padding: '10px 14px', fontSize: 12,
                                color: C.sec, textDecoration: 'none', cursor: 'pointer',
                                display: 'block',
                            }}
                            onClick={e => { e.preventDefault(); window.location.href = '/' + l.slug; }}>
                            <div style={{ fontWeight: 600, color: C.txt, marginBottom: 2 }}>{l.name}</div>
                            <div style={{ fontSize: 10, color: C.mut }}>Dealers in {l.name}, {l.city}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Greater Noida localities */}
            <div style={{ ...cd, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
                    Greater Noida Localities ({greaterNoida.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {greaterNoida.map(l => (
                        <a key={l.id} href={'/' + l.slug}
                            style={{
                                background: C.surf, border: '1px solid ' + C.brd,
                                borderRadius: 8, padding: '10px 14px', fontSize: 12,
                                color: C.sec, textDecoration: 'none', cursor: 'pointer',
                                display: 'block',
                            }}
                            onClick={e => { e.preventDefault(); window.location.href = '/' + l.slug; }}>
                            <div style={{ fontWeight: 600, color: C.txt, marginBottom: 2 }}>{l.name}</div>
                            <div style={{ fontSize: 10, color: C.mut }}>Dealers in {l.name}, {l.city}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* SEO content */}
            <div style={{ ...cd, marginBottom: 16, borderColor: C.gold + '22' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>
                    About HeyBuddy in Noida
                </div>
                <p style={{ fontSize: 12, color: C.sec, lineHeight: 1.6, margin: 0 }}>
                    HeyBuddy connects you with verified local electronics dealers across Noida and Greater Noida.
                    Whether you're looking for the best price on a Daikin AC in Sector 62, a Samsung refrigerator
                    in Sector 18, or an Apple laptop in Sector 44 — our hyperlocal matching engine finds dealers
                    within 5km of your location who stock the exact brand and model you need.
                    Research online, visit the store, and buy at the best offline price.
                </p>
            </div>

            {/* CTA */}
            <button style={{ ...gB, width: '100%', padding: 14 }}
                onClick={() => { window.history.replaceState(null, '', '/'); setScr('landing'); }}>
                Start Shopping
            </button>
        </div>
    );
}
