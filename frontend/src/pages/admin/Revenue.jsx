import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, BarChart3, IndianRupee, Clock, Calendar, ArrowUpRight, ArrowDownRight, Activity, PieChart, Layers, Database, Crown, UserCheck, ShieldCheck } from 'lucide-react';

const AdminRevenue = () => {
    const { api } = useAuth();
    const [report, setReport] = useState({ by_floor: {}, by_category: {}, by_member_type: {}, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const res = await api.get('/admin/revenue/report');
            setReport(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="admin-revenue-page fade-in" style={{ padding: '2rem' }}>
            <header className="glass-card" style={{ padding: '5rem 4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent)' }}>
                <div>
                    <h1 className="serif gradient-text" style={{ fontSize: '5rem', margin: 0, letterSpacing: '-2px' }}>FINANCIAL <span style={{ color: 'var(--text-cream)' }}>INTELLIGENCE</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem' }}>Comprehensive revenue analytics across global floor tiers and member categories.</p>
                </div>
                <div style={{ background: 'var(--gold-glow)', padding: '2rem', borderRadius: '30px', border: '1px solid var(--gold)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem' }}>TOTAL ESTATE REVENUE</div>
                    <div className="serif" style={{ fontSize: '4rem' }}>₹{report.total}</div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <IndianRupee color="var(--gold)" size={40} style={{ marginBottom: '1.5rem' }} />
                    <div className="serif" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>₹{report.total}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 'bold' }}>GROSS PROFIT</div>
                </div>
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', border: '1px solid var(--gold)' }}>
                    <Layers color="var(--gold)" size={40} style={{ marginBottom: '1.5rem' }} />
                    <div className="serif" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{Object.keys(report.by_floor).length}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 'bold' }}>OPERATIONAL FLOORS</div>
                </div>
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <ShieldCheck color="var(--gold)" size={40} style={{ marginBottom: '1.5rem' }} />
                    <div className="serif" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>100%</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '4px', fontWeight: 'bold' }}>CLEARANCE RATE</div>
                </div>
            </div>

            {/* 👑 MEMBER TYPE BREAKDOWN (PRIME VS NON-PRIME) */}
            <section className="glass-card" style={{ padding: '5rem', marginBottom: '4rem', background: 'linear-gradient(rgba(212,175,55,0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '4rem' }}>
                    <Crown size={30} color="var(--gold)" />
                    <h3 className="serif" style={{ fontSize: '3rem' }}>MEMBER <span style={{ color: 'var(--gold)' }}>DISTRIBUTION</span></h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                    {Object.entries(report.by_member_type || {}).map(([type, rev]) => (
                        <div key={type} className="glass-card hover-lift" style={{ padding: '3.5rem', background: type === 'vip' || type === 'membership' ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', border: type === 'vip' ? '2px solid var(--gold)' : '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '3px' }}>{type.toUpperCase()} STATUS</span>
                                {type === 'vip' && <Star size={20} color="var(--gold)" fill="var(--gold)" />}
                            </div>
                            <div className="serif" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>₹{rev}</div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${(rev / (report.total || 1)) * 100}%`, height: '100%', background: 'var(--gold)' }}></div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1.5rem' }}>{Math.round((rev / (report.total || 1)) * 100)}% of total revenue</div>
                        </div>
                    ))}
                    {!Object.keys(report.by_member_type).length && <p style={{ color: 'var(--text-dim)', textAlign: 'center', gridColumn: 'span 3' }}>Awaiting member-specific ritual processing...</p>}
                </div>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                
                {/* 🏢 REVENUE BY FLOOR */}
                <section className="glass-card" style={{ padding: '4rem' }}>
                   <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}><Database size={24} color="var(--gold)" /> REVENUE BY <span style={{ color: 'var(--gold)' }}>FLOOR</span></h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {Object.entries(report.by_floor).map(([floor, rev]) => (
                         <div key={floor} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                               <div style={{ width: '45px', height: '45px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Layers size={18} color="var(--gold)" /></div>
                               <div className="serif" style={{ fontSize: '1.6rem' }}>{floor}</div>
                            </div>
                            <div className="serif" style={{ fontSize: '2.2rem', color: 'var(--gold)' }}>₹{rev}</div>
                         </div>
                      ))}
                   </div>
                </section>

                {/* 🏷️ REVENUE BY CATEGORY */}
                <section className="glass-card" style={{ padding: '4rem' }}>
                   <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}><PieChart size={24} color="var(--gold)" /> REVENUE BY <span style={{ color: 'var(--gold)' }}>CATEGORY</span></h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {Object.entries(report.by_category).map(([cat, rev]) => (
                         <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                               <div style={{ width: '45px', height: '45px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={18} color="var(--gold)" /></div>
                               <div className="serif" style={{ fontSize: '1.6rem', textTransform: 'capitalize' }}>{cat}</div>
                            </div>
                            <div className="serif" style={{ fontSize: '2.2rem', color: 'var(--gold)' }}>₹{rev}</div>
                         </div>
                      ))}
                   </div>
                </section>

            </div>
        </div>
    );
};

export default AdminRevenue;
