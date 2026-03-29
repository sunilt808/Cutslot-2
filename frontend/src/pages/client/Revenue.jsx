import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, BarChart3, IndianRupee, Clock, Calendar, ArrowUpRight, ArrowDownRight, Activity, PieChart, Layers, Wallet, Crown, ShieldCheck } from 'lucide-react';

const ClientRevenue = () => {
    const { api, user } = useAuth();
    const [stats, setStats] = useState({ total_spent: 0, loyalty_points: 0, by_floor: {}, recent: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [walletRes, bookingRes] = await Promise.all([
                api.get('/client/wallet'),
                api.get('/bookings/')
            ]);
            
            // Process revenue by floor locally for the client
            const byFloor = {};
            bookingRes.data.forEach(b => {
                const floor = `Floor 0${b.floor}`;
                byFloor[floor] = (byFloor[floor] || 0) + b.price_paid;
            });

            setStats({
                total_spent: walletRes.data.total_spent,
                loyalty_points: walletRes.data.loyalty_points,
                by_floor: byFloor,
                recent: bookingRes.data.slice(0, 10)
            });
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="client-revenue-page fade-in" style={{ padding: '2rem' }}>
            <header className="glass-card" style={{ padding: '5rem 4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                       <span style={{ padding: '0.6rem 2rem', background: 'var(--gold)', color: 'var(--bg-dark)', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '4px' }}>{user?.subscription_plan?.toUpperCase() || 'ELITE GUEST'}</span>
                       <span style={{ color: 'var(--gold)', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>PERSONAL REVENUE VAULT</span>
                    </div>
                    <h1 className="serif gradient-text" style={{ fontSize: '5rem', margin: 0, letterSpacing: '-2px' }}>MY <span style={{ color: 'var(--text-cream)' }}>INVESTMENTS</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem' }}>Tracking your contributions to the luxury estate and ritual history.</p>
                </div>
                <div style={{ background: 'var(--gold-glow)', padding: '2rem', borderRadius: '30px', border: '1px solid var(--gold)', textAlign: 'center', minWidth: '350px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem' }}>TOTAL EXPENDITURE</div>
                    <div className="serif" style={{ fontSize: '4.5rem' }}>₹{stats.total_spent}</div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginBottom: '4rem' }}>
                <div className="glass-card hover-lift" style={{ padding: '3.5rem', textAlign: 'center' }}>
                    <Wallet color="var(--gold)" size={40} style={{ marginBottom: '1.5rem' }} />
                    <div className="serif" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>₹{stats.total_spent}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 'bold' }}>LIFETIME SPEND</div>
                </div>
                <div className="glass-card hover-lift" style={{ padding: '3.5rem', textAlign: 'center', border: '1px solid var(--gold)', background: 'rgba(212,175,55,0.02)' }}>
                    <TrendingUp color="var(--gold)" size={40} style={{ marginBottom: '1.5rem' }} />
                    <div className="serif" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stats.loyalty_points}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 'bold' }}>REWARD POINTS</div>
                </div>
                <div className="glass-card hover-lift" style={{ padding: '3.5rem', textAlign: 'center' }}>
                    <Crown color="var(--gold)" size={40} style={{ marginBottom: '1.5rem' }} />
                    <div className="serif" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{stats.recent.filter(b => b.status === 'completed').length}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 'bold' }}>ELITE RITUALS</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 2fr', gap: '3rem' }}>
                {/* 🏢 SPENDING BY FLOOR */}
                <section className="glass-card" style={{ padding: '4rem' }}>
                   <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}><PieChart size={24} color="var(--gold)" /> SPENDING BY <span style={{ color: 'var(--gold)' }}>FLOOR</span></h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {Object.entries(stats.by_floor).map(([floor, spent]) => (
                         <div key={floor} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.8rem', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                               <Layers size={18} color="var(--gold)" />
                               <div className="serif" style={{ fontSize: '1.5rem' }}>{floor}</div>
                            </div>
                            <div className="serif" style={{ fontSize: '2rem', color: 'var(--gold)' }}>₹{spent}</div>
                         </div>
                      ))}
                      {!Object.keys(stats.by_floor).length && <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No historical rituals processed.</p>}
                   </div>
                </section>

                {/* 📜 RECENT PROTOCOLS */}
                <section className="glass-card" style={{ padding: '4rem' }}>
                   <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3.5rem' }}>RECENT <span style={{ color: 'var(--gold)' }}>TRANSACTIONS</span></h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {stats.recent.map(b => (
                         <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                               <div style={{ color: 'var(--gold)', background: 'var(--gold-glow)', padding: '10px', borderRadius: '10px' }}>
                                  <Activity size={18} />
                               </div>
                               <div>
                                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{b.stylist_name} Ritual</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(b.booking_time).toLocaleDateString()} | Floor 0{b.floor}</div>
                               </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                               <div className="serif" style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>₹{b.price_paid}</div>
                               <div style={{ fontSize: '0.65rem', color: b.status === 'completed' ? '#4caf50' : 'var(--gold)', fontWeight: 'bold', letterSpacing: '1px' }}>{b.status.toUpperCase()}</div>
                            </div>
                         </div>
                      ))}
                   </div>
                </section>
            </div>
            
            <footer style={{ marginTop: '6rem', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '40px' }}>
                <ShieldCheck size={40} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
                <h4 className="serif" style={{ fontSize: '1.8rem' }}>ESTATE <span style={{ color: 'var(--gold)' }}>FINANCE PROTOCOL</span></h4>
                <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '1rem auto' }}>All rituals are recorded and audited through the CutSlot secure financial network. Revenue is distributed to artisans and floor maintenance protocols.</p>
            </footer>
        </div>
    );
};

export default ClientRevenue;
