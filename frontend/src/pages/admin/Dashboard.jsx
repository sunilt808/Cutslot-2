import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Users, Calendar, Star, Shield, Briefcase, Database, Activity, History, ArrowRight, Settings, UserCircle } from 'lucide-react';

const Dashboard = () => {
  const { api } = useAuth();
  const [stats, setStats] = useState({ total_revenue: 0, total_bookings: 0, active_users: 0, avg_rating: 0 });
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchAudits();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAudits = async () => {
    try {
      const res = await api.get('/admin/audits');
      setAudits(res.data.slice(0, 5));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-dashboard fade-in">
      <header className="glass-card" style={{ padding: '5rem 4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)' }}>
         <div>
            <div style={{ color: 'var(--gold)', letterSpacing: '8px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>COMMAND CENTER</div>
            <h1 className="serif gradient-text" style={{ fontSize: '5rem', margin: 0 }}>ADMIN <span style={{ color: 'var(--text-cream)' }}>OVERVIEW</span></h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Global performance and security monitoring for the CutSlot Estate.</p>
         </div>
         <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/admin/services" className="btn-gold" style={{ padding: '1.2rem 3rem' }}><Database size={18} /> MANAGE INVENTORY</Link>
            <Link to="/admin/workers" className="btn-gold" style={{ padding: '1.2rem 3rem' }}><Briefcase size={18} /> STAFF CONTROL</Link>
         </div>
      </header>

      {/* 📊 CORE STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
         <div className="glass-card" style={{ textAlign: 'center' }}>
            <TrendingUp size={30} color="var(--gold)" style={{ marginBottom: '1rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '2px' }}>TOTAL REVENUE</div>
            <div className="serif" style={{ fontSize: '3.5rem' }}>₹{stats.total_revenue}</div>
         </div>
         <div className="glass-card" style={{ textAlign: 'center' }}>
            <Calendar size={30} color="var(--gold)" style={{ marginBottom: '1rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '2px' }}>BOOKINGS</div>
            <div className="serif" style={{ fontSize: '3.5rem' }}>{stats.total_bookings}</div>
         </div>
         <div className="glass-card" style={{ textAlign: 'center' }}>
            <Users size={30} color="var(--gold)" style={{ marginBottom: '1rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '2px' }}>ACTIVE USERS</div>
            <div className="serif" style={{ fontSize: '3.5rem' }}>{stats.active_users}</div>
         </div>
         <div className="glass-card" style={{ textAlign: 'center' }}>
            <Star size={30} color="var(--gold)" style={{ marginBottom: '1rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '2px' }}>AVG RATING</div>
            <div className="serif" style={{ fontSize: '3.5rem' }}>{stats.avg_rating}</div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
         <div className="glass-card" style={{ padding: '3rem' }}>
            <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>REVENUE <span style={{ color: 'var(--gold)' }}>BY FLOOR</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {Object.entries(stats.revenue_by_floor || {}).map(([floor, rev]) => (
                  <div key={floor} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontWeight: 'bold' }}>{floor.toUpperCase()}</span>
                     <div style={{ flex: 1, height: '8px', background: 'rgba(212,175,55,0.1)', margin: '0 2rem', borderRadius: '4px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--gold)', borderRadius: '4px', width: `${(rev / (stats.total_revenue || 1)) * 100}%` }}></div>
                     </div>
                     <span className="serif">₹{rev}</span>
                  </div>
               ))}
            </div>
         </div>
         <div className="glass-card" style={{ padding: '3rem' }}>
            <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>POPULAR <span style={{ color: 'var(--gold)' }}>SERVICES</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {(stats.popular_services || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                     <span>{s.name}</span>
                     <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{s.bookings} Bookings</span>
                   </div>
                ))}
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
         
         {/* 🔐 SECURITY AUDITS */}
         <section className="glass-card" style={{ padding: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
               <h3 className="serif" style={{ fontSize: '2.5rem' }}>SECURITY <span style={{ color: 'var(--gold)' }}>AUDITS</span></h3>
               <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <button onClick={async () => { if(confirm("Clear all logs?")) { await api.delete('/admin/clear/audits'); fetchAudits(); } }} style={{ background: 'transparent', border: '1px solid #f44336', color: '#f44336', padding: '0.5rem 1rem', borderRadius: '5px', fontSize: '0.7rem' }}>PURGE LOGS</button>
                  <Link to="/admin/audits" style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none' }}>VIEW ALL LOGS <ArrowRight size={14} /></Link>
               </div>
            </div>
            <div className="audit-list">
               {audits.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '2rem', padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                     <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '0.8rem', minWidth: '80px' }}>{a.action}</div>
                     <div style={{ fontSize: '0.9rem' }}>{a.details}</div>
                     <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(a.timestamp).toLocaleString()}</div>
                  </div>
               ))}
            </div>
         </section>

         {/* ⚙️ QUICK ACTIONS */}
         <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '3rem', borderTop: '4px solid var(--gold)' }}>
               <h4 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>QUICK ACTIONS</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Link to="/admin/workers" className="btn-gold" style={{ justifyContent: 'flex-start' }}><Briefcase size={16} /> STAFF CONTROL</Link>
                  <Link to="/admin/revenue" className="btn-gold" style={{ justifyContent: 'flex-start' }}><TrendingUp size={16} /> REVENUE REPORTS</Link>
                  <button onClick={async () => { if(confirm("Delete all booking history?")) { await api.delete('/admin/clear/bookings'); fetchStats(); } }} className="btn-gold" style={{ justifyContent: 'flex-start', background: 'transparent', border: '1px solid #f44336', color: '#f44336' }}><Database size={16} /> CLEAR BOOKINGS</button>
                  <button onClick={async () => { if(confirm("Reset entire database?")) { await api.get('/reset-db'); window.location.reload(); } }} className="btn-gold" style={{ justifyContent: 'flex-start', background: 'var(--gold)', color: 'black' }}><Shield size={16} /> SYSTEM RESET</button>
               </div>
            </div>

            <div className="glass-card" style={{ padding: '3rem', background: 'var(--gold)', color: 'black' }}>
               <Shield size={40} style={{ marginBottom: '1.5rem' }} />
               <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ESTATE CLEARANCE</h4>
               <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>All worker credentials and floor access logs are encrypted and verified at every entry point.</p>
            </div>
         </section>

      </div>
    </div>
  );
};

export default Dashboard;
