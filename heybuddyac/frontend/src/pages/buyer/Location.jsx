import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, sI } from '../../constants/styles';
import { catIcon, Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';
import usePlacesAutocomplete from 'use-places-autocomplete';

export default function Location() {
    const { loc, setLoc, setLocalityId, setScr, cat } = useApp();
    const Icon = catIcon[cat?.id];
    const [dbResults, setDbResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const googleKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
        init
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: 'in' }
        },
        debounce: 200,
        initOnMount: false
    });

    // Load Google Maps Script Manually (More robust for Vite)
    useEffect(() => {
        if (!googleKey) {
            console.warn("VITE_GOOGLE_MAPS_API_KEY is missing. Google Places will be disabled.");
            return;
        }

        if (window.google) {
            init();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
            init();
        };

        script.onerror = () => {
            console.error("Google Maps failed to load.");
        };
    }, [googleKey, init]);

    // DB Search Logic
    useEffect(() => {
        if (value.length < 2) {
            setDbResults([]);
            return;
        }

        const runSearch = async () => {
            setSearching(true);
            const { data } = await supabase
                .from('unique_localities')
                .select('*')
                .ilike('lmtname', `%${value}%`)
                .limit(5);
            setDbResults(data || []);
            setSearching(false);
        };

        const timer = setTimeout(runSearch, 200);
        return () => clearTimeout(timer);
    }, [value]);

    const handleSelect = ({ description }) => () => {
        setValue(description, false);
        clearSuggestions();
        setLoc(description);
        setLocalityId(null); // Clear ID since it's a Google result
        setScr('phone');
    };

    const handleDbSelect = (item) => {
        const fullLoc = `${item.lmtname}, ${item.city}`;
        setValue(fullLoc, false);
        clearSuggestions();
        setLoc(fullLoc);
        setLocalityId(item.lmterfnum);
        setScr('phone');
    };

    return (
        <div style={{ padding: '24px 20px', minHeight: '100vh', background: C.bg }}>
            <BackButton onClick={() => setScr('landing')} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                {Icon && <Icon />}
                <span style={{ fontSize: 14, color: C.gold, fontWeight: 600 }}>{cat?.name}</span>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>Locality of residence?</h2>
            <p style={{ color: C.sec, fontSize: 13, margin: '0 0 16px' }}>
                We will find the best {cat?.name} stores near your neighborhood
            </p>

            <div style={{ position: 'relative', marginBottom: 20 }}>
                <div style={{ ...sI, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <div style={{ color: C.mut, marginRight: 10 }}>{Ic.loc()}</div>
                    <input
                        placeholder="Search your society, apartment or area..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        style={{ border: 'none', background: 'transparent', flex: 1, fontSize: 15, color: C.white, outline: 'none' }}
                    />
                    {value && (
                        <button
                            onClick={() => { setValue(''); clearSuggestions(); }}
                            style={{ border: 'none', background: 'none', color: C.mut, cursor: 'pointer' }}>
                            ✕
                        </button>
                    )}
                </div>

                {/* Unified Search Results List */}
                {(dbResults.length > 0 || status === 'OK') && (
                    <div style={{ 
                        marginTop: 10,
                        background: C.card,
                        borderRadius: 16,
                        border: `1px solid ${C.brd}`,
                        overflow: 'hidden',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        maxHeight: 400,
                        overflowY: 'auto'
                    }}>
                        {/* 1. Supabase Localities (Primary) */}
                        {dbResults.map((item) => (
                            <div
                                key={item.lmterfnum}
                                onClick={() => handleDbSelect(item)}
                                style={{
                                    padding: '16px 18px',
                                    cursor: 'pointer',
                                    borderBottom: `1px solid ${C.brd}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    background: 'transparent'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = C.gold + '08'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ color: C.gold, fontSize: 18 }}>{Ic.loc()}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: C.white, fontSize: 15, fontWeight: 700 }}>{item.lmtname}</div>
                                    <div style={{ color: C.sec, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {item.city} — <span style={{ color: C.gold, fontWeight: 700, fontSize: 10, textTransform: 'uppercase' }}>Verified Local</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 2. Google Places (Secondary Fallback) */}
                        {status === 'OK' && data.map((suggestion) => (
                            <div
                                key={suggestion.place_id}
                                onClick={handleSelect(suggestion)}
                                style={{
                                    padding: '16px 18px',
                                    cursor: 'pointer',
                                    borderBottom: `1px solid ${C.brd}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    background: 'transparent',
                                    opacity: 0.9
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = C.white + '05'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ color: C.mut, fontSize: 18 }}>{Ic.loc()}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: C.white, fontSize: 14, fontWeight: 600 }}>{suggestion.structured_formatting.main_text}</div>
                                    <div style={{ color: C.sec, fontSize: 12 }}>{suggestion.structured_formatting.secondary_text}</div>
                                </div>
                                <div style={{ fontSize: 10, color: C.mut, textTransform: 'uppercase', fontStyle: 'italic' }}>Global</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading / No Results state */}
                {value.length > 1 && dbResults.length === 0 && status !== 'OK' && !searching && (
                    <div style={{ padding: 40, color: C.mut, textAlign: 'center', fontSize: 13 }}>
                        {Ic.loc()} <br/> Searching across 1 million verified points...
                    </div>
                )}

                {/* Professional helper footer */}
                {!value && (
                    <div style={{ marginTop: 60, textAlign: 'center', opacity: 0.6 }}>
                        <div style={{ color: C.sec, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Search Tips:</div>
                        <div style={{ color: C.mut, fontSize: 12 }}>• Search by area or colony name<br/>• Use sector numbers if in NCR<br/>• Try building names for closer matches</div>
                    </div>
                )}
            </div>
        </div>
    );
}
