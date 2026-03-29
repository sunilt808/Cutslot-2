import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, Check, X, User, Scissors, Briefcase, Filter, ArrowRight, Shield } from 'lucide-react';

const WorkerQueue = () => {
    const { user, api } = useAuth();
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
    }, [api]);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const res = await api.get('/worker/queue');
            setQueue(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        let newTime = null;
        if (status === 'rescheduled') {
            const resp = prompt("Enter new time (YYYY-MM-DD HH:MM):", new Date().toISOString().slice(0, 16).replace('T', ' '));
            if (!resp) return;
            newTime = resp.replace(' ', 'T') + ':00';
        }
        try {
            await api.put(`/bookings/${id}/status`, { status, new_time: newTime });
            fetchQueue();
            alert("Booking updated successfully.");
        } catch (err) { alert("Failed to update booking."); }
    };

    // Group by date
    const groupedQueue = queue.reduce((acc, b) => {
        const dateStr = new Date(b.booking_time).toLocaleDateString();
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(b);
        return acc;
    }, {});

    return (
        <div className="worker-queue-page fade-in" style={{ padding: '2rem' }}>
            <header className="glass-card" style={{ padding: '5rem 4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid var(--gold)', background: 'radial-gradient(circle at top, rgba(212,175,55,0.05), transparent)' }}>
                 <div>
                    <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>MY <span style={{ color: 'var(--text-cream)' }}>QUEUE</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem' }}>Active appointments and upcoming bookings for you on Floor 0{user?.assigned_floor}.</p>
                 </div>
                 <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <button onClick={fetchQueue} className="btn-gold" style={{ padding: '1.2rem 2.5rem', fontWeight: 'bold' }}><Clock size={16} /> REFRESH LIST</button>
                    <div className="glass-card" style={{ padding: '1rem 2rem', border: '1px solid var(--gold)', color: 'var(--gold)', fontWeight: 'bold', fontSize: '0.8rem' }}>ASSIGNED FLOOR: 0{user?.assigned_floor}</div>
                 </div>
            </header>

            <div className="queue-container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '1400px', margin: '0 auto' }}>
                {Object.keys(groupedQueue).length === 0 && !loading ? (
                    <div className="glass-card" style={{ padding: '8rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--glass-border)' }}>
                        <Briefcase size={80} color="var(--gold)" style={{ opacity: 0.1, marginBottom: '2.5rem' }} />
                        <h2 className="serif" style={{ fontSize: '3rem', color: 'var(--text-dim)' }}>STILL QUEUE</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>No upcoming sessions assigned to your profile for the next 72 hours.</p>
                    </div>
                ) : (
                    Object.keys(groupedQueue).sort((a,b) => new Date(a) - new Date(b)).map((date, idx) => (
                        <div key={idx} className="date-section fade-in">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
                                <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '15px' }}><Calendar size={24} color="var(--gold)" /></div>
                                <h3 className="serif" style={{ fontSize: '2.5rem', color: 'var(--gold)', letterSpacing: '2px' }}>{date === new Date().toLocaleDateString() ? "TODAY'S SCHEDULE" : date.toUpperCase()}</h3>
                                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--gold-glow), transparent)' }}></div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2.5rem' }}>
                                {groupedQueue[date].sort((a,b) => new Date(a.booking_time) - new Date(b.booking_time)).map(b => (
                                    <div key={b.id} className="glass-card hover-lift" style={{ border: b.status === 'confirmed' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                                        {b.status === 'confirmed' && <div style={{ position: 'absolute', top: '1.5rem', right: '-3rem', background: 'var(--gold)', color: 'black', padding: '0.5rem 4rem', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.7rem' }}>CONFIRMED</div>}
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                <div style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '1px' }}>BOOKING #{b.id}</div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '3rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px' }}>
                                            <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '50%' }}><User size={30} color="var(--gold)" /></div>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '5px' }}>GUEST NAME</div>
                                                <div className="serif" style={{ fontSize: '1.8rem' }}>{b.user_name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '1px', marginTop: '5px' }}>TOKEN: CS-{b.id}-{new Date().getFullYear()}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {b.status === 'pending' && (
                                                <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-gold" style={{ background: '#4caf50', border: 'none', color: 'white', flex: 1, padding: '1.2rem', fontWeight: 'bold', borderRadius: '15px' }}><Check size={18} /> CONFIRM</button>
                                            )}
                                            {b.status === 'confirmed' && (
                                                <button onClick={() => updateStatus(b.id, 'completed')} className="btn-gold" style={{ flex: 2, padding: '1.2rem', fontWeight: 'bold', borderRadius: '15px' }}><Scissors size={18} /> MARK AS DONE</button>
                                            )}
                                            <button onClick={() => updateStatus(b.id, 'absent')} style={{ flex: 1, padding: '1.2rem', background: 'transparent', border: '1px solid var(--text-dim)', color: 'var(--text-dim)', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>ABSENT</button>
                                            <button onClick={() => updateStatus(b.id, 'rescheduled')} style={{ flex: 1, padding: '1.2rem', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>MOVE</button>
                                            <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ padding: '1.2rem', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '15px' }} title="Cancel Booking"><X size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer style={{ marginTop: '6rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <Shield size={16} color="var(--gold)" />
                    <span style={{ fontSize: '0.75rem', letterSpacing: '3px', fontWeight: 'bold' }}>PERSONAL WORKER TERMINAL V2.4</span>
                </div>
            </footer>
        </div>
    );
};

export default WorkerQueue;
