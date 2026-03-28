import { C } from '../../constants/colors';

export function Badge({ bg, c, children }) {
    return (
        <span style={{
            background: bg,
            color: c,
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
        }}>
            {children}
        </span>
    );
}

export function StatusBadge({ s }) {
    const map = {
        new: [C.gold, 'New'],
        contacted: [C.grn, 'Contacted'],
        converted: [C.grn, 'Converted'],
        pending: [C.org, 'Pending'],
        accepted: [C.grn, 'Accepted'],
        countered: [C.blu, 'Countered'],
        rejected: [C.red, 'Rejected'],
        active: [C.grn, 'Active'],
        closed: [C.mut, 'Closed'],
        cancelled: [C.red, 'Cancelled'],
    };
    const [color, label] = map[s] || [C.gold, s];
    return <Badge bg={color + '22'} c={color}>{label}</Badge>;
}

export function StarRating({ r }) {
    return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.gold }}>{r}</span>
        </span>
    );
}
