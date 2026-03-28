import { useState } from 'react';
import { C } from '../../constants/colors';
import { Ic } from '../ui/Icons';
import { useApp } from '../../store/AppContext';

export default function Header() {
    const { mode, setMode, ph, scr, setScr, showNotif, setShowNotif, notifications, reset } = useApp();
    const unread = notifications.filter(n => !n.is_read).length;

    return (
        <div style={{
            background: C.card,
            borderBottom: '1px solid ' + C.brd,
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div
                onClick={reset}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            >
                <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `linear-gradient(135deg,${C.gold},${C.goldL})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: 15, color: C.dark,
                }}>H</div>
                <span style={{ fontSize: 16, fontWeight: 800 }}>
                    Hey<span style={{ color: C.gold }}>Buddy</span>
                </span>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                {/* Notification bell (buyer only, after phone verified) */}
                {mode === 'buyer' && ph && (
                    <div onClick={() => setShowNotif(!showNotif)} style={{ cursor: 'pointer', position: 'relative' }}>
                        {Ic.bell()}
                        {unread > 0 && (
                            <div style={{
                                position: 'absolute', top: -4, right: -4,
                                width: 16, height: 16, borderRadius: '50%',
                                background: C.red, color: C.txt,
                                fontSize: 9, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{unread}</div>
                        )}
                    </div>
                )}

                {/* Profile icon */}
                {mode === 'buyer' && ph && (
                    <div onClick={() => setScr('profile')} style={{ cursor: 'pointer', color: C.sec }}>
                        {Ic.user()}
                    </div>
                )}

                {/* Mode toggle */}
                <div style={{
                    display: 'flex',
                    background: C.surf,
                    borderRadius: 8,
                    border: '1px solid ' + C.brd,
                    overflow: 'hidden',
                }}>
                    {['buyer', 'agent'].map(m => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); if (m === 'buyer') reset(); }}
                            style={{
                                background: mode === m ? C.gold + '22' : 'transparent',
                                color: mode === m ? C.gold : C.mut,
                                border: 'none',
                                padding: '6px 14px',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                fontFamily: 'inherit',
                            }}
                        >
                            {m}
                        </button>
                    ))}
                </div>

                {/* Notification panel */}
                {showNotif && (
                    <NotifPanel close={() => setShowNotif(false)} notifications={notifications} />
                )}
            </div>
        </div>
    );
}

function NotifPanel({ close, notifications }) {
    return (
        <div style={{
            background: C.card,
            border: '1px solid ' + C.brd,
            borderRadius: 12,
            padding: 16,
            position: 'absolute',
            top: 48, right: 12,
            width: 280,
            zIndex: 200,
            maxHeight: 320,
            overflowY: 'auto',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
                <span onClick={close} style={{ cursor: 'pointer', color: C.mut }}>{Ic.x()}</span>
            </div>
            {notifications.length === 0 && (
                <div style={{ fontSize: 12, color: C.mut, textAlign: 'center', padding: '12px 0' }}>No notifications yet</div>
            )}
            {notifications.map(n => (
                <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid ' + C.brd, opacity: n.is_read ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {!n.is_read && (
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold, marginTop: 4, flexShrink: 0 }} />
                        )}
                        <div>
                            <div style={{ fontSize: 12, color: C.sec }}>{n.text}</div>
                            <div style={{ fontSize: 10, color: C.mut, marginTop: 4 }}>
                                {new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
