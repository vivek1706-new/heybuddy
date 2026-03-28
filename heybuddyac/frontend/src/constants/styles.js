import { C } from './colors';

export const cd = {
    background: C.card,
    border: '1px solid ' + C.brd,
    borderRadius: 12,
    padding: 16,
};

export const gB = {
    background: 'linear-gradient(135deg,' + C.gold + ',' + C.goldL + ')',
    color: C.dark,
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
};

export const oB = {
    background: 'transparent',
    color: C.gold,
    border: '1px solid ' + C.gold,
    borderRadius: 8,
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: 'inherit',
};

export const sI = {
    background: C.surf,
    border: '1px solid ' + C.brd,
    borderRadius: 8,
    padding: '12px 16px',
    color: C.txt,
    fontSize: 14,
    width: '100%',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
};
