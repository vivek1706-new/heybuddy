import { useState } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, sI } from '../../constants/styles';
import { LOCS } from '../../constants/data';
import { catIcon, Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';

export default function Location() {
    const { cat, setLoc, setScr } = useApp();
    const [input, setInput] = useState('');
    const [dd, setDd] = useState(false);
    const Icon = catIcon[cat?.id];

    const filtered = LOCS.filter(l => l.toLowerCase().includes(input.toLowerCase()));

    function handleSelect(loc) {
        setInput(loc);
        setDd(false);
    }

    function handleContinue() {
        setLoc(input);
        setScr('phone');
    }

    return (
        <div style={{ padding: '24px 20px' }}>
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
                <input
                    style={{ ...sI, paddingLeft: 40, fontSize: 15 }}
                    placeholder="Type society, apartment, area..."
                    value={input}
                    onChange={e => { setInput(e.target.value); setDd(e.target.value.length > 0); }}
                />
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.mut }}>
                    {Ic.loc()}
                </div>

                {dd && filtered.length > 0 && (
                    <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0,
                        background: C.card, border: '1px solid ' + C.brd,
                        borderRadius: 8, marginTop: 4, zIndex: 20,
                        maxHeight: 200, overflowY: 'auto',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    }}>
                        {filtered.slice(0, 6).map((l, i) => (
                            <div
                                key={i}
                                onClick={() => handleSelect(l)}
                                className="dd-item"
                                style={{
                                    padding: '10px 14px', fontSize: 13, color: C.sec,
                                    cursor: 'pointer', borderBottom: '1px solid ' + C.brd,
                                    display: 'flex', alignItems: 'center', gap: 8,
                                }}
                            >
                                {Ic.loc()} {l}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                style={{ ...gB, width: '100%', padding: 14, opacity: input.length > 3 ? 1 : 0.4, pointerEvents: input.length > 3 ? 'auto' : 'none' }}
                onClick={handleContinue}
            >
                Continue
            </button>
        </div>
    );
}
