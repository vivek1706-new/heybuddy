import { C } from '../../constants/colors';
import { cd } from '../../constants/styles';
import { catIcon, Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';

export default function Path() {
    const { cat, loc, ph, setScr } = useApp();
    const Icon = catIcon[cat?.id];

    return (
        <div style={{ padding: '32px 20px' }}>
            <BackButton onClick={() => setScr('otp')} />

            {/* Context banner */}
            <div style={{ ...cd, marginBottom: 20, borderColor: C.grn + '33', background: C.grn + '08', padding: '10px 14px', fontSize: 12 }}>
                <div style={{ color: C.grn, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    {Ic.check()} Verified: +91-{ph}
                </div>
                <div style={{ color: C.sec, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {Ic.loc()} {loc}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {Icon && <Icon />}
                    <span style={{ fontSize: 14, color: C.gold, fontWeight: 600 }}>{cat?.name}</span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>How would you like to proceed?</h2>
            </div>

            {[
                { e: '🎯', t: 'I know the model', d: 'Enter model number directly', scr: 'search' },
                { e: '🔍', t: 'Help me decide', d: 'Answer quick questions to find the best fit', scr: 'quiz' },
            ].map((opt, i) => (
                <div
                    key={i}
                    onClick={() => setScr(opt.scr)}
                    className="path-card"
                    style={{ ...cd, padding: 22, cursor: 'pointer', marginBottom: 14 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 46, height: 46, borderRadius: 12,
                            background: C.gold + '15',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, flexShrink: 0,
                        }}>{opt.e}</div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700 }}>{opt.t}</div>
                            <div style={{ fontSize: 13, color: C.sec }}>{opt.d}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
