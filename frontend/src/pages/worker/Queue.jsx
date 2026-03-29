import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, Check, X, User, Scissors, Briefcase, Filter } from 'lucide-react';

const WorkerQueue = () => {
    const { user, api } = useAuth();
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDay, setFilterDay] = useState("all");

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
        try {
            await api.put(`/bookings/${id}/status`, { status });
            fetchQueue();
        } catch (err) { alert("Action failed."); }
    };

    // Helper to group by date
    const groupedQueue = queue.reduce((acc, b) => {
        const dateStr = new Date(b.booking_time).toLocaleDateString();
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(b);
        return acc;
    }, {});

    return (
        <div className="worker-queue-page fade-in">
            <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid var(--gold)' }}>
                 <div>
                    <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>QUEUE <span style={{ color: 'var(--text-cream)' }}>MANAGEMENT</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Today's +Next 3 Days appointments for Floor {user?.assigned_floor}.</p>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={fetchQueue} className="btn-gold" style={{ padding: '0.8rem 1.5rem' }}><Clock size={16} /> REFRESH</button>
                 </div>
            </header>

            <div className="queue-container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {Object.keys(groupedQueue).length === 0 ? (
                    <div className="glass-card" style={{ padding: '5rem', textAlign: 'center' }}>
                        <Briefcase size={60} color="var(--gold)" style={{ opacity: 0.2, marginBottom: '2rem' }} />
                        <h2 className="serif" style={{ color: 'var(--text-dim)' }}>THE ATELIER IS QUIET</h2>
                        <p style={{ color: 'var(--text-dim)' }}>No upcoming elite sessions scheduled for the next 72 hours.</p>
                    </div>
                ) : (
                    Object.keys(groupedQueue).map((date, idx) => (
                        <div key={idx} className="date-section">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <Calendar size={20} color="var(--gold)" />
                                <h3 className="serif" style={{ fontSize: '1.8rem', color: 'var(--gold)', letterSpacing: '2px' }}>{date === new Date().toLocaleDateString() ? "TODAY" : date}</h3>
                                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--gold-glow), transparent)' }}></div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                {groupedQueue[date].map(b => (
                                    <div key={b.id} className="glass-card" style={{ border: b.status === 'confirmed' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', padding: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                            <div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                <div className="serif" style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>Protocol #{b.id}</div>
                                            </div>
                                            <div style={{ padding: '0.4rem 1rem', background: b.status === 'confirmed' ? 'var(--gold)' : 'rgba(255,255,255,0.05)', color: b.status === 'confirmed' ? 'var(--bg-dark)' : 'var(--text-dim)', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 'bold' }}>{b.status.toUpperCase()}</div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', color: 'var(--text-cream)' }}>
                                            <User size={18} color="var(--gold)" />
                                            <span>Elite Client ID: {b.user_id}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {b.status === 'pending' && (
                                                <button onClick={() => updateStatus(b.id, 'confirmed')} className="btn-gold" style={{ background: '#4caf50', border: 'none', color: 'white', flex: 1 }}><Check size={18} /> CONFIRM</button>
                                            )}
                                            {b.status === 'confirmed' && (
                                                <button onClick={() => updateStatus(b.id, 'completed')} className="btn-gold" style={{ flex: 1 }}><Scissors size={18} /> COMPLETE</button>
                                            )}
                                            <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ padding: '0.8rem', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '10px' }}><X size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WorkerQueue;
