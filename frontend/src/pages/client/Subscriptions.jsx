import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Crown, Sparkles, Shield, Zap, Clock, Calendar, Check, ArrowRight, Wallet, History, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Subscriptions = () => {
    const { user, api, refreshUser } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            // We use floor 4 or specific category for memberships
            const res = await api.get('/services/?floor=4');
            setPlans(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubscribe = async (planId) => {
        if (!confirm("Authorize elite membership upgrade? This will initialize your 30-day billing cycle.")) return;
        try {
            await api.post('/subscribe/', { service_id: planId });
            await refreshUser();
            alert("MEMBERSHIP SYNCHRONIZED. YOUR STATUS IS NOW ELEVATED.");
        } catch (err) { alert(err.response?.data?.detail || "Authorization declined."); }
    };

    const tiers = [
        { name: 'Silver', icon: <Zap size={24} />, color: '#C0C0C0', features: ['10 Rituals / Month', 'Standard Grooming', 'Profile Badge'] },
        { name: 'Gold', icon: <Sparkles size={24} />, color: '#FFD700', features: ['25 Rituals / Month', 'Priority Queue', 'Dedicated Artisan'] },
        { name: 'Elite', icon: <Crown size={24} />, color: '#E5E4E2', features: ['50 Rituals / Month', 'Custom Services', 'VIP Lounge Access'] },
        { name: 'Royal', icon: <Shield size={24} />, color: 'var(--gold)', features: ['Unlimited Rituals', 'Home / Doorstep Service', 'Personal Concierge'] }
    ];

    const getExpiryDays = () => {
        if (!user?.subscription_expiry) return 0;
        const expiry = new Date(user.subscription_expiry);
        const today = new Date();
        const diff = expiry - today;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    return (
        <div className="subscriptions-page fade-in" style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '8rem', textAlign: 'center' }}>
                <h1 className="serif gradient-text" style={{ fontSize: '5rem', margin: 0 }}>ESTATE <span style={{ color: 'var(--text-cream)' }}>MEMBERSHIPS</span></h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem' }}>Elevate your existence within the Lumière Directorate.</p>
            </header>

            {/* 🕒 ACTIVE STATUS CLI */}
            {user?.subscription_plan && (
                <div className="glass-card" style={{ padding: '4rem', marginBottom: '8rem', border: '1px solid var(--gold)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem 3rem', background: 'var(--gold)', color: 'black', fontWeight: 'bold', fontSize: '0.8rem' }}>ACTIVE DIRECTIVE</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                        <div>
                            <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{user.subscription_plan.toUpperCase()}</h2>
                            <p style={{ color: 'var(--text-dim)' }}>Membership Tier: <span style={{ color: 'var(--gold)' }}>{user.customer_category?.toUpperCase()}</span></p>
                            <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
                                <div className="stat-sm">
                                    <Clock size={20} color="var(--gold)" />
                                    <span>{getExpiryDays()} DAYS REMAINING</span>
                                </div>
                                <div className="stat-sm">
                                    <Calendar size={20} color="var(--gold)" />
                                    <span>EXPIRES: {new Date(user.subscription_expiry).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', color: 'var(--gold)', fontWeight: 'bold' }}>{user.monthly_bookings_count} / {user.monthly_limit}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>MONTHLY RITUAL ALLOWANCE</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <button className="btn-gold" style={{ padding: '1.5rem 4rem' }}>RENEW PROTOCOL</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🎟️ TIER CATALOG */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                {plans.map((p, idx) => {
                    const tierMeta = plans.length === 4 ? tiers[idx] : tiers[idx % 4];
                    return (
                        <div className="glass-card hover-lift" key={p.id} style={{ padding: '4rem', textAlign: 'center', border: user?.subscription_plan === p.name ? '2px solid var(--gold)' : '1px solid var(--glass-border)' }}>
                            <div style={{ color: tierMeta.color, marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>{tierMeta.icon}</div>
                            <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{p.name.toUpperCase()}</h3>
                            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--text-cream)', marginBottom: '3rem' }}>₹{p.price}<span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/MO</span></div>
                            
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 4rem 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {tierMeta.features.map((f, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                        <Check size={16} color="var(--gold)" /> {f}
                                    </li>
                                ))}
                                <li style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    <Check size={16} color="var(--gold)" /> All {p.category.toUpperCase()} Services
                                </li>
                            </ul>

                            <button 
                                onClick={() => handleSubscribe(p.id)}
                                disabled={user?.subscription_plan === p.name}
                                className={user?.subscription_plan === p.name ? "nav-button" : "btn-gold"} 
                                style={{ width: '100%', padding: '1.5rem' }}
                            >
                                {user?.subscription_plan === p.name ? "CURRENT STATUS" : "AUTHORIZE UPGRADE"}
                            </button>
                        </div>
                    );
                })}
            </div>

            <footer style={{ marginTop: '10rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', maxWidth: '800px', margin: '0 auto' }}>
                    <AlertCircle size={20} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                    Subscriptions are billed automatically every 30 days. You may revoke the authorization at the start of the next cycle. All VIP and Royal rituals require 24h advance scheduling.
                </div>
            </footer>
        </div>
    );
};

export default Subscriptions;
