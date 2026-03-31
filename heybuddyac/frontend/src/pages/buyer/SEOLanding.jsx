import { C } from '../../constants/colors';
import { cd, gB } from '../../constants/styles';
import { catIcon } from '../../components/ui/Icons';
import { useApp } from '../../store/AppContext';
import { CATS } from '../../constants/data';

const BRANDS = {
    ac: ['Daikin', 'LG', 'Voltas', 'Blue Star', 'Samsung', 'Hitachi', 'Carrier', 'Panasonic'],
    fridge: ['Samsung', 'LG', 'Whirlpool', 'Godrej', 'Haier', 'Bosch'],
    washer: ['LG', 'Samsung', 'Bosch', 'IFB', 'Whirlpool', 'Haier'],
    tv: ['Samsung', 'LG', 'Sony', 'TCL', 'Mi', 'OnePlus'],
    laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'],
    mobile: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Google', 'Vivo'],
    purifier: ['Kent', 'Aquaguard', 'Pureit', 'Livpure', 'AO Smith'],
    dishwasher: ['Bosch', 'IFB', 'Samsung', 'LG', 'Siemens'],
};

const CITIES = ['Noida', 'Greater Noida', 'Delhi', 'Gurgaon', 'Ghaziabad', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh'];

export default function SEOLanding() {
    const { cat, setScr } = useApp();
    const city = window._seoCity || null;
    const Icon = catIcon[cat?.id];
    const brands = BRANDS[cat?.id] || [];

    function handleStart() {
        window.history.replaceState(null, '', '/');
        setScr('location');
    }

    return (
        <div style={{ padding: '32px 20px' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: C.gold + '15', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    {Icon && <Icon sz={28} />}
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>
                    Best <span style={{ color: C.gold }}>{cat?.name}</span> Dealers
                    {city ? <> in <span style={{ color: C.gold }}>{city}</span></> : ' Near You'}
                </h1>
                <p style={{ color: C.sec, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    Compare prices from verified local {cat?.name?.toLowerCase()} dealers
                    {city ? ` in ${city}` : ''}.
                    Get the best offline price — research online, buy offline.
                </p>
            </div>

            {/* CTA */}
            <button style={{ ...gB, width: '100%', padding: 16, fontSize: 16, marginBottom: 28 }} onClick={handleStart}>
                Find {cat?.name} Dealers {city ? `in ${city}` : 'Near Me'}
            </button>

            {/* Brands */}
            <div style={{ ...cd, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>
                    Top {cat?.name} Brands Available
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {brands.map(b => (
                        <span key={b} style={{
                            background: C.surf, border: '1px solid ' + C.brd,
                            borderRadius: 20, padding: '6px 14px', fontSize: 12, color: C.sec,
                        }}>{b}</span>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div style={{ ...cd, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
                    How HeyBuddy Works
                </div>
                {[
                    ['Select your locality', 'We find dealers within 5km of your location'],
                    ['Choose brand & model', 'Or let us recommend the best fit for your needs'],
                    ['Get quotes from local dealers', 'Verified stores compete to give you the best price'],
                    ['Buy offline, save money', 'Visit the store, negotiate, and buy at the lowest price'],
                ].map(([title, desc], i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: C.gold + '15', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: C.gold, flexShrink: 0,
                        }}>{i + 1}</div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
                            <div style={{ fontSize: 11, color: C.mut }}>{desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Other categories */}
            <div style={{ ...cd, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>
                    Other Categories
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {CATS.filter(c => c.id !== cat?.id).map(c => {
                        const CIcon = catIcon[c.id];
                        return (
                            <span key={c.id} style={{
                                background: C.surf, border: '1px solid ' + C.brd,
                                borderRadius: 8, padding: '8px 12px', fontSize: 11, color: C.sec,
                                display: 'flex', alignItems: 'center', gap: 6, cursor: 'default',
                            }}>
                                <CIcon sz={14} /> {c.name}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* City list for SEO internal linking */}
            {!city && (
                <div style={{ ...cd }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>
                        Available Cities
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {CITIES.map(c => (
                            <span key={c} style={{
                                background: C.surf, border: '1px solid ' + C.brd,
                                borderRadius: 6, padding: '5px 10px', fontSize: 11, color: C.sec,
                            }}>{c}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom CTA */}
            <button style={{ ...gB, width: '100%', padding: 14, marginTop: 20 }} onClick={handleStart}>
                Get Best {cat?.name} Price {city ? `in ${city}` : 'Now'}
            </button>
        </div>
    );
}
