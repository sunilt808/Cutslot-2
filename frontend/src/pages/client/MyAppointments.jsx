import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Calendar, Scissors, User as UserIcon, Shield, ChevronRight, CheckCircle2, AlertCircle, Sparkles, MapPin, Wallet, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAppointments = () => {
    const { api, user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, [api]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/bookings/');
            setAppointments(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const upcoming = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed')
        .sort((a, b) => new Date(a.booking_time) - new Date(b.booking_time));
    const past = appointments.filter(a => a.status !== 'pending' && a.status !== 'confirmed')
        .sort((a, b) => new Date(b.booking_time) - new Date(a.booking_time));

    const AppointmentCard = ({ b, isPast = false }) => (
        <div className="glass-card hover-lift fade-in" style={{ padding: '3rem', border: b.status === 'confirmed' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)', position: 'relative', overflow: 'hidden' }}>

            {/* 💎 ELITE TOKEN VISUAL */}
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem 2rem', background: b.status === 'confirmed' ? 'var(--gold)' : 'rgba(255,255,255,0.05)', color: b.status === 'confirmed' ? 'black' : 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 'bold', borderBottomLeftRadius: '20px' }}>
                ACCESS TOKEN: CS-{b.id}-{new Date().getFullYear()}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                <div style={{ borderRight: '1px solid var(--glass-border)', paddingRight: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>{new Date(b.booking_time).getDate()}</div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '3px' }}>{new Date(b.booking_time).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                    <div style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>{new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '5px' }}>{b.category.toUpperCase()} SESSION</div>
                            <h3 className="serif" style={{ fontSize: '2.4rem', margin: 0 }}>RITUAL #{b.id}</h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-cream)' }}>{b.status.toUpperCase()}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Floor 0{b.floor}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Scissors size={18} color="var(--gold)" />
                            <span style={{ fontSize: '0.9rem' }}>Artisan: <span style={{ fontWeight: 'bold' }}>{b.stylist_name}</span></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle2 size={18} color="#4caf50" />
                            <span style={{ fontSize: '0.9rem' }}>Priority: {user?.subscription_plan ? "Platinum" : "Standard"} Protocols</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                        {!isPast && (
                            <button className="btn-gold" style={{ flex: 1, padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>VIEW FULL TOKEN</button>
                        )}
                        <Link to="/services" style={{ flex: 1 }}>
                            <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>MODIFY</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="my-appointments-page fade-in-up" style={{ padding: '2rem' }}>
            <header className="glass-card" style={{ padding: '5rem 4rem', marginBottom: '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at bottom right, rgba(212,175,55,0.05), transparent)' }}>
                <div>
                    <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>MY <span style={{ color: 'var(--text-cream)' }}>APPOINTMENTS</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem' }}>Manage your luxury sessions and access your digital entry tokens.</p>
                </div>
                <Link to="/booking" className="btn-gold" style={{ padding: '1.5rem 3rem', borderRadius: '50px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Sparkles size={20} /> BOOK NEW RITUAL
                </Link>
            </header>

            <div className="appointments-sections" style={{ display: 'flex', flexDirection: 'column', gap: '6rem', maxWidth: '1200px', margin: '0 auto' }}>

                {/* ⏳ UPCOMING SECTION */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                        <div style={{ background: 'var(--gold)', padding: '15px', borderRadius: '15px' }}><Clock size={24} color="black" /></div>
                        <h2 className="serif" style={{ fontSize: '2.5rem', letterSpacing: '2px' }}>UPCOMING <span style={{ color: 'var(--gold)' }}>SESSIONS</span></h2>
                        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--gold-glow), transparent)' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {upcoming.length === 0 ? (
                            <div className="glass-card" style={{ padding: '8rem', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
                                <Bookmark size={80} color="var(--gold)" style={{ opacity: 0.1, marginBottom: '2.5rem' }} />
                                <h3 className="serif" style={{ color: 'var(--text-dim)', fontSize: '2.5rem' }}>NO ACTIVE PROTOCOLS</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '3rem' }}>Your appointment calendar is currently empty. Begin your next grooming journey today.</p>
                                <Link to="/booking" className="btn-gold" style={{ padding: '1rem 3rem' }}>RESERVE NOW</Link>
                            </div>
                        ) : upcoming.map(b => <AppointmentCard key={b.id} b={b} />)}
                    </div>
                </section>

                {/* 📜 HISTORY SECTION */}
                <section style={{ opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}><Shield size={24} color="var(--text-dim)" /></div>
                        <h2 className="serif" style={{ fontSize: '2.5rem', letterSpacing: '2px', color: 'var(--text-dim)' }}>RITUAL <span style={{ color: 'var(--text-dim)' }}>HISTORY</span></h2>
                        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--glass-border), transparent)' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {past.map(b => <AppointmentCard key={b.id} b={b} isPast={true} />)}
                    </div>
                </section>
            </div>

            <footer style={{ marginTop: '10rem', textAlign: 'center' }}>
                <Link to="/profile/revenue">
                    <button className="glass-card" style={{ padding: '2rem 4rem', borderRadius: '40px', border: '1px solid var(--gold)', color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer', background: 'rgba(212,175,55,0.05)' }}>
                        <Wallet size={20} style={{ marginRight: '15px', verticalAlign: 'middle' }} /> VIEW YOUR REVENUE LOGS
                    </button>
                </Link>
            </footer>
        </div>
    );
};

export default MyAppointments;
