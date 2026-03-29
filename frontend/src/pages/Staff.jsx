import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Check, X, Bell, User as UserIcon, Scissors, Clock, Wallet, BarChart3, History, Shield } from 'lucide-react';

const Staff = () => {
  const { user, api } = useAuth();
  const [activeTab, setActiveTab] = useState("queue");
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ assigned_floor: 0, personal_revenue: 0, completed_bookings: 0, upcoming_queue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, bookingRes] = await Promise.all([
          api.get('/worker/stats'),
          api.get('/bookings/')
        ]);
        setStats(statsRes.data);
        setBookings(bookingRes.data);
      } catch (err) {
        console.error("Error fetching staff data:", err);
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
      // Refresh stats if status is completed
      if (status === 'completed') {
        const statsRes = await api.get('/worker/stats');
        setStats(statsRes.data);
      }
    } catch (err) {
      alert("Status update failed.");
    }
  };

  return (
    <div className="staff-container fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '4px solid var(--gold)' }}>
        <div style={{ textAlign: 'right', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
           <div style={{ background: 'var(--gold-glow)', padding: '10px', borderRadius: '50%' }}>
             <UserIcon size={30} color="var(--gold)" />
           </div>
           <div>
              <h1 className="serif" style={{ fontSize: '3rem', margin: 0 }}>WORKER <span style={{ color: 'var(--gold)' }}>0{user?.assigned_floor || "X"}</span></h1>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Welcome back, Master Stylist {user?.username}.</p>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '3rem', textAlign: 'center' }}>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>₹{stats.personal_revenue}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>YOUR REVENUE</div>
           </div>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completed_bookings}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>SESSIONS COMPLETED</div>
           </div>
        </div>
      </header>

      <div className="staff-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        <aside className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
           <button onClick={() => setActiveTab("queue")} className={`btn-gold ${activeTab === 'queue' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'queue' ? 'var(--gold)' : 'transparent', color: activeTab === 'queue' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><Clock size={18} /> SERVICE QUEUE</button>
           <button onClick={() => setActiveTab("history")} className={`btn-gold ${activeTab === 'history' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'history' ? 'var(--gold)' : 'transparent', color: activeTab === 'history' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><History size={18} /> PERFORMANCE LOG</button>
           <button onClick={() => setActiveTab("notary")} className={`btn-gold ${activeTab === 'notary' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'notary' ? 'var(--gold)' : 'transparent', color: activeTab === 'notary' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><Shield size={18} /> SECURITY FEED</button>
        </aside>

        <main>
           {activeTab === 'queue' && (
             <div className="fade-in">
                <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={24} color="var(--gold)" /> LIVE ATELIER QUEUE
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                   {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length === 0 ? (
                     <p style={{ color: 'var(--text-dim)', padding: '3rem', textAlign: 'center' }}>No active clients in the queue for Floor {user.assigned_floor}.</p>
                   ) : (
                     bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').map(b => (
                       <div className="glass-card" key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: b.status === 'confirmed' ? '1px solid var(--gold)' : '1px solid var(--glass-border)' }}>
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                             <div style={{ fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 'bold' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                             <div>
                                <div className="serif" style={{ fontSize: '1.4rem' }}>Stylist: {b.stylist_name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Client: ID#{b.user_id} | Floor {b.floor}</div>
                             </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                             {b.status === 'pending' && <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-gold" style={{ background: '#4caf50', border: 'none', color: 'white', padding: '0.6rem 1rem' }}><Check size={16} /> ACCEPT</button>}
                             {b.status === 'confirmed' && <button onClick={() => updateStatus(b.id, 'completed')} className="btn-gold" style={{ background: 'var(--gold)', color: 'var(--bg-dark)', padding: '0.6rem 1rem' }}><BarChart3 size={16} /> COMPLETE</button>}
                             <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ background: 'transparent', border: '1px solid #f44336', color: '#f44336', padding: '0.6rem 1rem', borderRadius: '10px' }}><X size={16} /></button>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
           )}

           {activeTab === 'history' && (
             <div className="fade-in">
                <h2 className="serif" style={{ fontSize: '2.4rem', marginBottom: '1rem', color: 'var(--gold)' }}>SESSION PERFORMANCE</h2>
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').slice(0, 10).map(b => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                         <div>
                            <span style={{ color: 'var(--text-dim)' }}>{new Date(b.booking_time).toLocaleDateString()}</span>
                            <span style={{ marginLeft: '1rem' }}>{b.stylist_name}</span>
                         </div>
                         <div style={{ fontWeight: 'bold', color: b.status === 'completed' ? '#4caf50' : '#f44336' }}>{b.status.toUpperCase()}</div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'notary' && (
             <div className="fade-in">
                <h2 className="serif" style={{ fontSize: '2.4rem' }}>SECURITY & AUDITS</h2>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '15px' }}>
                   <p style={{ color: 'var(--text-dim)' }}>Access to professional logs is restricted to floor-authorized personnel. Logging each action ensures atelier precision.</p>
                   <div style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '2rem', marginTop: '2rem' }}>
                      <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Worker signed in successfully from Floor {user.assigned_floor} IP.</div>
                      <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>Booking #44 status changed to COMPLETED by {user.username}.</div>
                   </div>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default Staff;
