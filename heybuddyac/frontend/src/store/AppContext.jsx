import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    // ── Mode ──────────────────────────────────────────────────────────────────
    const [mode, setMode] = useState('buyer'); // 'buyer' | 'agent'
    const [err, setErr] = useState(null); // Global error state

    // ── Buyer state ───────────────────────────────────────────────────────────
    const [scr, setScr] = useState('landing');
    const [cat, setCat] = useState(null);
    const [loc, setLoc] = useState('Select location');
    const [localityId, setLocalityId] = useState(null); // Database ID
    const [ph, setPh] = useState('');
    const [tempOtp, setTempOtp] = useState('');
    const [buyer, setBuyer] = useState(null); // DB record
    const [prods, setProds] = useState([]);
    const [mockOtp] = useState(() => String(1000 + Math.floor(Math.random() * 9000)));
    const [showNotif, setShowNotif] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // ── Agent state ───────────────────────────────────────────────────────────
    const [agentLoggedIn, setAgentLoggedIn] = useState(false);
    const [agentOnboarded, setAgentOnboarded] = useState(false);
    const [agent, setAgent] = useState(null);

    // ── OTP helpers ───────────────────────────────────────────────────────────
    async function generateOtp(phone) {
        setErr(null);
        const otp = String(1000 + Math.floor(Math.random() * 9000));

        try {
            // 1. Record in DB
            await supabase.from('otps').insert({ phone, otp });

            // 2. Call MSG91 API via our secure Vercel Endpoint
            await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp })
            });
        } catch (error) {
            console.error('Failed to trigger OTP system:', error);
            // No error toast here to keep flow smooth (mock is available)
        }

        return otp;
    }

    async function verifyOtp(phone, otp) {
        const { data } = await supabase
            .from('otps')
            .select('*')
            .eq('phone', phone)
            .eq('otp', otp)
            .eq('used', false)
            .order('created_at', { ascending: false })
            .limit(1);
        if (data && data.length > 0) {
            await supabase.from('otps').update({ used: true }).eq('id', data[0].id);
            return true;
        }
        return false;
    }

    // ── Buyer helpers ─────────────────────────────────────────────────────────
    async function getOrCreateBuyer(phone) {
        setErr(null);
        try {
            const { data: existing } = await supabase
                .from('buyers').select('*').eq('phone', phone).single();
            if (existing) { setBuyer(existing); return existing; }
            const { data: created } = await supabase
                .from('buyers').insert({ phone }).select().single();
            setBuyer(created);
            return created;
        } catch (error) {
            setErr('Database connection error. Please try again.');
            console.error('getOrCreateBuyer failed:', error);
            return null;
        }
    }

    async function loadNotifications(buyerId) {
        const { data } = await supabase
            .from('notifications').select('*').eq('buyer_id', buyerId)
            .order('created_at', { ascending: false });
        if (data) setNotifications(data);
    }

    // ── Agent helpers ─────────────────────────────────────────────────────────
    async function getOrCreateAgent(phone) {
        const { data } = await supabase
            .from('agents').select('*').eq('phone', phone).single();
        return data || null;
    }

    async function createAgent({ phone, shopName, area, localityId, categories, walletBalance }) {
        setErr(null);
        try {
            const existing = await getOrCreateAgent(phone);
            if (existing) {
                setAgent(existing);
                return existing;
            }
            const { data, error } = await supabase.from('agents').insert({
                phone, shop_name: shopName, area, lmterfnum: localityId, categories, wallet_balance: walletBalance,
            }).select().single();
            if (error) throw error;
            setAgent(data);
            return data;
        } catch (error) {
            setErr('Failed to create agent profile. Try another number.');
            console.error('createAgent failed:', error);
            return null;
        }
    }

    async function updateAgentWallet(agentId, delta, type, description) {
        const { data: ag } = await supabase.from('agents').select('wallet_balance').eq('id', agentId).single();
        const newBal = (ag?.wallet_balance || 0) + delta;
        await supabase.from('agents').update({ wallet_balance: newBal }).eq('id', agentId);
        await supabase.from('wallet_transactions').insert({ agent_id: agentId, amount: delta, type, description });
        setAgent(prev => ({ ...prev, wallet_balance: newBal }));
        return newBal;
    }

    // ── Reset buyer flow ──────────────────────────────────────────────────────
    function reset() {
        setErr(null);
        setScr('landing');
        setCat(null);
        setLoc('Select location');
        setLocalityId(null);
        setPh('');
        setTempOtp('');
        setProds([]);
    }

    const value = {
        mode, setMode,
        scr, setScr,
        cat, setCat,
        loc, setLoc,
        localityId, setLocalityId,
        ph, setPh,
        tempOtp, setTempOtp,
        buyer, setBuyer,
        prods, setProds,
        mockOtp,
        showNotif, setShowNotif,
        notifications, setNotifications,
        agentLoggedIn, setAgentLoggedIn,
        agentOnboarded, setAgentOnboarded,
        agent, setAgent,
        err, setErr,
        // helpers
        generateOtp,
        verifyOtp,
        getOrCreateBuyer,
        loadNotifications,
        getOrCreateAgent,
        createAgent,
        updateAgentWallet,
        reset,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside AppProvider');
    return ctx;
}
