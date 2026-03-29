import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User as UserIcon, Mail, Phone, Heart, Save, History, Clock, Crown, Sparkles, Star, Shield, Layout, AlertCircle, CheckCircle, MessageCircle, X } from 'lucide-react';

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
            alert("PROFLE SYNCHRONIZED WITH THE ESTATE REGISTRY.");
        } catch (err) { 
            alert(err.response?.data?.detail || "Profile update failed."); 
        } finally { setLoading(false); }
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

    return (
        <div className="profile-page fade-in" style={{ padding: '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '8rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '3.5rem' }}>
                    <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--gold), #f9d976)', padding: '5px', boxShadow: '0 0 50px var(--gold-glow)' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '5px solid var(--bg-dark)' }}>
                            <UserIcon size={90} color="var(--gold)" />
                        </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#4caf50', width: '30px', height: '30px', borderRadius: '50%', border: '4px solid var(--bg-dark)' }}></div>
                </div>
                <h1 className="serif gradient-text" style={{ fontSize: '5rem', margin: 0, letterSpacing: '-2px' }}>{fullName || user?.username}</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem', letterSpacing: '4px' }}>
                    {user?.role?.toUpperCase()} | {user?.customer_category?.toUpperCase() || "ELITE"} MEMBER
                </p>
            </header>

            <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '5rem' }}>
                
                {/* 📝 IDENTITY MANAGEMENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <form className="glass-card" onSubmit={handleUpdateProfile} style={{ padding: '4rem', borderTop: '4px solid var(--gold)' }}>
                        <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>IDENTITY <span style={{ color: 'var(--gold)' }}>PROTOCOLS</span></h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
                            <div className="input-field">
                                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>USERNAME</label>
                                <div style={{ position: 'relative' }}>
                                    <UserIcon size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', color: 'var(--text-dim)', borderRadius: '15px' }} />
                                </div>
                            </div>
                            <div className="input-field">
                                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>FULL NAME</label>
                                <div style={{ position: 'relative' }}>
                                    <Sparkles size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                                </div>
                            </div>
                            <div className="input-field">
                                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>EMAIL ADDRESS</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                                </div>
                            </div>
                            <div className="input-field">
                                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>CONTACT PHONE</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))} required maxLength={10} style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                                </div>
                            </div>
                            <div className="input-field">
                                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '0.8rem' }}>GENDER IDENTITY</label>
                                <div style={{ position: 'relative' }}>
                                    <Heart size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px', appearance: 'none' }}>
                                        <option value="Male" style={{ background: 'var(--bg-dark)' }}>MALE</option>
                                        <option value="Female" style={{ background: 'var(--bg-dark)' }}>FEMALE</option>
                                        <option value="Other" style={{ background: 'var(--bg-dark)' }}>OTHER</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-gold" style={{ padding: '1.5rem 5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold', fontSize: '1rem' }}>
                            {loading ? <Clock className="spin" size={20} /> : <Save size={20} />} 
                            {loading ? "SYNCHRONIZING..." : "SAVE CHANGES"}
                        </button>
                    </form>

                    {/* 🕰️ RITUAL HISTORY */}
                    <div className="glass-card" style={{ padding: '4rem' }}>
                        <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>EXPERIENCE <span style={{ color: 'var(--gold)' }}>HISTORY</span></h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {history.length > 0 ? history.map(h => (
                                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '25px', border: h.status === 'completed' ? '1px solid var(--gold-glow)' : '1px solid var(--glass-border)' }}>
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ background: 'var(--gold-glow)', padding: '12px', borderRadius: '12px' }}><Layout size={24} color="var(--gold)" /></div>
                                        <div>
                                            <div className="serif" style={{ fontSize: '1.4rem' }}>Floor {h.floor} Session</div>
                                            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{new Date(h.booking_time).toLocaleDateString()} with {h.stylist_name}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '1px', marginTop: '5px' }}>TOKEN: CS-{h.id}-{new Date().getFullYear()}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '2px' }}>₹{h.price_paid}</div>
                                            <div style={{ fontSize: '0.75rem', color: h.status === 'completed' ? '#4caf50' : 'var(--gold)' }}>{h.status.toUpperCase()}</div>
                                        </div>
                                        {h.status === 'completed' && (
                                            <button onClick={() => { setSelectedBooking(h); setShowReviewModal(true); }} className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px' }}><MessageCircle size={14} /> RATE ARTISAN</button>
                                        )}
                                    </div>
                                </div>
                            )) : <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem' }}>No rituals recorded in the current cycle.</p>}
                        </div>
                    </div>
                </div>

                {/* 🎖️ MEMBERSHIP STATUS */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {/* Membership stuff ... */}
                </aside>
            </div>

            {/* 📝 REVIEW MODAL */}
            {showReviewModal && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-card" style={{ maxWidth: '600px', width: '95%', padding: '4rem', border: '1px solid var(--gold)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h3 className="serif" style={{ fontSize: '2.5rem' }}>ARTISAN <span style={{ color: 'var(--gold)' }}>FEEDBACK</span></h3>
                            <button onClick={() => setShowReviewModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={30} /></button>
                        </div>

                        <p style={{ color: 'var(--text-dim)', marginBottom: '3rem' }}>Your feedback for Floor 0{selectedBooking?.floor} session with {selectedBooking?.stylist_name}:</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <Star key={num} size={40} fill={num <= rating ? 'var(--gold)' : 'transparent'} color="var(--gold)" onClick={() => setRating(num)} style={{ cursor: 'pointer' }} />
                            ))}
                        </div>

                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." style={{ width: '100%', height: '150px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '2rem', color: 'white', fontSize: '1.1rem', marginBottom: '3rem', resize: 'none' }} />

                        <button onClick={handleSubmitReview} disabled={loading} className="btn-gold" style={{ width: '100%', padding: '1.5rem', borderRadius: '40px', fontWeight: 'bold' }}>
                            PUBLISH TO THE ESTATE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
