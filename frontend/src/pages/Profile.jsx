import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Star, Wallet, Calendar, Settings, History, MessageSquare, Heart } from 'lucide-react';

const ClientDashboard = () => {
  const { user, api } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [wallet, setWallet] = useState({ total_spent: 0, loyalty_points: 0 });
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [walletRes, notifRes, bookingRes] = await Promise.all([
          api.get('/client/wallet'),
          api.get('/notifications/'),
          api.get('/bookings/')
        ]);
        setWallet(walletRes.data);
        setNotifications(notifRes.data);
        setBookings(bookingRes.data);
      } catch (err) {
        console.error("Error fetching client data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const addReview = async (bookingId, serviceId) => {
    const comment = prompt("Please share your boutique experience:");
    const rating = parseInt(prompt("Elite Rating (1-5):"));
    if (!comment || isNaN(rating)) return;
    try {
      await api.post('/reviews/', { booking_id: bookingId, service_id: serviceId, rating, comment });
      alert("Professional review recorded.");
    } catch (err) {
      alert("Failed to record review.");
    }
  };

  return (
    <div className="client-dashboard fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--gold)' }}>
        <div>
          <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>CLIENT <span style={{ color: 'var(--text-cream)' }}>PREFERENCE</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Your customized elite profile and spending statistics.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>ACCOUNT STATUS</div>
           <div className="serif" style={{ fontSize: '1.8rem' }}>{user.loyalty_points > 1000 ? "PLATINUM" : "GOLD"}</div>
        </div>
      </header>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
        <aside className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <button onClick={() => setActiveTab("overview")} className={`btn-gold ${activeTab === 'overview' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'overview' ? 'var(--gold)' : 'transparent', color: activeTab === 'overview' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><User size={18} /> OVERVIEW</button>
           <button onClick={() => setActiveTab("history")} className={`btn-gold ${activeTab === 'history' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'history' ? 'var(--gold)' : 'transparent', color: activeTab === 'history' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><History size={18} /> SESSIONS</button>
           <button onClick={() => setActiveTab("notifications")} className={`btn-gold ${activeTab === 'notifications' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'notifications' ? 'var(--gold)' : 'transparent', color: activeTab === 'notifications' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><Bell size={18} /> NOTARY</button>
           <button onClick={() => setActiveTab("settings")} className={`btn-gold ${activeTab === 'settings' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'settings' ? 'var(--gold)' : 'transparent', color: activeTab === 'settings' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><Settings size={18} /> THEMES</button>
        </aside>

        <main className="glass-card" style={{ padding: '3rem' }}>
           {activeTab === 'overview' && (
             <div className="fade-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                   <div className="stat-box" style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '15px', textAlign: 'center' }}>
                      <Wallet color="var(--gold)" size={24} />
                      <div className="serif" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>₹{wallet.total_spent}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>EXPENDITURE</div>
                   </div>
                   <div className="stat-box" style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '15px', textAlign: 'center' }}>
                      <Heart color="var(--gold)" size={24} />
                      <div className="serif" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>{user.loyalty_points}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>POINTS EARNED</div>
                   </div>
                   <div className="stat-box" style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '15px', textAlign: 'center' }}>
                      <Star color="var(--gold)" size={24} />
                      <div className="serif" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>{bookings.length}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>SESSIONS COMPLETED</div>
                   </div>
                </div>

                <h3 className="serif" style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>UPCOMING EXPERIENCE</h3>
                {bookings.filter(b => b.status === 'confirmed').length === 0 ? (
                  <p style={{ color: 'var(--text-dim)' }}>No upcoming sessions scheduled.</p>
                ) : (
                  bookings.filter(b => b.status === 'confirmed').slice(0, 1).map(b => (
                    <div className="glass-card" key={b.id} style={{ border: '2px solid var(--gold)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div className="serif" style={{ fontSize: '1.5rem' }}>{b.stylist_name} Session</div>
                          <div style={{ color: 'var(--text-dim)' }}>Floor {b.floor} | {new Date(b.booking_time).toLocaleString()}</div>
                       </div>
                       <div style={{ padding: '0.8rem 1.5rem', background: 'var(--gold)', color: 'var(--bg-dark)', borderRadius: '10px', fontWeight: 'bold' }}>PREPARING</div>
                    </div>
                  ))
                )}
             </div>
           )}

           {activeTab === 'history' && (
             <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>SESSION LOGS</h3>
                {bookings.map(b => (
                  <div key={b.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                       <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{b.stylist_name}</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(b.booking_time).toLocaleDateString()} | Spent: ₹{b.price_paid}</div>
                    </div>
                    {b.status === 'completed' && (
                       <button onClick={() => addReview(b.id, b.service_id)} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                          <MessageSquare size={16} /> REVIEW
                       </button>
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: b.status === 'completed' ? 'var(--gold)' : 'var(--text-dim)' }}>{b.status.toUpperCase()}</span>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'notifications' && (
             <div className="fade-in">
                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>NOTARY FEED</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {notifications.map(n => (
                     <div key={n.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: n.is_read ? 'transparent' : 'rgba(212,175,55,0.03)' }}>
                        <div style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{n.message}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(n.created_at).toLocaleString()}</div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'settings' && (
             <div className="fade-in">
                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>ATELIER THEMES</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                   <div style={{ padding: '2rem', border: '2px solid var(--gold)', borderRadius: '15px', textAlign: 'center' }}>
                      <div className="serif" style={{ fontSize: '1.3rem' }}>ANTIGRAVITY LUXE</div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>Current Selection</p>
                   </div>
                   <div style={{ padding: '2rem', border: '1px solid var(--glass-border)', borderRadius: '15px', textAlign: 'center', opacity: 0.4 }}>
                      <div className="serif" style={{ fontSize: '1.3rem' }}>PLATINUM MINIMAL</div>
                      <p style={{ fontSize: '0.75rem' }}>Requires Platinum Tier</p>
                   </div>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
