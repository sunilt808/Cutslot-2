import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Star, Wallet, Calendar, Settings, History, MessageSquare, Heart, Clock, Crown } from 'lucide-react';

const ClientDashboard = () => {
  const { user, api } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [wallet, setWallet] = useState({ total_spent: 0, loyalty_points: 0 });
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [api]);

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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addReview = async (bookingId, serviceId) => {
    const comment = prompt("Share your boutique experience:");
    const rating = parseInt(prompt("Elite Rating (1-5):"));
    if (!comment || isNaN(rating)) return;
    try {
      await api.post('/reviews/', { booking_id: bookingId, service_id: serviceId, rating, comment });
      alert("Review recorded.");
      fetchData();
    } catch (err) { alert("Failed."); }
  };

  return (
    <div className="client-dashboard-page fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--gold)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
             <span style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'var(--gold)', color: 'var(--bg-dark)', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2.5px' }}>{user?.customer_category?.toUpperCase() || 'NORMAL'}</span>
             <span style={{ color: 'var(--gold)', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>ELITE MEMBER</span>
          </div>
          <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>CLIENT <span style={{ color: 'var(--text-cream)' }}>PREFERENCE</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Your customized elite profile and spending statistics.</p>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '2.4rem', fontWeight: 'bold' }}>₹{wallet.total_spent}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>REVENUE TRACKING</div>
           </div>
           <div className="stat-sm">
              <div style={{ color: 'var(--gold)', fontSize: '2.4rem', fontWeight: 'bold' }}>{wallet.loyalty_points}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>LOYALTY POINTS</div>
           </div>
        </div>
      </header>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        <aside className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
           <button onClick={() => setActiveTab("overview")} className={`btn-gold ${activeTab === 'overview' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'overview' ? 'var(--gold)' : 'transparent', color: activeTab === 'overview' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><User size={18} /> OVERVIEW</button>
           <button onClick={() => setActiveTab("history")} className={`btn-gold ${activeTab === 'history' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'history' ? 'var(--gold)' : 'transparent', color: activeTab === 'history' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><History size={18} /> SESSIONS</button>
           <button onClick={() => setActiveTab("notifications")} className={`btn-gold ${activeTab === 'notifications' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'notifications' ? 'var(--gold)' : 'transparent', color: activeTab === 'notifications' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><Bell size={18} /> NOTARY</button>
           <button onClick={() => setActiveTab("subscriptions")} className={`btn-gold ${activeTab === 'subscriptions' ? 'active' : ''}`} style={{ width: '100%', background: activeTab === 'subscriptions' ? 'var(--gold)' : 'transparent', color: activeTab === 'subscriptions' ? 'var(--bg-dark)' : 'var(--text-cream)' }}><Crown size={18} /> ELITE SUBS</button>
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
                      <div className="serif" style={{ fontSize: '1.8rem', margin: '0.5rem 0' }}>{user?.loyalty_points || 0}</div>
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
             <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>SESSION LOGS</h3>
                {bookings.map(b => (
                  <div key={b.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ background: 'var(--gold-glow)', padding: '10px', borderRadius: '50%' }}><Clock size={20} color="var(--gold)" /></div>
                       <div>
                         <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }} className="serif">{b.stylist_name}</div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(b.booking_time).toLocaleDateString()} | Spent: ₹{b.price_paid}</div>
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      {b.status === 'completed' && (
                        <button onClick={() => addReview(b.id, b.service_id)} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                            <MessageSquare size={16} /> REVIEW
                        </button>
                      )}
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: b.status === 'completed' ? '#4caf50' : 'var(--gold)', border: '1px solid', padding: '0.5rem 1rem', borderRadius: '5px' }}>{b.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
             </div>
           )}

           {activeTab === 'notifications' && (
             <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <h3 className="serif" style={{ fontSize: '1.8rem' }}>NOTARY FEED</h3>
                   <button onClick={async () => { if(confirm("Clear notifications?")) { await api.delete('/notifications/clear'); fetchData(); } }} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.7rem' }}>CLEAR ALL</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   {notifications.length === 0 ? <p style={{ color: 'var(--text-dim)' }}>No notifications found.</p> : notifications.map(n => (
                     <div key={n.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: n.is_read ? 'transparent' : 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                        <div style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{n.message}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(n.created_at).toLocaleString()}</div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'subscriptions' && (
             <div className="fade-in">
                <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>ELITE ACCESS RITUALS</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                   <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
                      <div className="serif" style={{ fontSize: '1.6rem', color: 'var(--gold)' }}>Gold Monthly</div>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: '1.6' }}>Quarterly luxury styling starting at ₹5500. Includes Floor 1 & 2 priority access.</p>
                      <button className="btn-gold" style={{ width: '100%', marginTop: '1.5rem' }}>RENEW ACCESS</button>
                   </div>
                   <div className="glass-card" style={{ padding: '2.5rem', border: '2px solid var(--gold)', boxShadow: '0 0 30px var(--gold-glow)' }}>
                      <Crown color="var(--gold)" size={24} />
                      <div className="serif" style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>Platinum Yearly</div>
                      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: '1.6' }}>Unrestricted atelier access. Private Artisans and VIP Parking Protocols for ₹20,000/yr.</p>
                      <button className="btn-gold" style={{ width: '100%', marginTop: '1.5rem' }}>ENROLLED</button>
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
