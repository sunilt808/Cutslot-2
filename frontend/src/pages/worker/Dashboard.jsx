import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Check, X, Bell, User as UserIcon, Scissors, Clock, Wallet, BarChart3, History, Shield, TrendingUp, Sparkles, Star } from 'lucide-react';

const WorkerDashboard = () => {
  const { user, api } = useAuth();
  const [stats, setStats] = useState({ assigned_floor: 0, personal_revenue: 0, completed_bookings: 0, upcoming_queue: 0 });
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
    } catch (err) { alert("Action failed."); }
  };

  return (
    <div className="worker-dashboard-page fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '4px solid var(--gold)' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '50%' }}>
            <Scissors size={40} color="var(--gold)" />
          </div>
          <div>
            <h1 className="serif" style={{ fontSize: '3rem', margin: 0 }}>ARTISAN <span style={{ color: 'var(--gold)' }}>0{user?.assigned_floor || "X"}</span></h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Welcome, {user?.username}. Elite Floor Protocol is active.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '3rem', textAlign: 'center' }}>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '2.4rem', fontWeight: 'bold' }}>₹{stats.personal_revenue}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>PARTICULAR REVENUE</div>
           </div>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '2.4rem', fontWeight: 'bold' }}>{stats.avg_rating} <Star size={20} style={{ display: 'inline', marginBottom: '5px' }} /></div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>AVG RATING</div>
           </div>
           <div className="stat-sm">
              <button onClick={async () => { if(confirm("Clear notifications?")) { await api.delete('/notifications/clear'); } }} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.7rem' }}>CLEAR NOTIFICATIONS</button>
           </div>
        </div>
      </header>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
         <div className="glass-card">
            <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={24} color="var(--gold)" /> LIVE CUTSLOT QUEUE
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
               {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length === 0 ? (
                 <p style={{ color: 'var(--text-dim)', padding: '3rem', textAlign: 'center' }}>No active clients on Floor {user.assigned_floor}.</p>
               ) : (
                 bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').map(b => (
                   <div className="glass-card" key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: b.status === 'confirmed' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ fontSize: '1.8rem', color: 'var(--gold)', fontWeight: 'bold' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                         <div>
                            <div className="serif" style={{ fontSize: '1.4rem' }}>{b.stylist_name} Session</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Client Protocol #{b.user_id} | Priority Processing</div>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                         {b.status === 'pending' && <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-gold" style={{ background: '#4caf50', border: 'none', color: 'white', padding: '0.6rem 1rem' }}><Check size={16} /> CONFIRM</button>}
                         {b.status === 'confirmed' && <button onClick={() => updateStatus(b.id, 'completed')} className="btn-gold" style={{ padding: '0.6rem 1rem' }}><Sparkles size={16} /> DONE</button>}
                         <button onClick={() => updateStatus(b.id, 'absent')} style={{ background: 'transparent', border: '1px solid var(--text-dim)', color: 'var(--text-dim)', padding: '0.6rem 1rem', borderRadius: '10px' }}>ABSENT</button>
                         <button onClick={() => updateStatus(b.id, 'rescheduled')} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.6rem 1rem', borderRadius: '10px' }}>FIX TIME</button>
                         <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ background: 'transparent', border: '1px solid #f44336', color: '#f44336', padding: '0.6rem 1rem', borderRadius: '10px' }}><X size={16} /></button>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card" style={{ background: 'linear-gradient(rgba(212,175,55,0.05), transparent)' }}>
               <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><TrendingUp size={20} color="var(--gold)" /> DAILY STATS</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Queue Depth</span><span style={{ color: 'var(--gold)' }}>{stats.upcoming_queue} Clients</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Floor Efficiency</span><span style={{ color: '#4caf50' }}>EXCELLENT</span></div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
                  <Link to="/staff/queue" className="btn-gold" style={{ fontSize: '0.8rem', padding: '1rem' }}><Clock size={16} /> MANAGE FULL QUEUE</Link>
                  <Link to="/staff/performance" className="btn-gold" style={{ fontSize: '0.8rem', padding: '1rem' }}><BarChart3 size={16} /> VIEW REVENUE LOGS</Link>
               </div>
            </div>

            <div className="glass-card">
               <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Shield size={20} color="var(--gold)" /> FLOOR AUDIT</h3>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>Ensure all stations on Floor {user.assigned_floor} are sanitized between elite sessions.</div>
                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>Last login tracked: {new Date().toLocaleTimeString()} from CUTSLOT IP.</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
