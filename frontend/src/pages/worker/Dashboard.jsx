import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Check, X, Bell, User as UserIcon, Scissors, Clock, Wallet, BarChart3, History, Shield, TrendingUp, Sparkles, Star, Zap } from 'lucide-react';

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
      fetchData();
      alert(`CLIENT PROTOCOL: ${status.toUpperCase()}`);
    } catch (err) { alert("Action declined by system."); }
  };

  const isToday = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const currentQueue = bookings.filter(b => (b.status === 'pending' || b.status === 'confirmed') && isToday(b.booking_time));
  const futureQueue = bookings.filter(b => (b.status === 'pending' || b.status === 'confirmed') && !isToday(b.booking_time));

  return (
    <div className="worker-dashboard-page fade-in" style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header className="glass-card" style={{ padding: '5rem', marginBottom: '6rem', borderRadius: '40px', borderRight: '8px solid var(--gold)', background: 'linear-gradient(to left, rgba(212,175,55,0.05), transparent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '3.5rem', alignItems: 'center' }}>
          <div className="pulse-gold" style={{ background: 'var(--gold)', padding: '25px', borderRadius: '50%' }}>
            <Scissors size={50} color="black" />
          </div>
          <div>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>ARTISAN TERMINAL</div>
            <h1 className="serif" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>ESTATE <span style={{ color: 'var(--gold)' }}>0{user?.assigned_floor || "X"}</span></h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem', marginTop: '1rem' }}>Welcome, {user?.full_name || user?.username}. Your ritual synchronization is active.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '5rem', textAlign: 'right' }}>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '4.5rem', fontWeight: 'bold', lineHeight: 1 }}>₹{stats.personal_revenue}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '4px', marginTop: '1rem' }}>ESTATE YIELD</div>
           </div>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '4.5rem', fontWeight: 'bold', lineHeight: 1 }}>{stats.avg_rating}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '4px', marginTop: '1rem' }}>GUEST RATING</div>
           </div>
        </div>
      </header>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '4rem' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* ⏱️ TODAY'S RITUAL QUEUE */}
            <div className="glass-card" style={{ padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '40px' }}>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Clock size={35} color="var(--gold)" /> TODAY'S <span style={{ color: 'var(--gold)' }}>QUEUE</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {currentQueue.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem', border: '1px dashed var(--glass-border)', borderRadius: '30px' }}>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem' }}>No immediate rituals pending for today.</p>
                    </div>
                ) : (
                    currentQueue.sort((a,b) => new Date(a.booking_time) - new Date(b.booking_time)).map(b => (
                    <div className="glass-card hover-lift" key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: b.status === 'confirmed' ? '2px solid var(--gold)' : '1px solid var(--glass-border)', padding: '3.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '30px' }}>
                        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '2.5rem', color: 'var(--gold)', fontWeight: 'bold' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div>
                                <div className="serif" style={{ fontSize: '2.2rem' }}>{b.user_name}</div>
                                <div style={{ fontSize: '1rem', color: 'var(--text-dim)', marginTop: '8px' }}>GUEST ID: #{b.user_id} | STATUS: <span style={{ color: b.status === 'confirmed' ? 'var(--gold)' : '#ff9800' }}>{b.status.toUpperCase()}</span></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {b.status === 'pending' && <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-gold" style={{ padding: '1.2rem 2.5rem', fontWeight: 'bold' }}>ACCREDIT</button>}
                            {b.status === 'confirmed' && <button onClick={() => updateStatus(b.id, 'completed')} className="btn-gold" style={{ padding: '1.2rem 2.5rem', background: '#4caf50', border: 'none' }}>CONCLUDE</button>}
                            <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ background: 'rgba(244,67,54,0.1)', color: '#f44336', border: '1px solid #f44336', padding: '1rem', borderRadius: '50%' }}><X size={20} /></button>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>

            {/* 📅 BESPOKE RITUALS (ADVANCED BOOKING) */}
            <div className="glass-card" style={{ padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '40px', borderLeft: '8px solid #4a90e2' }}>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Calendar size={35} color="#4a90e2" /> BESPOKE <span style={{ color: '#4a90e2' }}>LEDGER</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {futureQueue.length === 0 ? (
                    <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem' }}>No advanced rituals archived.</p>
                ) : (
                    futureQueue.sort((a,b) => new Date(a.booking_time) - new Date(b.booking_time)).map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '25px', border: '1px solid var(--glass-border)' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>{new Date(b.booking_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '1rem', marginTop: '5px' }}>{b.user_name} • Future Ritual</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--gold)' }}>₹{b.price_paid}</div>
                             <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>COMMISSION: 15%</div>
                        </div>
                    </div>
                    ))
                )}
                </div>
            </div>
         </div>

         <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <div className="glass-card" style={{ padding: '4rem', background: 'linear-gradient(rgba(212,175,55,0.05), transparent)', border: '1px solid var(--gold-glow)', borderRadius: '40px' }}>
               <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '15px' }}><TrendingUp size={24} color="var(--gold)" /> METRICS</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ color: 'var(--text-dim)' }}>QUEUE DEPTH</span>
                     <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.4rem' }}>{stats.upcoming_queue}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ color: 'var(--text-dim)' }}>YIELD TARGET</span>
                     <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.4rem' }}>ELITE</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
                  <Link to="/staff/queue" className="nav-button" style={{ padding: '1.5rem', textAlign: 'center', display: 'block' }}>ESTATE QUEUE</Link>
                  <Link to="/staff/performance" className="nav-button" style={{ padding: '1.5rem', textAlign: 'center', display: 'block' }}>YIELD REVIEWS</Link>
               </div>
            </div>

            <div className="glass-card pulse-light" style={{ padding: '4rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '40px' }}>
                <Zap size={40} color="var(--gold)" style={{ marginBottom: '2.5rem' }} />
                <h4 className="serif" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>ARTISAN <span style={{ color: 'var(--gold)' }}>PROTOCOL</span></h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1.8 }}>Ensure ritual conclude times are synchronized. All doorstep sessions require real-time dispatch accreditation in the Mission Control terminal.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
