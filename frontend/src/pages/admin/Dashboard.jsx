import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Users, Calendar, Star, Shield, Briefcase, Database, Activity, History, ArrowRight, Settings, UserCircle, PieChart, Layout, Crown, ShieldAlert, X } from 'lucide-react';

const AdminDashboard = () => {
  const { api } = useAuth();
  const [stats, setStats] = useState({ total_revenue: 0, total_bookings: 0, active_users: 0, avg_rating: 0, revenue_by_floor: {}, popular_services: [] });
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchAudits();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchAudits = async () => {
    try {
      const res = await api.get('/admin/audits');
      setAudits(res.data.slice(0, 8));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-dashboard-elite fade-in" style={{ padding: '2rem' }}>
      <header className="glass-card" style={{ padding: '5rem 4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at bottom left, rgba(212,175,55,0.05), transparent)' }}>
         <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
               <Shield size={18} /> DIRECTORATE COMMAND
            </div>
            <h1 className="serif gradient-text" style={{ fontSize: '5rem', margin: 0, letterSpacing: '-2px' }}>
               ADMIN <span style={{ color: 'var(--text-cream)' }}>OVERVIEW</span>
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Global estate performance and security synchronization.</p>
         </div>
         <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/admin/services" className="btn-gold" style={{ padding: '1.5rem 3rem', borderRadius: '40px', display: 'flex', gap: '10px', alignItems: 'center' }}><Database size={18} /> INVENTORY</Link>
            <Link to="/admin/workers" className="btn-gold" style={{ padding: '1.5rem 3rem', borderRadius: '40px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', display: 'flex', gap: '10px', alignItems: 'center' }}><Briefcase size={18} /> STAFF</Link>
         </div>
      </header>

      {/* 📊 CORE METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <TrendingUp size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>TOTAL REVENUE</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>₹{stats.total_revenue}</div>
            <div style={{ fontSize: '0.7rem', color: '#4caf50', fontWeight: 'bold' }}>+12.4% PERFORMANCE</div>
         </div>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Calendar size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>BOOKINGS</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>{stats.total_bookings}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold' }}>ESTATE RITUALS</div>
         </div>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Users size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>ACTIVE USERS</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>{stats.active_users}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-cream)', fontWeight: 'bold' }}>VETTED ACCOUNTS</div>
         </div>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Star size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>AVG RATING</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>{stats.avg_rating}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold' }}>EXCELLENCE SCORE</div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '3rem', marginBottom: '4rem' }}>
         {/* 🕋 REVENUE BY FLOOR CHART */}
         <div className="glass-card" style={{ padding: '4rem' }}>
            <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '15px' }}><PieChart size={24} color="var(--gold)" /> REVENUE <span style={{ color: 'var(--gold)' }}>DISTRIBUTION</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               {Object.entries(stats.revenue_by_floor || {}).map(([floor, rev]) => (
                  <div key={floor} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                     <div style={{ minWidth: '100px', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--gold)' }}>FLOOR {floor}</div>
                     <div style={{ flex: 1, height: '12px', background: 'rgba(212,175,55,0.05)', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                        <div className="pulse-gold-static" style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--gold)', width: `${(rev / (stats.total_revenue || 1)) * 100}%` }}></div>
                     </div>
                     <div className="serif" style={{ minWidth: '120px', textAlign: 'right', fontSize: '1.5rem' }}>₹{rev}</div>
                  </div>
               ))}
               {!Object.keys(stats.revenue_by_floor).length && <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Awaiting initial revenue recordings...</p>}
            </div>
         </div>

         {/* 💎 POPULAR SERVICES */}
         <div className="glass-card" style={{ padding: '4rem' }}>
            <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '15px' }}><Crown size={24} color="var(--gold)" /> ELITE <span style={{ color: 'var(--gold)' }}>DEMAND</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {(stats.popular_services || []).length > 0 ? stats.popular_services.map((s, i) => (
                  <div key={i} className="hover-lift" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                     <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 'bold' }}>{i+1}</div>
                         <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                     </div>
                     <div style={{ color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '1px' }}>{s.bookings} RITUALS</div>
                  </div>
               )) : <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Generating demand data...</p>}
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
         {/* 🔐 ESTATE SECURITY AUDITS */}
         <section className="glass-card" style={{ padding: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
               <h3 className="serif" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}><ShieldAlert size={24} color="var(--gold)" /> SECURITY <span style={{ color: 'var(--gold)' }}>LOGS</span></h3>
               <Link to="/admin/audits" style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>VIEW AUDIT VAULT <ArrowRight size={16} /></Link>
            </div>
            <div className="audit-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {audits.length > 0 ? audits.map((a, i) => (
                  <div key={i} className="hover-lift" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', borderRadius: '15px', borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                     <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '0.8rem', minWidth: '120px', letterSpacing: '1px' }}>{a.action.toUpperCase()}</div>
                     <div style={{ fontSize: '0.9rem', color: 'var(--text-cream)' }}>{a.details}</div>
                     <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(a.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                  </div>
               )) : <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Security systems nominal. Audit vault empty.</p>}
            </div>
         </section>

         {/* ⚡ DIRECT CONTROL CENTER */}
         <section className="glass-card" style={{ padding: '4rem', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.08), transparent)' }}>
            <h3 className="serif" style={{ fontSize: '2.2rem', marginBottom: '3rem' }}>DIRECT <span style={{ color: 'var(--gold)' }}>CONTROL</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
               <Link to="/admin/workers" className="btn-gold" style={{ padding: '1.2rem', justifyContent: 'flex-start', gap: '15px', borderRadius: '15px' }}><Briefcase size={18} /> MANAGE ARTISANS</Link>
               <Link to="/admin/services" className="btn-gold" style={{ padding: '1.2rem', justifyContent: 'flex-start', gap: '15px', borderRadius: '15px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}><Database size={18} /> EDIT CATALOGS</Link>
               <Link to="/admin/revenue" className="btn-gold" style={{ padding: '1.2rem', justifyContent: 'flex-start', gap: '15px', borderRadius: '15px' }}><TrendingUp size={18} /> FINANCIAL REPORTS</Link>
               <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                  <button onClick={async () => { if(confirm("AUTHORIZE FULL SYSTEM RESET? ALL BOOKINGS WILL BE PURGED.")) { await api.get('/reset-db'); window.location.reload(); } }} className="btn-gold" style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', background: '#f44336', color: 'white', border: 'none', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                     <ShieldClose size={18} /> EMERGENCY PROTOCOL: RESET
                  </button>
               </div>
            </div>
         </section>
      </div>

      <footer style={{ marginTop: '8rem', textAlign: 'center', padding: '5rem', borderTop: '1px solid var(--glass-border)', opacity: 0.5 }}>
          <p style={{ letterSpacing: '10px', fontWeight: 'bold', color: 'var(--gold)' }}>CUTSLOT EXECUTIVE DIRECTORATE</p>
      </footer>
    </div>
  );
};

// Internal utility component for the reset button icon
const ShieldClose = ({ size }) => (
    <div style={{ position: 'relative', width: size, height: size }}>
        <Shield size={size} />
        <X size={size/1.5} style={{ position: 'absolute', top: '20%', left: '16%', color: 'white' }} strokeWidth={3} />
    </div>
);

export default AdminDashboard;
