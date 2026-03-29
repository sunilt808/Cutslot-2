import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, BarChart3, Clock, Calendar, CheckCircle, Star, Target, Users } from 'lucide-react';

const WorkerPerformance = () => {
    const { user, api } = useAuth();
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, completed: 0, rating: 4.8 });

    useEffect(() => {
        api.get('/worker/sessions/history').then(res => setHistory(res.data));
    }, []);

    return (
        <div className="worker-performance-page fade-in-up">
            <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>ARTISAN <span style={{ color: 'var(--text-cream)' }}>PERFORMANCE</span></h1>
                   <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Personal revenue tracking and elite slotting efficiency.</p>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                   <div style={{ padding: '1.5rem', background: 'rgba(212,175,55,0.05)', borderRadius: '20px', textAlign: 'center' }}>
                      <Star size={24} color="var(--gold)" /> <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.rating}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>GUEST RATING</div>
                   </div>
                </div>
            </header>

            <div className="performance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
               <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <Target color="var(--gold)" size={24} />
                  <div className="serif" style={{ fontSize: '2rem', margin: '0.5rem 0' }}>98.5%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>SLOT ACCURACY</div>
               </div>
               <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <Users color="var(--gold)" size={24} />
                  <div className="serif" style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{history.length}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>ELITE CLIENTS</div>
               </div>
               <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <Clock color="var(--gold)" size={24} />
                  <div className="serif" style={{ fontSize: '2rem', margin: '0.5rem 0' }}>42h</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>HOURS LOGGED</div>
               </div>
               <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--gold)' }}>
                  <TrendingUp color="var(--gold)" size={24} />
                  <div className="serif" style={{ fontSize: '2rem', margin: '0.5rem 0' }}>₹15,400</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>FLOOR REVENUE</div>
               </div>
            </div>

            <div className="glass-card">
               <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>SESSION LOGS HISTORY</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {history.map(b => (
                    <div key={b.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="serif" style={{ fontSize: '1.2rem' }}>STYLING SESSION #{b.id}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(b.booking_time).toLocaleString()} | Floor {b.floor}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--gold)' }}>PROCESSED</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Value: ₹{b.price_paid}</div>
                        </div>
                    </div>
                  ))}
               </div>
            </div>
        </div>
    );
};

export default WorkerPerformance;
