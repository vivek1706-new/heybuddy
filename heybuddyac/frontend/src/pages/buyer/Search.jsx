import { useState } from 'react';
import { C } from '../../constants/colors';
import { cd, sI } from '../../constants/styles';
import { PRODS } from '../../constants/data';
import { StarRating } from '../../components/ui/Badge';
import { Ic } from '../../components/ui/Icons';
import { BackButton } from '../../components/ui/Controls';
import { useApp } from '../../store/AppContext';

export default function Search() {
    const { cat, setProds, setScr } = useApp();
    const [q, setQ] = useState('');
    const prods = PRODS[cat?.id] || PRODS.ac;

    const filtered = q.length > 1
        ? prods.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.model.toLowerCase().includes(q.toLowerCase()))
        : prods;

    function handleSelect(prod) {
        setProds([prod]);
        setScr('confirm');
    }

    return (
        <div style={{ padding: '24px 20px' }}>
            <BackButton onClick={() => setScr('path')} />
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px' }}>Enter model name or number</h2>

            <div style={{ position: 'relative', marginBottom: 24 }}>
                <input
                    style={{ ...sI, paddingLeft: 44, fontSize: 15 }}
                    placeholder="e.g. MTKL50UV16 or Daikin 1.5T"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.mut }}>
                    {Ic.search()}
                </div>
            </div>

            {filtered.map(prod => (
                <div
                    key={prod.id}
                    onClick={() => handleSelect(prod)}
                    className="prod-card"
                    style={{ ...cd, padding: '12px 16px', cursor: 'pointer', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}
                >
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{prod.name}</div>
                        <div style={{ fontSize: 11, color: C.mut }}>{prod.model}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>Rs.{prod.price.split('-')[0]}</div>
                        <StarRating r={prod.rating} />
                    </div>
                </div>
            ))}
        </div>
    );
}
