import { useState } from 'react';
import { C } from '../../constants/colors';
import { gB, sI } from '../../constants/styles';
import { Chip, BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';

export default function Quiz() {
    const { cat, setScr } = useApp();
    const qs = cat?.qs || [];
    const [step, setStep] = useState(0);
    const [ans, setAns] = useState({});
    const [extra, setExtra] = useState('');

    function toggle(qi, opt) {
        const q = qs[qi];
        setAns(prev => {
            const cur = prev[qi] || [];
            if (q.m) {
                return { ...prev, [qi]: cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt] };
            }
            return { ...prev, [qi]: cur.includes(opt) ? [] : [opt] };
        });
    }

    // Extra notes step
    if (step >= qs.length) {
        return (
            <div style={{ padding: '24px 20px' }}>
                <BackButton onClick={() => setStep(qs.length - 1)} />
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Anything else?</h2>
                <textarea
                    style={{ ...sI, minHeight: 80, resize: 'vertical' }}
                    placeholder="Optional — copper coil, Wi-Fi, specific colour, etc."
                    value={extra}
                    onChange={e => setExtra(e.target.value)}
                />
                <button style={{ ...gB, width: '100%', padding: 14, marginTop: 20 }} onClick={() => setScr('results')}>
                    Show best options
                </button>
            </div>
        );
    }

    const current = qs[step];
    const selected = ans[step] || [];
    const canContinue = selected.length > 0;

    return (
        <div style={{ padding: '24px 20px' }}>
            <BackButton onClick={() => step > 0 ? setStep(step - 1) : setScr('path')} />

            {/* Progress bar */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                {qs.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? C.gold : C.brd }} />
                ))}
            </div>

            <div style={{ fontSize: 11, color: C.mut, marginBottom: 6 }}>
                Q{step + 1}/{qs.length}
                {current.m && <span style={{ color: C.gold }}> — Multiple choice</span>}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>{current.q}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {current.opts.map(opt => (
                    <Chip
                        key={opt}
                        label={opt}
                        on={selected.includes(opt)}
                        onClick={() => toggle(step, opt)}
                        multiSelect={current.m}
                    />
                ))}
            </div>

            <button
                style={{ ...gB, width: '100%', padding: 14, marginTop: 20, opacity: canContinue ? 1 : 0.4, pointerEvents: canContinue ? 'auto' : 'none' }}
                onClick={() => setStep(step + 1)}
            >
                {step < qs.length - 1 ? 'Next' : 'Almost done'}
            </button>
        </div>
    );
}
