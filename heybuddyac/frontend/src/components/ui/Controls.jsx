import { C } from '../../constants/colors';
import { cd, oB } from '../../constants/styles';
import { Ic } from './Icons';

export function BackButton({ onClick }) {
    return (
        <div
            onClick={onClick}
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.sec, cursor: 'pointer', marginBottom: 24, fontSize: 13 }}
        >
            {Ic.back()} Back
        </div>
    );
}

export function Chip({ label, on, onClick, multiSelect }) {
    return (
        <div
            onClick={onClick}
            style={{
                ...cd,
                padding: '10px 16px',
                cursor: 'pointer',
                borderColor: on ? C.gold : C.brd,
                background: on ? C.gold + '0A' : C.card,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s',
            }}
        >
            <div style={{
                width: 18, height: 18,
                borderRadius: multiSelect ? 4 : 10,
                border: '2px solid ' + (on ? C.gold : C.brd),
                background: on ? C.gold : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                {on && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>
            <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? C.gold : C.sec }}>
                {label}
            </span>
        </div>
    );
}
