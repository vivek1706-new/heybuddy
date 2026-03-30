import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, sI } from '../../constants/styles';
import { catIcon, Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';
import usePlacesAutocomplete from 'use-places-autocomplete';

export default function Location() {
    const { loc, setLoc, setScr, cat } = useApp();
    const Icon = catIcon[cat?.id];
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
        debounce: 300,
        initOnMount: false
    });

    // Load Google Maps Script Manually (More robust for Vite)
    useEffect(() => {
        if (!googleKey) return;

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
            console.log("Google Maps loaded successfully!");
            init();
        };
    }, [googleKey, init]);

    const handleSelect = ({ description }) => () => {
        setValue(description, false);
        clearSuggestions();
        setLoc(description);
        setScr('phone');
    };

    return (
        <div style={{ padding: '24px 20px', minHeight: '100vh', background: C.bg }}>
            <BackButton onClick={() => setScr('landing')} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                {Icon && <Icon />}
                <span style={{ fontSize: 14, color: C.gold, fontWeight: 600 }}>{cat?.name}</span>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>Where do you stay?</h2>
            <p style={{ color: C.sec, fontSize: 13, margin: '0 0 16px' }}>
                We will find the best {cat?.name} stores near you
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

                {/* Pure Google Suggestions */}
                <div style={{ marginTop: 24 }}>
                    {status === 'OK' ? (
                        data.map((suggestion) => (
                            <div
                                key={suggestion.place_id}
                                onClick={handleSelect(suggestion)}
                                style={{
                                    padding: '18px 20px',
                                    background: C.card,
                                    borderRadius: 12,
                                    marginBottom: 12,
                                    cursor: 'pointer',
                                    border: `1px solid ${C.brd}`,
                                    transition: '0.2s'
                                }}
                            >
                                <div style={{ color: C.white, fontSize: 15, fontWeight: 600 }}>{suggestion.structured_formatting.main_text}</div>
                                <div style={{ color: C.sec, fontSize: 13, marginTop: 4 }}>{suggestion.structured_formatting.secondary_text}</div>
                            </div>
                        ))
                    ) : (
                        value.length > 2 && status !== 'OK' && (
                            <div style={{ padding: 40, color: C.mut, textAlign: 'center', fontSize: 13 }}>
                                Searching for "{value}" in India...
                            </div>
                        )
                    )}
                </div>

                {/* Professional helper footer */}
                {!value && (
                    <div style={{ marginTop: 60, textAlign: 'center', opacity: 0.4 }}>
                        <div style={{ color: C.sec, fontSize: 12 }}>Powered by Google Maps</div>
                    </div>
                )}
            </div>
        </div>
    );
}
