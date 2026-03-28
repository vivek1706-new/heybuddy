import { useState, useEffect } from 'react';
import { C } from '../../constants/colors';
import { cd, gB, sI } from '../../constants/styles';
import { useApp } from '../../store/AppContext';
import { supabase } from '../../lib/supabase';

export default function AgentLogin() {
    const { setAgentLoggedIn, setAgent, getOrCreateAgent, generateOtp } = useApp();
    const [ph, setPh] = useState('');
    const [otp, setOtp] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [demoOtp, setDemoOtp] = useState('');
    const [err, setErr] = useState('');

    async function handleSend() {
        if (ph.length !== 10) return;
        setLoading(true);
        const code = await generateOtp(ph);
        setDemoOtp(code);
        setSent(true);
        setLoading(false);
    }

    async function handleVerify() {
        if (otp.length !== 4) return;
        setLoading(true);
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
            const agent = await getOrCreateAgent(ph);
            if (agent) {
                setAgent(agent);
                setAgentLoggedIn(true);
            } else {
                // Not registered -> go to onboard
                setAgentLoggedIn(true); // Will be handled by logic flow in App.jsx
            }
        } else {
            setErr('Wrong OTP');
        }
        setLoading(false);
    }

    if (!sent) return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: C.gold + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 900, fontSize: 22, color: C.gold }}>H</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Hey<span style={{ color: C.gold }}>Buddy</span></h1>
            <p style={{ color: C.sec, fontSize: 13, marginBottom: 32 }}>Agent login</p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <div style={{ ...cd, padding: '12px 14px', fontSize: 14, color: C.sec, flexShrink: 0 }}>+91</div>
                <input
                    style={{ ...sI, fontSize: 16, letterSpacing: '0.1em' }}
                    placeholder="10 digit number"
                    value={ph}
                    onChange={e => setPh(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    type="tel"
                />
            </div>

            <button
                style={{ ...gB, width: '100%', padding: 14, opacity: ph.length === 10 ? 1 : 0.4, pointerEvents: ph.length === 10 ? 'auto' : 'none' }}
                onClick={handleSend}
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send OTP'}
            </button>
        </div>
    );

    return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>Enter OTP</h2>
            <div style={{ ...cd, borderColor: C.org + '44', background: C.org + '08', marginBottom: 24, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: C.org, fontWeight: 600, marginBottom: 6 }}>DEMO OTP:</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: C.gold, letterSpacing: '0.3em', fontFamily: 'monospace' }}>{demoOtp}</div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                {[0, 1, 2, 3].map(i => (
                    <input
                        key={i}
                        id={'ao' + i}
                        style={{ ...sI, width: 56, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 700, padding: 0, borderColor: otp[i] ? C.gold : C.brd }}
                        maxLength="1"
                        value={otp[i] || ''}
                        onChange={e => {
                            const v = otp.split('');
                            v[i] = e.target.value.replace(/\D/g, '').slice(0, 1);
                            const nw = v.join('');
                            setOtp(nw);
                            if (e.target.value && i < 3) document.getElementById('ao' + (i + 1))?.focus();
                        }}
                    />
                ))}
            </div>

            <button
                style={{ ...gB, width: '100%', padding: 14, opacity: otp.length === 4 ? 1 : 0.4, pointerEvents: otp.length === 4 ? 'auto' : 'none' }}
                onClick={handleVerify}
                disabled={loading}
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>
            {err && <div style={{ marginTop: 10, fontSize: 12, color: C.red }}>{err}</div>}
        </div>
    );
}
