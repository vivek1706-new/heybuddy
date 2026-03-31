import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, oB } from '../../constants/styles';
import { catIcon } from '../../components/ui/Icons';
import { CATS } from '../../constants/data';
import { LOC_BY_ID } from '../../constants/localities';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function LocalityPage({ locality }) {
    const { setCat, setLoc, setLocalityId, setScr } = useApp();
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);

    const neighbors = (locality.neighbors || [])
        .map(id => LOC_BY_ID[id])
        .filter(Boolean);

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from('agents')
                .select('id, shop_name, area, categories, email')
                .eq('lmterfnum', locality.id);
            setDealers(data || []);
            setLoading(false);
        }
        load();
    }, [locality.id]);

    function handleCategory(cat) {
        setCat(cat);
        setLoc(`${locality.name}, ${locality.city}`);
        setLocalityId(locality.id);
        window.history.replaceState(null, '', '/');
        setScr('phone');
    }

    // Count dealers per category
    const catCounts = {};
    CATS.forEach(c => {
        catCounts[c.id] = dealers.filter(d => d.categories?.includes(c.id)).length;
    });

    return (
        <div style={{ padding: '32px 20px' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: 11, color: C.mut, marginBottom: 16 }}>
                <a href="/" style={{ color: C.mut, textDecoration: 'none' }}
                    onClick={e => { e.preventDefault(); window.history.replaceState(null, '', '/'); setScr('landing'); }}>
                    Home
                </a>
                {' > '}
                <a href="/dealers-in-noida" style={{ color: C.mut, textDecoration: 'none' }}
                    onClick={e => { e.preventDefault(); window.location.href = '/dealers-in-noida'; }}>
                    Noida
                </a>
                {' > '}
                <span style={{ color: C.gold }}>{locality.name}</span>
            </div>

            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>
                    Electronics Dealers in <span style={{ color: C.gold }}>{locality.name}</span>
                    <span style={{ fontSize: 14, color: C.sec, fontWeight: 400 }}>, {locality.city}</span>
                </h1>
                <p style={{ color: C.sec, fontSize: 13, margin: 0 }}>
                    {dealers.length} verified dealer{dealers.length !== 1 ? 's' : ''} • Compare prices • Buy offline
                </p>
            </div>

            {/* Categories with dealer count */}
            <div style={{ ...cd, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
                    Categories Available in {locality.name}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {CATS.filter(c => catCounts[c.id] > 0).map(cat => {
                        const Icon = catIcon[cat.id];
                        return (
                            <div key={cat.id} onClick={() => handleCategory(cat)}
                                style={{ ...cd, padding: '12px 4px', textAlign: 'center', cursor: 'pointer' }}>
                                <div style={{ marginBottom: 4 }}><Icon sz={18} /></div>
                                <div style={{ fontSize: 9, fontWeight: 600, color: C.sec }}>{cat.name}</div>
                                <div style={{ fontSize: 9, color: C.gold, fontWeight: 700 }}>{catCounts[cat.id]} store{catCounts[cat.id] > 1 ? 's' : ''}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dealers list */}
            <div style={{ ...cd, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 12 }}>
                    Verified Dealers in {locality.name} ({dealers.length})
                </div>
                {loading ? (
                    <div style={{ color: C.mut, fontSize: 13, textAlign: 'center', padding: 20 }}>Loading dealers...</div>
                ) : dealers.length === 0 ? (
                    <div style={{ color: C.mut, fontSize: 13, textAlign: 'center', padding: 20 }}>No dealers registered yet in this locality.</div>
                ) : (
                    dealers.map(d => (
                        <div key={d.id} style={{ padding: '12px 0', borderBottom: '1px solid ' + C.brd }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{d.shop_name}</div>
                            <div style={{ fontSize: 11, color: C.mut, marginBottom: 4 }}>{d.area}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {(d.categories || []).map(catId => {
                                    const cat = CATS.find(c => c.id === catId);
                                    return cat ? (
                                        <span key={catId} style={{
                                            background: C.gold + '11', border: '1px solid ' + C.gold + '33',
                                            borderRadius: 4, padding: '2px 6px', fontSize: 9, color: C.gold,
                                        }}>{cat.name}</span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 5KM Nearby Localities — the interlinks */}
            {neighbors.length > 0 && (
                <div style={{ ...cd, marginBottom: 16, borderColor: C.gold + '33' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, textTransform: 'uppercase', marginBottom: 10 }}>
                        Nearby Areas (Within 5 km)
                    </div>
                    <p style={{ fontSize: 11, color: C.mut, margin: '0 0 10px' }}>
                        Dealers in these localities also serve {locality.name}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {neighbors.map(n => (
                            <a key={n.id} href={'/' + n.slug}
                                style={{
                                    background: C.surf, border: '1px solid ' + C.brd,
                                    borderRadius: 8, padding: '10px 14px', fontSize: 12,
                                    color: C.sec, textDecoration: 'none', cursor: 'pointer',
                                    display: 'block',
                                }}
                                onClick={e => { e.preventDefault(); window.location.href = '/' + n.slug; }}>
                                <div style={{ fontWeight: 600, color: C.txt }}>{n.name}</div>
                                <div style={{ fontSize: 10, color: C.mut }}>{n.city} • 5km</div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Back to city page */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <a href="/dealers-in-noida" style={{ fontSize: 12, color: C.gold, textDecoration: 'none' }}
                    onClick={e => { e.preventDefault(); window.location.href = '/dealers-in-noida'; }}>
                    ← All Noida & Greater Noida Localities
                </a>
            </div>

            {/* CTA */}
            <button style={{ ...gB, width: '100%', padding: 14 }} onClick={() => handleCategory(CATS[0])}>
                Get Best Price in {locality.name}
            </button>
        </div>
    );
}
