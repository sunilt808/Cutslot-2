import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Mail, Phone, Heart, Save, History, Clock, Crown, Sparkles, Star, Layout, CheckCircle, MessageCircle, X, Calendar, Zap, Shield } from 'lucide-react';

const ProfileSettings = () => {
    const { user, api, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("Male");
    const [email, setEmail] = useState("");
    
    const [history, setHistory] = useState([]);
    const [plans, setPlans] = useState([]);

    // Review State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setFullName(user.full_name || "");
            setPhone(user.phone || "");
            setGender(user.gender || "Male");
            setEmail(user.email || "");
            fetchHistory();
            fetchPlans();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/bookings/');
            setHistory(res.data);
        } catch (err) { console.error("History fetch error:", err); }
    };

    const fetchPlans = async () => {
        try {
            const res = await api.get('/services/?floor=4');
            setPlans(res.data);
        } catch(err) { console.error("Plans fetch error:", err); }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/users/me', { 
                username, 
                full_name: fullName, 
                phone, 
                gender,
                email
            });
            await refreshUser();
            alert("PROFILE SYNCHRONIZED WITH THE ESTATE REGISTRY.");
        } catch (err) { 
            alert(err.response?.data?.detail || "Profile update failed."); 
        } finally { setLoading(false); }
    };

    const calculateDaysLeft = (expiryDate) => {
        if (!expiryDate) return 0;
        const diff = new Date(expiryDate) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const handleSubmitReview = async () => {
        if (!comment.trim()) return alert("Please share some ritual feedback.");
        setLoading(true);
        try {
            await api.post('/reviews/', { 
                booking_id: selectedBooking.id, 
                service_id: selectedBooking.service_id,
                rating, 
                comment 
            });
            setShowReviewModal(false);
            setComment("");
            alert("YOUR FEEDBACK HAS BEEN ARCHIVED PUBLICLY.");
        } catch (err) { alert("Error saving feedback."); }
        finally { setLoading(false); }
    };

    const handleUpgrade = async (serviceId) => {
        if (!confirm("Authorize elite membership upgrade?")) return;
        try {
            await api.post('/subscribe/', { service_id: serviceId });
            await refreshUser();
            alert("MEMBERSHIP LEVEL ELEVATED.");
        } catch (err) { alert("Upgrade declined."); }
    };

    if (!user) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem', color: 'var(--gold)' }}>
            <div className="shimmer" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
        </div>
    );

    const daysLeft = calculateDaysLeft(user.subscription_expiry);

    return (
        <div className="profile-page fade-in" style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <header style={{ marginBottom: '8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '3.5rem' }}>
                    <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--gold), #f9d976)', padding: '5px', boxShadow: '0 0 70px rgba(212,175,55,0.2)' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '8px solid var(--bg-dark)' }}>
                            <UserIcon size={120} color="var(--gold)" />
                        </div>
                    </div>
                </div>
                <h1 className="serif gradient-text" style={{ fontSize: '5.5rem', margin: 0, letterSpacing: '-3px' }}>{fullName || user?.username}</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem', letterSpacing: '6px', fontWeight: 'bold' }}>
                    {user?.role?.toUpperCase()} | {user?.customer_category?.toUpperCase() || "ELITE"} ESTATE MEMBER
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '20px' }}>
                    <span style={{ padding: '1rem 2.5rem', background: 'var(--gold-glow)', color: 'var(--gold)', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem' }}>ID: #{user.id}</span>
                </div>
            </header>

            <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', width: '100%', alignItems: 'start' }}>
                
                {/* 📝 IDENTITY MANAGEMENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    <form className="glass-card" onSubmit={handleUpdateProfile} style={{ padding: '5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', borderRadius: '40px' }}>
                        <h3 className="serif" style={{ fontSize: '3rem', marginBottom: '4rem' }}>IDENTITY <span style={{ color: 'var(--gold)' }}>PROTOCOLS</span></h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
                            <div className="input-field">
                                <label style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>USERNAME</label>
                                <input type="text" value={username} disabled style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', color: 'var(--text-dim)', borderRadius: '20px' }} />
                            </div>
                            <div className="input-field">
                                <label style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>FULL NAME</label>
                                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--gold)', color: 'var(--text-cream)', borderRadius: '20px' }} />
                            </div>
                            <div className="input-field">
                                <label style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>EMAIL ADDRESS</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '20px' }} />
                            </div>
                            <div className="input-field">
                                <label style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>CONTACT PHONE</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))} required maxLength={10} style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '20px' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', padding: '1.8rem', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {loading ? <Clock className="spin" size={24} /> : <Save size={24} />} 
                            {loading ? "SYNCHRONIZING..." : "SYNCHRONIZE CREDENTIALS"}
                        </button>
                    </form>

                    {/* 🕰️ RITUAL HISTORY */}
                    <div className="glass-card" style={{ padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '40px', border: '1px solid var(--glass-border)' }}>
                        <h3 className="serif" style={{ fontSize: '3rem', marginBottom: '4rem' }}>EXPERIENCE <span style={{ color: 'var(--gold)' }}>HISTORY</span></h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {history.length > 0 ? history.map(h => (
                                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
                                    <div>
                                        <div className="serif" style={{ fontSize: '1.8rem' }}>{h.status === 'completed' ? 'Ritual Concluded' : 'Ritual Scheduled'}</div>
                                        <div style={{ color: 'var(--text-dim)', fontSize: '1rem', marginTop: '10px' }}>{new Date(h.booking_time).toLocaleDateString()} • {h.stylist_name}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '1.4rem' }}>₹{h.price_paid}</div>
                                        <div style={{ fontSize: '0.9rem', color: h.status === 'completed' ? '#4caf50' : '#ff9800', marginTop: '5px' }}>{h.status.toUpperCase()}</div>
                                    </div>
                                </div>
                            )) : <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem' }}>No past rituals archived.</p>}
                        </div>
                    </div>
                </div>

                {/* 🎖️ MEMBERSHIP STATUS (CLOCK + CALENDAR) */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    <div className="glass-card" style={{ padding: '5rem', border: '2px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.1), transparent)', borderRadius: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                            <Crown size={50} color="var(--gold)" />
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--gold)', letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>TIER STATUS</div>
                                <h4 className="serif" style={{ fontSize: '3rem', margin: 0 }}>{user.subscription_plan || "GUEST"}</h4>
                            </div>
                        </div>

                        {/* ⏱️ EXPIRY CLOCK */}
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem' }}>
                            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '3rem', borderRadius: '30px', textAlign: 'center', border: '1px solid var(--gold-glow)' }}>
                                <div style={{ fontSize: '4.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>{daysLeft}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>DAYS REMAINING</div>
                            </div>
                            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '3rem', borderRadius: '30px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                                <Clock size={30} color="var(--gold)" style={{ margin: '0 auto 1.5rem' }} />
                                <div style={{ fontSize: '1rem', color: 'white' }}>{user.subscription_expiry ? new Date(user.subscription_expiry).toLocaleDateString() : "N/A"}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>EXPIRY CALENDAR</div>
                            </div>
                        </div>

                        {/* RENEWAL / BUY OPTIONS */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                             {plans.slice(0,3).map(p => (
                                 <button key={p.id} onClick={() => handleUpgrade(p.id)} className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', textAlign: 'left', width: '100%' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'white' }}>{p.name.toUpperCase()}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Renew Ritual Access</div>
                                    </div>
                                    <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>₹{p.price}</div>
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '4rem', background: 'rgba(255,255,255,0.01)', borderRadius: '40px', border: '1px solid var(--glass-border)' }}>
                        <Calendar size={35} color="var(--gold)" style={{ marginBottom: '2rem' }} />
                        <h4 className="serif" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>ELITE <span style={{ color: 'var(--gold)' }}>PRIVILEGES</span></h4>
                        <ul style={{ padding: 0, listStyle: 'none', color: 'var(--text-dim)', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><CheckCircle size={18} color="var(--gold)" /> Priority floor scheduling</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><CheckCircle size={18} color="var(--gold)" /> Complimentary ritual beverages</li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><CheckCircle size={18} color="var(--gold)" /> Doorstep service eligibility</li>
                        </ul>
                    </div>
                </aside>
            </div>

            {/* 📝 REVIEW MODAL */}
            {showReviewModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-card" style={{ maxWidth: '700px', width: '95%', padding: '5rem', border: '1px solid var(--gold)', borderRadius: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                            <h3 className="serif" style={{ fontSize: '3.5rem' }}>ARTISAN <span style={{ color: 'var(--gold)' }}>VETTING</span></h3>
                            <button onClick={() => setShowReviewModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={40} /></button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '4rem' }}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <Star key={num} size={50} fill={num <= rating ? 'var(--gold)' : 'transparent'} color="var(--gold)" onClick={() => setRating(num)} style={{ cursor: 'pointer' }} />
                            ))}
                        </div>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." style={{ width: '100%', height: '200px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '30px', padding: '2.5rem', color: 'white', fontSize: '1.2rem', marginBottom: '4rem', resize: 'none' }} />
                        <button onClick={handleSubmitReview} disabled={loading} className="btn-gold" style={{ width: '100%', padding: '2rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            PUBLISH ARCHIVE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
