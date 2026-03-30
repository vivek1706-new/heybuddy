import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB } from '../../constants/styles';
import { sI } from '../../constants/styles';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function OTP() {
    const { ph, tempOtp, mockOtp, setBuyer, setScr, getOrCreateBuyer, loadNotifications } = useApp();
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoOtp, setDemoOtp] = useState(tempOtp || mockOtp);

    useEffect(() => {
        if (timer > 0) {
            const t = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [timer]);

    async function finalize() {
        const buyer = await getOrCreateBuyer(ph);
        await loadNotifications(buyer.id);
        setBuyer(buyer); // Assuming setBuyer is meant to be called here
        setScr('path');
    }

    async function handleVerify() {
        if (otp.length !== 4) return;
        setLoading(true);
        setErr('');

        if (otp === tempOtp || otp === mockOtp) {
            await finalize();
            setLoading(false);
            return;
        }

        // Verify OTP from Supabase
        const { data } = await supabase
            .from('otps')
            .select('*')
            .eq('phone', ph)
            .eq('otp', otp)
            .eq('used', false)
            .order('created_at', { ascending: false })
            .limit(1);

        if (data && data.length > 0) {
            await supabase.from('otps').update({ used: true }).eq('id', data[0].id);
            const buyer = await getOrCreateBuyer(ph);
            await loadNotifications(buyer.id);
            setScr('path');
        } else {
            setErr('Incorrect OTP. Please try again.');
        }
        setLoading(false);
    }

    function handleDigit(i, val) {
        const arr = otp.split('');
        arr[i] = val.replace(/\D/g, '').slice(0, 1);
        const newOtp = arr.join('');
        setOtp(newOtp);
        setErr('');
        if (val && i < 3) {
            const next = document.getElementById('otp-' + (i + 1));
            if (next) next.focus();
        }
    }

    async function handleResend() {
        const newOtp = String(1000 + Math.floor(Math.random() * 9000));
        await supabase.from('otps').insert({ phone: ph, otp: newOtp });
        setDemoOtp(newOtp);
        setTimer(30);
        setOtp('');
        setErr('');
    }

    return (
        <div style={{ padding: '32px 20px' }}>
            <BackButton onClick={() => setScr('phone')} />

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px' }}>Enter OTP</h2>
                <p style={{ color: C.sec, fontSize: 13 }}>Sent to +91-{ph}</p>
            </div>

            {/* Demo OTP display */}
            {demoOtp && (
                <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', textAlign: 'center', marginBottom: 16 }}>
                    <p style={{ fontSize: 12, color: '#ad6800', margin: '0 0 4px' }}>Test mode — OTP</p>
                    <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: 8, color: '#ad6800', margin: 0 }}>{demoOtp}</p>
                </div>
            )}
            <p style={{ color: C.sec, fontSize: 13, textAlign: 'center', marginBottom: 32 }}>
                Enter the 4-digit code sent to your phone
            </p>
            {/* 4-box OTP input */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                {[0, 1, 2, 3].map(i => (
                    <input
                        key={i}
                        id={'otp-' + i}
                        style={{ ...sI, width: 56, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 700, padding: 0, borderColor: otp[i] ? C.gold : C.brd }}
                        maxLength="1"
                        value={otp[i] || ''}
                        onChange={e => handleDigit(i, e.target.value)}
                    />
                ))}
            </div>

            {err && <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 12, color: C.red }}>{err}</div>}

            <button
                style={{ ...gB, width: '100%', padding: 14, opacity: otp.length === 4 ? 1 : 0.4, pointerEvents: otp.length === 4 ? 'auto' : 'none' }}
                onClick={handleVerify}
                disabled={loading}
            >
                {loading ? 'Verifying…' : 'Verify and continue'}
            </button>

            <p style={{ fontSize: 12, color: C.mut, textAlign: 'center', marginTop: 12 }}>
                {timer > 0
                    ? 'Resend in ' + timer + 's'
                    : <span style={{ color: C.gold, cursor: 'pointer' }} onClick={handleResend}>Resend OTP</span>
                }
            </p>
        </div>
    );
}
