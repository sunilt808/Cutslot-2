import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, BookOpen, Clock, Activity, Users, Wallet, Star, LayoutDashboard, History, Settings, MessageSquare, IndianRupee } from 'lucide-react';

const Admin = () => {
  const { user, api } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ total_revenue: 0, total_bookings: 0, active_users: 0, avg_rating: 0 });
  const [bookings, setBookings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, bookingRes, auditRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/bookings/'),
          api.get('/audit-logs/')
        ]);
        setStats(statsRes.data);
        setBookings(bookingRes.data);
        setAuditLogs(auditRes.data || []);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert("Status update failed.");
    }
  };

  return (
    <div className="admin-container fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', borderTop: '4px solid var(--gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>ATELIER <span style={{ color: 'var(--text-cream)' }}>OVERSEER</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Global administrative control for the LUMIÈRE Ecosystem.</p>
        </div>
        <div style={{ display: 'flex', gap: '3rem', textAlign: 'center' }}>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '2.4rem', fontWeight: 'bold' }}>₹{stats.total_revenue}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>OVERALL REVENUE</div>
           </div>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '2.4rem', fontWeight: 'bold' }}>{stats.total_bookings}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>TOTAL BOOKINGS</div>
           </div>
        </div>
      </header>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 4fr', gap: '2rem' }}>
        <aside className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
           <button onClick={() => setActiveTab("dashboard")} className={`btn-gold ${activeTab === 'dashboard' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'dashboard' ? 'var(--gold)' : 'transparent', color: activeTab === 'dashboard' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><LayoutDashboard size={18} /> OVERVIEW</button>
           <button onClick={() => setActiveTab("bookings")} className={`btn-gold ${activeTab === 'bookings' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'bookings' ? 'var(--gold)' : 'transparent', color: activeTab === 'bookings' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><BookOpen size={18} /> APPOINTMENTS</button>
           <button onClick={() => setActiveTab("reviews")} className={`btn-gold ${activeTab === 'reviews' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'reviews' ? 'var(--gold)' : 'transparent', color: activeTab === 'reviews' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><MessageSquare size={18} /> REVIEWS</button>
           <button onClick={() => setActiveTab("audits")} className={`btn-gold ${activeTab === 'audits' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'audits' ? 'var(--gold)' : 'transparent', color: activeTab === 'audits' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><History size={18} /> AUDITS</button>
        </aside>

        <main className="glass-card" style={{ padding: '3rem' }}>
           {activeTab === 'dashboard' && (
             <div className="fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                   <div className="stat-box" style={{ padding: '2rem', border: '1px solid var(--glass-border)', borderRadius: '20px', textAlign: 'center' }}>
                      <Activity color="var(--gold)" size={32} style={{ marginBottom: '1rem' }} />
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.active_users}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>ACTIVE STAFF / USERS</div>
                   </div>
                   <div className="stat-box" style={{ padding: '2rem', border: '1px solid var(--glass-border)', borderRadius: '20px', textAlign: 'center' }}>
                      <Star color="var(--gold)" size={32} style={{ marginBottom: '1rem' }} />
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.avg_rating}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>GUEST SATISFACTION</div>
                   </div>
                   <div className="stat-box" style={{ padding: '2rem', border: '1px solid var(--glass-border)', borderRadius: '20px', textAlign: 'center' }}>
                      <Shield color="var(--gold)" size={32} style={{ marginBottom: '1rem' }} />
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>4</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>ACTIVE ATELIER FLOORS</div>
                   </div>
                   <div className="stat-box" style={{ padding: '2rem', border: '1px solid var(--glass-border)', borderRadius: '20px', textAlign: 'center' }}>
                      <Wallet color="var(--gold)" size={32} style={{ marginBottom: '1rem' }} />
                      <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{stats.total_revenue}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>GROSS PROFIT</div>
                   </div>
                </div>

                <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem' }}>REVENUE TREND</h3>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '5rem', border: '1px dashed var(--gold)', borderRadius: '20px', textAlign: 'center', color: 'var(--gold)' }}>
                   PROFIT CHART VISUALIZATION (PREMIUM MODULE)
                   <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '1rem' }}>Overall revenue is distributed across {stats.total_bookings} sessions with a 98.4% efficiency rate.</p>
                </div>
             </div>
           )}

           {activeTab === 'bookings' && (
             <div className="fade-in">
                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>ALL ELITE APPOINTMENTS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {bookings.map(b => (
                     <div key={b.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <div>
                           <div className="serif" style={{ fontSize: '1.4rem' }}>Client ID: {b.user_id} | Floor {b.floor}</div>
                           <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{new Date(b.booking_time).toLocaleString()} | Stylist: {b.stylist_name} | Paid: ₹{b.price_paid}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                           <button onClick={() => updateStatus(b.id, 'cancelled')} className="btn-gold" style={{ background: 'transparent', border: '1px solid #f44336', color: '#f44336' }}>CANCEL</button>
                           <button onClick={() => updateStatus(b.id, 'completed')} className="btn-gold">COMPLETE</button>
                           <div style={{ fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gold)', marginLeft: '1rem', border: '1px solid var(--gold)', padding: '0.5rem 1rem', borderRadius: '8px' }}>{b.status}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'audits' && (
             <div className="fade-in">
                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2.5rem' }}>SECURITY AUDIT LOGS HISTORY</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {auditLogs.map(log => (
                    <div key={log.id} style={{ padding: "1.5rem", borderBottom: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.02)", borderRadius: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ color: "var(--gold)", fontWeight: "bold" }}>{log.action}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>ID: {log.user_id} | {new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <div style={{ color: "var(--text-cream)", fontSize: "0.95rem" }}>{log.details}</div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'reviews' && (
             <div className="fade-in" style={{ textAlign: 'center', padding: '5rem' }}>
                <MessageSquare size={48} color="var(--gold)" style={{ opacity: 0.2, marginBottom: '2rem' }} />
                <h3 className="serif" style={{ fontSize: '2rem' }}>GUEST REVIEWS</h3>
                <p style={{ color: 'var(--text-dim)' }}>Reviews are aggregated here from all floors to monitor satisfaction levels.</p>
                {/* Review mapping logic here */}
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
