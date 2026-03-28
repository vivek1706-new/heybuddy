import { useState } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, sI } from '../../constants/styles';
import { catIcon, Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';

export default function Phone() {
    const { cat, loc, setPh, setScr, generateOtp, mockOtp, setTempOtp } = useApp();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const Icon = catIcon[cat?.id];

    async function handleSend() {
        if (phone.length !== 10) return;
        setLoading(true);
        // Store OTP in Supabase (shown on screen for demo)
        const code = await generateOtp(phone);
        setTempOtp(code);
        setPh(phone);
        setScr('otp');
        setLoading(false);
    }

    return (
        <div style={{ padding: '32px 20px' }}>
            <BackButton onClick={() => setScr('location')} />

            {/* Context banner */}
            <div style={{ ...cd, marginBottom: 20, borderColor: C.grn + '33', background: C.grn + '08', padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {Ic.loc()}
                    <span style={{ fontSize: 12, color: C.grn }}>{loc}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    {Icon && <Icon size={16} />}
                    <span style={{ fontSize: 12, color: C.gold }}>{cat?.name}</span>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>Verify your number</h2>
                <p style={{ color: C.sec, fontSize: 13 }}>Stores will call you on this number (masked)</p>
            </div>

            <div style={{ fontSize: 12, color: C.mut, fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
                Mobile number
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <div style={{ ...cd, padding: '12px 14px', fontSize: 14, color: C.sec, flexShrink: 0 }}>+91</div>
                <input
                    style={{ ...sI, fontSize: 16, letterSpacing: '0.1em' }}
                    placeholder="10 digit number"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    type="tel"
                />
            </div>

            <button
                style={{ ...gB, width: '100%', padding: 14, opacity: phone.length === 10 ? 1 : 0.4, pointerEvents: phone.length === 10 ? 'auto' : 'none' }}
                onClick={handleSend}
                disabled={loading}
            >
                {loading ? 'Sending…' : 'Send OTP'}
            </button>
        </div>
    );
}
