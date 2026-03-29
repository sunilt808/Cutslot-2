import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Check, X, Bell, User as UserIcon, Scissors, Clock, Wallet, BarChart3, History, Shield, TrendingUp, Sparkles, Star } from 'lucide-react';

const WorkerDashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState({ assigned_floor: 0, personal_revenue: 0, completed_bookings: 0, upcoming_queue: 0, avg_rating: 4.8 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [api]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingRes] = await Promise.all([
        api.get('/worker/stats'),
        api.get('/bookings/')
      ]);
      setStats(statsRes.data);
      setBookings(bookingRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    let newTime = null;
    if (status === 'rescheduled') {
      const resp = prompt("Enter new timing (YYYY-MM-DDTHH:MM:SS):", new Date().toISOString().slice(0, 19));
      if (!resp) return;
      newTime = resp;
    }
    try {
      await api.put(`/bookings/${id}/status`, { status, new_time: newTime });
      fetchData(); // Refresh both queue and stats
      alert(`CLIENT PROTOCOL: ${status.toUpperCase()}`);
    } catch (err) { alert("Action declined by system."); }
  };

  return (
    <div className="worker-dashboard-page fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '4px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent)' }}>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <div className="pulse-gold" style={{ background: 'var(--gold)', padding: '18px', borderRadius: '50%' }}>
            <Scissors size={40} color="black" />
          </div>
          <div>
            <h1 className="serif" style={{ fontSize: '3.5rem', margin: 0, letterSpacing: '-2px' }}>ARTISAN <span style={{ color: 'var(--gold)' }}>0{user?.assigned_floor || "X"}</span></h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Welcome, {user?.full_name || user?.username}. Your personalized ritual queue is active.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '3rem', textAlign: 'center' }}>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '3rem', fontWeight: 'bold' }}>₹{stats.personal_revenue}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '3px' }}>MY REVENUE</div>
           </div>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '3rem', fontWeight: 'bold' }}>{stats.avg_rating} <Star size={24} fill="var(--gold)" style={{ display: 'inline', verticalAlign: 'middle', marginTop: '-10px' }} /></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '3px' }}>AVG RATING</div>
           </div>
        </div>
      </header>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
         <div className="glass-card" style={{ padding: '4rem' }}>
            <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Clock size={30} color="var(--gold)" /> PERSONAL QUEUE
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length === 0 ? (
                 <div style={{ textAlign: 'center', padding: '5rem', border: '1px dashed var(--glass-border)', borderRadius: '25px' }}>
                    <Calendar size={50} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>No rituals assigned to you for the current cycle.</p>
                 </div>
               ) : (
                 bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').sort((a,b) => new Date(a.booking_time) - new Date(b.booking_time)).map(b => (
                   <div className="glass-card hover-lift" key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: b.status === 'confirmed' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', padding: '2.5rem' }}>
                      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                         <div style={{ fontSize: '2rem', color: 'var(--gold)', fontWeight: 'bold' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                         <div>
                            <div className="serif" style={{ fontSize: '1.6rem' }}>{b.user_name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '5px' }}>Token: CS-{b.id}-{new Date().getFullYear()} | Priority Ritual</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                         {b.status === 'pending' && <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-gold" style={{ background: '#4caf50', border: 'none', color: 'white', padding: '0.8rem 1.5rem', fontWeight: 'bold' }}>CONFIRM</button>}
                         {b.status === 'confirmed' && <button onClick={() => updateStatus(b.id, 'completed')} className="btn-gold" style={{ padding: '0.8rem 1.5rem', fontWeight: 'bold' }}>MARK DONE</button>}
                         <button onClick={() => updateStatus(b.id, 'absent')} style={{ background: 'transparent', border: '1px solid var(--text-dim)', color: 'var(--text-dim)', padding: '0.8rem 1.5rem', borderRadius: '15px' }}>ABSENT</button>
                         <button onClick={() => updateStatus(b.id, 'rescheduled')} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.8rem 1.5rem', borderRadius: '15px' }}>MOVE TIME</button>
                         <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ background: 'transparent', border: '1px solid #f44336', color: '#f44336', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div className="glass-card" style={{ padding: '3rem', background: 'linear-gradient(rgba(212,175,55,0.05), transparent)', border: '1px solid var(--glass-border)' }}>
               <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}><TrendingUp size={24} color="var(--gold)" /> DASHBOARD</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Queue Depth</span><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{stats.upcoming_queue} Guests</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Efficiency</span><span style={{ color: '#4caf50', fontWeight: 'bold' }}>EXCELLENT (98%)</span></div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
                  <Link to="/staff/queue" className="btn-gold" style={{ fontSize: '0.9rem', padding: '1.2rem', textAlign: 'center' }}>BROWSE FULL QUEUE</Link>
                  <Link to="/staff/performance" className="btn-gold" style={{ fontSize: '0.9rem', padding: '1.2rem', textAlign: 'center' }}>VIEW REVENUE LOGS</Link>
               </div>
            </div>

            <div className="glass-card" style={{ padding: '3rem', border: '1px solid var(--gold-glow)' }}>
               <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}><Shield size={22} color="var(--gold)" /> AUDIT PROTOCOL</h3>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>Welcome back, Artisan. Your session logs are being monitored for consistency across Floor 0{user?.assigned_floor}.</div>
                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', fontSize: '0.75rem' }}>Network: Secure Cutslot Intranet | {new Date().toLocaleTimeString()}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
