import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, BarChart3, IndianRupee, Clock, Calendar, ArrowUpRight, ArrowDownRight, Activity, PieChart, Layers, Database } from 'lucide-react';

const AdminRevenue = () => {
    const { api } = useAuth();
    const [report, setReport] = useState({ by_floor: {}, by_category: {}, total: 0 });
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
        <div className="admin-revenue-page fade-in">
            <header className="glass-card" style={{ padding: '4rem', marginBottom: '4rem', borderLeft: '8px solid var(--gold)' }}>
                <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0 }}>FINANCIAL <span style={{ color: 'var(--text-cream)' }}>INTELLIGENCE</span></h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Global revenue optimization across the CutSlot Estate floors and categories.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
                <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                    <IndianRupee color="var(--gold)" size={40} />
                    <div className="serif" style={{ fontSize: '3.5rem', margin: '1rem 0' }}>₹{report.total}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '4px' }}>GROSS REVENUE</div>
                </div>
                <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', border: '1px solid var(--gold)' }}>
                    <Layers color="var(--gold)" size={40} />
                    <div className="serif" style={{ fontSize: '3.5rem', margin: '1rem 0' }}>{Object.keys(report.by_floor).length}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '4px' }}>ACTIVE FLOORS</div>
                </div>
                <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                    <Activity color="var(--gold)" size={40} />
                    <div className="serif" style={{ fontSize: '3.5rem', margin: '1rem 0' }}>100%</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '4px' }}>TRANSACTION SECURITY</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                
                {/* 🏢 REVENUE BY FLOOR */}
                <section className="glass-card" style={{ padding: '3.5rem' }}>
                   <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>REVENUE BY <span style={{ color: 'var(--gold)' }}>FLOOR</span></h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {Object.entries(report.by_floor).map(([floor, rev]) => (
                         <div key={floor} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                               <div style={{ width: '40px', height: '40px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database size={16} color="var(--gold)" /></div>
                               <div className="serif" style={{ fontSize: '1.4rem' }}>{floor}</div>
                            </div>
                            <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>₹{rev}</div>
                         </div>
                      ))}
                   </div>
                </section>

                {/* 🏷️ REVENUE BY CATEGORY */}
                <section className="glass-card" style={{ padding: '3.5rem' }}>
                   <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>REVENUE BY <span style={{ color: 'var(--gold)' }}>CATEGORY</span></h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {Object.entries(report.by_category).map(([cat, rev]) => (
                         <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                               <div style={{ width: '40px', height: '40px', background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PieChart size={16} color="var(--gold)" /></div>
                               <div className="serif" style={{ fontSize: '1.4rem', textTransform: 'capitalize' }}>{cat}</div>
                            </div>
                            <div className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>₹{rev}</div>
                         </div>
                      ))}
                   </div>
                </section>

            </div>
        </div>
    );
};

export default AdminRevenue;
