import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, MessageSquare, User, Calendar, Sparkles, Send } from 'lucide-react';

const Reviews = () => {
    const { user, api } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [newWorkerName, setNewWorkerName] = useState("");
    const [pastWorkers, setPastWorkers] = useState([]);
    const [stats, setStats] = useState({ average: 0, total: 0 });

    useEffect(() => {
        fetchReviews();
        if (user && user.role === 'customer') {
            api.get('/bookings/').then(res => {
                const completed = res.data.filter(b => b.status === 'completed' && b.stylist_name);
                const uniqueWorkers = [...new Set(completed.map(b => b.stylist_name))];
                setPastWorkers(uniqueWorkers);
                if (uniqueWorkers.length > 0) setNewWorkerName(uniqueWorkers[0]);
            }).catch(err => console.error("Could not fetch past bookings", err));
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews/');
            setReviews(res.data);
            const total = res.data.length;
            const avg = total > 0 ? res.data.reduce((sum, r) => sum + r.rating, 0) / total : 5;
            setStats({ average: avg.toFixed(1), total });
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to share your elite feedback.");
            return;
        }
        if (!newWorkerName.trim()) {
            alert("Please enter the artisan's name.");
            return;
        }
        try {
            await api.post('/reviews/', {
                worker_name: newWorkerName,
                rating: newRating,
                comment: newComment
            });
            setNewComment("");
            setNewWorkerName("");
            setNewRating(5);
            fetchReviews();
            alert("Thank you! Your feedback has been synchronized with the CUTSLOT database.");
        } catch(err) { alert(err.response?.data?.detail || "Error submitting review. Please try again."); }
    };

    return (
        <div className="reviews-page fade-in" style={{ padding: '4rem 2rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', marginBottom: '1.5rem' }}>ELITE <span style={{ color: 'var(--text-cream)' }}>TESTIMONIALS</span></h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto' }}>Authentic feedback from our community of luxury connoisseurs.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {/* STATS CARD */}
                    <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                        <div className="serif" style={{ fontSize: '5rem', color: 'var(--gold)', marginBottom: '1rem' }}>{stats.average}</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '1.5rem' }}>
                            {[1,2,3,4,5].map(i => <Star key={i} size={24} fill={i <= Math.round(stats.average) ? "var(--gold)" : "transparent"} color="var(--gold)" />)}
                        </div>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', letterSpacing: '2px' }}>AVERAGE SATISFACTION</p>
                        <div style={{ marginTop: '2.5rem', fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 'bold' }}>BASED ON {stats.total} PROTOCOLS</div>
                    </div>

                    {/* NEW REVIEW FORM */}
                    {user && user.role === 'customer' && (
                        <div className="glass-card" style={{ padding: '4rem' }}>
                            <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>SHARE YOUR <span style={{ color: 'var(--gold)' }}>EXPERIENCE</span></h3>
                            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', marginBottom: '1rem' }}>SELECT ARTISAN</label>
                                    {pastWorkers.length > 0 ? (
                                        <select
                                            value={newWorkerName}
                                            onChange={(e) => setNewWorkerName(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }}
                                        >
                                            <option value="" disabled>Choose an artisan...</option>
                                            {pastWorkers.map(w => <option key={w} value={w}>{w}</option>)}
                                        </select>
                                    ) : (
                                        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                                            You must complete a ritual before archiving elite feedback.
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', marginBottom: '1rem' }}>RATING</label>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        {[1,2,3,4,5].map(i => (
                                            <Star 
                                                key={i} 
                                                size={32} 
                                                style={{ cursor: 'pointer' }} 
                                                onClick={() => setNewRating(i)}
                                                fill={i <= newRating ? "var(--gold)" : "transparent"} 
                                                color="var(--gold)" 
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', marginBottom: '1rem' }}>COMMENTARY</label>
                                    <textarea 
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Describe your ritual..." 
                                        required
                                        style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px', height: '150px', resize: 'none' }}
                                    />
                                </div>
                                <button type="submit" disabled={pastWorkers.length === 0} className="btn-gold" style={{ padding: '1.2rem', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', fontWeight: 'bold', opacity: pastWorkers.length === 0 ? 0.5 : 1 }}>
                                    <Send size={18} /> SUBMIT TESTIMONIAL
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* REVIEWS FEED */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {loading ? (
                        [1,2,3].map(i => <div key={i} className="shimmer" style={{ height: '200px', borderRadius: '30px' }}></div>)
                    ) : reviews.length > 0 ? (
                        reviews.map(r => (
                            <div key={r.id} className="glass-card" style={{ padding: '3.5rem', borderLeft: '4px solid var(--gold)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ background: 'var(--gold-glow)', padding: '12px', borderRadius: '12px' }}>
                                            <User size={24} color="var(--gold)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-cream)' }}>{r.user_name || `ELITE MEMBER #${r.user_id}`}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>[{r.service_category?.toUpperCase() || "ELITE"}] {r.service_name || "Luxury Ritual"}</span> by <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{r.worker_name}</span> • {new Date(r.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= r.rating ? "var(--gold)" : "transparent"} color="var(--gold)" />)}
                                    </div>
                                </div>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-cream)', fontStyle: 'italic', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px' }}>
                                    "{r.comment}"
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card" style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                            <MessageSquare size={60} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                            <h3 className="serif" style={{ fontSize: '2rem' }}>NO FEEDBACK YET</h3>
                            <p>Be the first to share your elite experience.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
