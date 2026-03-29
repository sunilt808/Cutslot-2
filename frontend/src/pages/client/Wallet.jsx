import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wallet, CreditCard, Clock, IndianRupee, Heart, History, Star, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const ClientWallet = () => {
    const { user, api } = useAuth();
    const [wallet, setWallet] = useState({ total_spent: 0, loyalty_points: 0 });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        api.get('/client/wallet').then(res => setWallet(res.data));
        api.get('/bookings/').then(res => setHistory(res.data.filter(b => b.status === 'completed')));
    }, []);

    return (
        <div className="client-wallet-page fade-in-up">
            <header style={{ marginBottom: '4rem' }}>
                <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>LOYALTY <span style={{ color: 'var(--text-cream)' }}>WALLET</span></h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Track your elite expenditure and loyalty redemption progress.</p>
            </header>

            <div className="wallet-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', marginBottom: '4.5rem' }}>
                <div className="glass-card" style={{ padding: '4rem', background: 'linear-gradient(rgba(212,175,55,0.05), transparent)', borderLeft: '4px solid var(--gold)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <Wallet color="var(--gold)" size={32} />
                        <Star color="var(--gold)" size={16} />
                    </div>
                    <div style={{ color: 'var(--text-dim)', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '1rem' }}>EXPENDITURE BALANCE</div>
                    <div className="serif" style={{ fontSize: '4rem', color: 'var(--text-cream)', marginBottom: '1rem' }}>₹{wallet.total_spent}</div>
                    <div style={{ padding: '1rem 2rem', background: 'var(--gold)', color: 'var(--bg-dark)', borderRadius: '30px', display: 'inline-block', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {wallet.loyalty_points} ELITE POINTS AVAILABLE
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '3.5rem' }}>
                    <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>REDEEM PROTOCOLS</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem', border: '1px solid var(--glass-border)', borderRadius: '15px' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Elite Haircut Reveal</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Redeem 500 points</div>
                            </div>
                            <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>REDEEM</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem', border: '1px solid var(--glass-border)', borderRadius: '15px' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Private Artisan Session</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Redeem 1200 points</div>
                            </div>
                            <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>REDEEM</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <h3 className="serif" style={{ fontSize: '1.8rem', padding: '2rem', borderBottom: '1px solid var(--glass-border)' }}>BOUTIQUE EXPENDITURE HISTORY</h3>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {history.map(b => (
                        <div key={b.id} style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ background: 'var(--gold-glow)', padding: '10px', borderRadius: '50%' }}><CreditCard size={18} color="var(--gold)" /></div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Sess {b.id} - Floor {b.floor}</div>
                                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{new Date(b.booking_time).toLocaleDateString()} at Atelier</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-cream)' }}>- ₹{b.price_paid}</div>
                                <div style={{ fontSize: '0.75rem', color: '#4caf50' }}>COMPLETED TRANSACTION</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientWallet;
