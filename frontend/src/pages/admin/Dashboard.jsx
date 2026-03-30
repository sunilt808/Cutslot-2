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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem', background: 'linear-gradient(135deg, rgba(212,175,55,0.08), transparent)' }}>
            <TrendingUp size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>ESTATE REVENUE</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>₹{stats.total_revenue}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>
               <span style={{ color: '#4caf50' }}>NET PROFIT: ₹{stats.net_profit?.toFixed(0) || '0'}</span>
            </div>
         </div>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Users size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>ESTATE GUESTS</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>{stats.client_count || '0'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold' }}>REGISTERED CLIENTS</div>
         </div>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Calendar size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>TOTAL RITUALS</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>{stats.total_bookings}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-cream)', fontWeight: 'bold' }}>ALL-TIME SESSIONS</div>
         </div>
         <div className="glass-card hover-lift" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Activity size={30} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '3px', fontWeight: 'bold' }}>SERVICE DIVERSITY</div>
            <div className="serif" style={{ fontSize: '3.8rem', margin: '0.5rem 0' }}>{stats.service_breakdown?.length || '0'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>UNIQUE RITUALS</div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
         {/* 👥 CLIENT DIRECTORY (V3.1) */}
         <div className="glass-card" style={{ padding: '4rem' }}>
            <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '15px' }}><Users size={24} color="var(--gold)" /> GUEST <span style={{ color: 'var(--gold)' }}>DIRECTORY</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {(stats.client_list || []).map((c, i) => (
                  <div key={i} className="hover-lift" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid var(--glass-border)' }}>
                     <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{c.email}</div>
                     </div>
                     <div style={{ fontStyle: 'italic', color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '1px' }}>{c.category?.toUpperCase()}</div>
                  </div>
               ))}
               {!stats.client_list?.length && <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Awaiting initial guest registrations...</p>}
            </div>
         </div>

         {/* 🕋 POPULAR DEMAND */}
         <div className="glass-card" style={{ padding: '4rem' }}>
            <h3 className="serif" style={{ fontSize: '2.2rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '15px' }}><Crown size={22} color="var(--gold)" /> TOP <span style={{ color: 'var(--gold)' }}>DEMAND</span></h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {(stats.popular_services || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '1rem', borderLeft: '3px solid var(--gold)', background: 'rgba(212,175,55,0.02)' }}>
                     <span style={{ fontWeight: 'bold' }}>{s.name}</span>
                     <span style={{ color: 'var(--gold)' }}>{s.bookings} BUZZ</span>
                  </div>
               ))}
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
