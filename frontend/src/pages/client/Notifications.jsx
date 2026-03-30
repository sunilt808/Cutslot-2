import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Clock, Info, Shield, Check, Calendar, ArrowRight, Zap, Star } from 'lucide-react';

const Notifications = () => {
    const { api } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, [api]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const getIcon = (type) => {
        if (type.includes('transit')) return <Zap size={20} color="var(--gold)" />;
        if (type.includes('reminder')) return <Clock size={20} color="var(--gold)" />;
        if (type.includes('alert')) return <Shield size={20} color="var(--gold)" />;
        return <Bell size={20} color="var(--gold)" />;
    };

    return (
        <div className="notifications-page fade-in" style={{ padding: '2rem' }}>
            <header className="glass-card" style={{ padding: '4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at top left, rgba(212,175,55,0.05), transparent)' }}>
                 <div>
                    <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>ESTATE <span style={{ color: 'var(--text-cream)' }}>ALERTS</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Personalized ritual reminders and real-time logistics from the atelier.</p>
                 </div>
                 <button onClick={fetchNotifications} className="btn-gold" style={{ padding: '1.2rem 2.5rem', fontWeight: 'bold' }}><Clock size={16} /> REFRESH</button>
            </header>

            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {notifications.length === 0 && !loading ? (
                    <div className="glass-card" style={{ padding: '8rem', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
                        <Bell size={60} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                        <h2 className="serif" style={{ fontSize: '2.5rem', color: 'var(--text-dim)' }}>STILL WATERS</h2>
                        <p style={{ color: 'var(--text-dim)' }}>No active alerts or upcoming ritual notifications at this moment.</p>
                    </div>
                ) : (
                    notifications.map((n, i) => (
                        <div key={n.id} className="glass-card hover-lift" style={{ padding: '2.5rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-start', borderLeft: '4px solid var(--gold)', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '15px' }}>{getIcon(n.type)}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>{n.type.replace('_', ' ').toUpperCase()}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(n.created_at).toLocaleString()}</span>
                                </div>
                                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-cream)', marginBottom: '1rem', lineHeight: 1.4 }}>{n.message}</h3>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '1.5rem' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 'bold', border: '1px solid var(--glass-border)', padding: '4px 10px', borderRadius: '5px' }}>RITUAL #{n.booking_id}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#4caf50', fontWeight: 'bold' }}>DELIVERED via ESTATE APP</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer style={{ marginTop: '8rem', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '40px' }}>
                <Shield size={40} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
                <h4 className="serif" style={{ fontSize: '2rem' }}>LUXURY <span style={{ color: 'var(--gold)' }}>PRIVACY</span></h4>
                <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '1rem auto' }}>All estate notifications are encrypted and respect your designated quiet hours (9 PM - 8 AM).</p>
            </footer>
        </div>
    );
};

export default Notifications;
