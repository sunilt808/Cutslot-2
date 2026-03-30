import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, Scissors, User as UserIcon, Shield, ChevronRight, CheckCircle2, AlertCircle, Sparkles, MapPin, Wallet, History, TrendingUp, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
   const { user, api } = useAuth();
   const [stats, setStats] = useState({ total_spent: 0, loyalty_points: 0 });
   const [bookings, setBookings] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showReviewModal, setShowReviewModal] = useState(false);
   const [selectedBooking, setSelectedBooking] = useState(null);
   const [rating, setRating] = useState(5);
   const [comment, setComment] = useState("");

   useEffect(() => {
      fetchDashboardData();
   }, [api]);

   const fetchDashboardData = async () => {
      setLoading(true);
      try {
         const [walletRes, bookingRes] = await Promise.all([
            api.get('/client/wallet'),
            api.get('/bookings/')
         ]);
         setStats(walletRes.data);
         setBookings(bookingRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
   };

   const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
         await api.post('/reviews/', {
            booking_id: selectedBooking.id,
            service_id: selectedBooking.service_id,
            worker_name: selectedBooking.stylist_name,
            rating,
            comment
         });
         alert("THANK YOU FOR YOUR FEEDBACK.");
         setShowReviewModal(false);
         setComment("");
         fetchDashboardData();
      } catch (err) { alert("Failed to submit feedback."); }
   };

   const upcoming = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

   return (
      <div className="client-dashboard fade-in-up">
         <header className="glass-card" style={{ padding: '3.5rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--gold)' }}>
            <div>
               <h1 className="serif gradient-text" style={{ fontSize: '4rem', margin: 0, letterSpacing: '-2px' }}>MY <span style={{ color: 'var(--text-cream)' }}>RESERVE</span></h1>
               <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.8rem' }}>Welcome back, {user?.full_name || user?.username}. Your elite grooming schedule is active.</p>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
               <div className="glass-card" style={{ padding: '1.5rem 2.5rem', textAlign: 'center', border: '1px solid var(--gold-glow)' }}>
                  <div style={{ color: 'var(--gold)', fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.loyalty_points}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: 'bold' }}>LOYALTY POINTS</div>
               </div>
            </div>
         </header>

         <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
            <Link to="/profile/appointments" className="glass-card hover-lift" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
               <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '15px' }}><Bookmark color="var(--gold)" /></div>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>MY APPOINTMENTS</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{upcoming.length} Active Sessions</div>
               </div>
            </Link>
            <Link to="/profile/revenue" className="glass-card hover-lift" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
               <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '15px' }}><TrendingUp color="var(--gold)" /></div>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>REVENUE LOGS</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>₹{stats.total_spent} Total Spent</div>
               </div>
            </Link>
            <Link to="/settings" className="glass-card hover-lift" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
               <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '15px' }}><UserIcon color="var(--gold)" /></div>
               <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>ELITE PROFILE</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Manage Credentials</div>
               </div>
            </Link>
         </div>

         <div className="dashboard-sections" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            <div className="glass-card" style={{ padding: '3rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                  <h2 className="serif" style={{ fontSize: '2.4rem', margin: 0 }}>UPCOMING <span style={{ color: 'var(--gold)' }}>SESSIONS</span></h2>
                  <Link to="/profile/appointments" style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 'bold' }}>VIEW ALL APPOINTMENTS <ChevronRight size={16} style={{ verticalAlign: 'middle' }} /></Link>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {upcoming.length === 0 ? (
                     <div style={{ textAlign: 'center', padding: '5rem', border: '1px dashed var(--glass-border)', borderRadius: '20px' }}>
                        <p style={{ color: 'var(--text-dim)' }}>No active protocols found. Ready for your next ritual?</p>
                        <Link to="/booking" className="btn-gold" style={{ padding: '1rem 3rem', display: 'inline-block', marginTop: '1.5rem' }}>BOOK NOW</Link>
                     </div>
                  ) : upcoming.slice(0, 3).map(b => (
                     <div key={b.id} className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                           <div style={{ height: '60px', width: '60px', background: 'rgba(212,175,55,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--gold)' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{new Date(b.booking_time).getDate()}</div>
                              <div style={{ fontSize: '0.6rem' }}>{new Date(b.booking_time).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                           </div>
                           <div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '1px' }}>FLOOR 0{b.floor} | {b.category.toUpperCase()}</div>
                              <div className="serif" style={{ fontSize: '1.4rem' }}>{b.stylist_name} Session</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Token ID: CS-{b.id}-{new Date().getFullYear()}</div>
                           </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                           <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{b.status.toUpperCase()}</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
               <div className="glass-card" style={{ padding: '3rem', border: '1px solid var(--gold-glow)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--gold)', marginBottom: '2rem' }}>
                     <Shield size={24} />
                     <h3 className="serif" style={{ fontSize: '1.8rem', margin: 0 }}>ESTATE STATUS</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Member Category</span>
                        <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{user?.customer_category?.toUpperCase() || "NORMAL"}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Active Plan</span>
                        <span style={{ color: 'var(--text-cream)' }}>{user?.subscription_plan || "Pay Per Use"}</span>
                     </div>
                     {user?.subscription_expiry && (
                        <div style={{ fontSize: '0.75rem', color: '#4caf50', textAlign: 'right' }}>Plan expires: {new Date(user.subscription_expiry).toLocaleDateString()}</div>
                     )}
                     <Link to="/settings" className="btn-gold" style={{ textAlign: 'center', padding: '1rem', fontSize: '0.8rem' }}>UPGRADE PROTOCOL</Link>
                  </div>
               </div>

               <div className="glass-card" style={{ padding: '3rem' }}>
                  <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>QUICK ACTIONS</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <Link to="/booking" className="btn-gold" style={{ padding: '1rem', fontSize: '0.8rem', textAlign: 'center' }}>NEW RESERVATION</Link>
                     <Link to="/reviews" className="btn-gold" style={{ padding: '1rem', fontSize: '0.8rem', textAlign: 'center', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}>LEAVE FEEDBACK</Link>
                  </div>
               </div>
            </div>
         </div>

         {/* 📝 REVIEW MODAL (Triggered from History) */}
         {showReviewModal && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 4, 8, 0.95)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <form onSubmit={handleReviewSubmit} className="glass-card fade-in" style={{ padding: '5rem', maxWidth: '600px', width: '90%', border: '2px solid var(--gold)' }}>
                  <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>GUEST <span style={{ color: 'var(--gold)' }}>FEEDBACK</span></h2>

                  <div style={{ marginBottom: '3rem' }}>
                     <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>SELECT RATING</label>
                     <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                           <button key={star} type="button" onClick={() => setRating(star)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', transform: rating >= star ? 'scale(1.3)' : 'scale(1)' }}>
                              <Sparkles size={35} color={rating >= star ? 'var(--gold)' : 'rgba(255,255,255,0.1)'} fill={rating >= star ? 'var(--gold)' : 'none'} />
                           </button>
                        ))}
                     </div>
                  </div>

                  <div style={{ marginBottom: '4rem' }}>
                     <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', marginBottom: '1.5rem' }}>GUEST COMMENT</label>
                     <textarea value={comment} onChange={(e) => setComment(e.target.value)} required className="glass-input" rows="5" style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} placeholder="Tell us about your ritual experience..."></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                     <button type="submit" className="btn-gold" style={{ flex: 1, padding: '1.5rem', borderRadius: '40px', fontWeight: 'bold' }}>SUBMIT REVIEW</button>
                     <button type="button" onClick={() => setShowReviewModal(false)} style={{ flex: 1, padding: '1.5rem', borderRadius: '40px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>CANCEL</button>
                  </div>
               </form>
            </div>
         )}
      </div>
   );
};

export default ClientDashboard;
