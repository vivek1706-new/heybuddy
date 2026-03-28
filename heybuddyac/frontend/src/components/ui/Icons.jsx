import { C } from '../../constants/colors';

// Helper to get size from props or default
const getSz = (props) => {
    if (typeof props === 'number') return props;
    return props?.sz || props?.size || 26;
};

const s = (props) => {
    const sz = getSz(props);
    return { width: sz, height: sz };
};

export const Ic = {
    ac: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="2" y="4" width="20" height="10" rx="2" /><path d="M6 18c0-2 2-4 6-4s6 2 6 4" strokeLinecap="round" /><line x1="6" y1="9" x2="18" y2="9" /></svg>,
    tv: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    fridge: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="4" y1="10" x2="20" y2="10" /><line x1="16" y1="6" x2="16" y2="8" /><line x1="16" y1="14" x2="16" y2="16" /></svg>,
    washer: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="3" y="2" width="18" height="20" rx="2" /><circle cx="12" cy="14" r="5" /><circle cx="12" cy="14" r="2" /><circle cx="7" cy="5" r="1" fill={C.gold} /></svg>,
    laptop: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8H4V6z" /><path d="M2 18h20l-2-4H4l-2 4z" /></svg>,
    mobile: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="10" y1="18" x2="14" y2="18" /></svg>,
    purifier: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="5" y="3" width="14" height="18" rx="3" /><circle cx="12" cy="10" r="3" /><path d="M10 16h4" strokeLinecap="round" /></svg>,
    dishwasher: (p) => <svg {...s(p)} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="3" y="2" width="18" height="20" rx="2" /><line x1="3" y1="7" x2="21" y2="7" /><circle cx="7" cy="4.5" r="0.8" fill={C.gold} /><rect x="6" y="10" width="12" height="9" rx="1" /></svg>,
    search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>,
    loc: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>,
    wallet: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 6l10-4 10 4" /><circle cx="17" cy="13" r="1.5" fill={C.gold} /></svg>,
    phone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>,
    back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill={C.gold} stroke={C.gold} strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    check: (cl = C.grn) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" /></svg>,
    user: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0112 0v1" /></svg>,
    send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinejoin="round" strokeLinecap="round" /></svg>,
    filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>,
    trophy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><path d="M6 9H3a1 1 0 01-1-1V5a1 1 0 011-1h3M18 9h3a1 1 0 001-1V5a1 1 0 00-1-1h-3M6 4h12v6a6 6 0 01-12 0V4zM9 21h6M12 16v5" /></svg>,
    shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.grn} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    emi: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blu} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>,
    wrench: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.org} strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
    cart: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>,
    lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
    bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>,
    x: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>,
    edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    truck: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
    moon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.org} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>,
};

export const catIcon = {
    ac: Ic.ac,
    fridge: Ic.fridge,
    washer: Ic.washer,
    tv: Ic.tv,
    laptop: Ic.laptop,
    mobile: Ic.mobile,
    purifier: Ic.purifier,
    dishwasher: Ic.dishwasher,
};
