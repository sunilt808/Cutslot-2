import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Calendar, Clock, MapPin, User, Scissors, Download, Share2, ArrowRight, Wallet, Crown, ShieldCheck, Activity } from 'lucide-react';

const BookingConfirmation = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { booking, service } = location.state || {};

    if (!booking) return <Navigate to="/booking" />;

    const tokenNumber = `CS-${booking.id}-${new Date().getFullYear()}`;

    return (
        <div className="confirmation-page fade-in" style={{ padding: '4rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '900px', width: '100%', padding: '5rem', border: '2px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent)', textAlign: 'center' }}>
                
                <div className="pulse-gold" style={{ background: 'var(--gold)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem auto' }}>
                    <CheckCircle size={50} color="black" />
                </div>

                <h1 className="serif gradient-text" style={{ fontSize: '4rem', marginBottom: '1rem' }}>RITUAL <span style={{ color: 'var(--text-cream)' }}>SECURED</span></h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '4rem' }}>Your luxury grooming experience has been synchronized with our artisans.</p>

                {/* 💍 TOKEN DISPLAY */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '30px', border: '1px dashed var(--gold)', marginBottom: '4rem', position: 'relative' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1rem' }}>ELITE ACCESS TOKEN</div>
                    <div className="serif" style={{ fontSize: '5rem', letterSpacing: '8px', color: 'var(--text-cream)' }}>{tokenNumber}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '1rem' }}>PRESENT THIS AT THE ATELIER ENTRANCE</div>
                </div>

                {/* 🧊 DETAILS GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', textAlign: 'left', marginBottom: '4rem' }}>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.8rem' }}><Scissors size={14} /> SERVICE</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{service?.name || "Premium Ritual"}</div>
                    </div>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.8rem' }}><MapPin size={14} /> LOCATION</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Floor 0{booking.floor} - Premium Suite</div>
                    </div>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.8rem' }}><Calendar size={14} /> DATE & TIME</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{new Date(booking.booking_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                    </div>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.8rem' }}><User size={14} /> ARTISAN ASSIGNED</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{booking.stylist_name}</div>
                    </div>
                    
                    {/* 💰 PAYMENT & STATUS */}
                    <div style={{ padding: '2rem', background: 'rgba(212,175,55,0.05)', borderRadius: '20px', border: '1px solid var(--gold-glow)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.8rem' }}><Wallet size={14} /> PAYMENT DETAILS</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--gold)' }}>₹{booking.price_paid} {booking.price_paid === 0 ? "(MEMBERSHIP)" : ""}</div>
                    </div>
                    <div style={{ padding: '2rem', background: 'rgba(212,175,55,0.05)', borderRadius: '20px', border: '1px solid var(--gold-glow)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.8rem' }}><Activity size={14} /> CURRENT STATUS</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '2px' }}>{booking.status.toUpperCase()}</div>
                    </div>

                    {/* 🎖️ MEMBER STATUS */}
                    <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: 'var(--gold)', padding: '10px', borderRadius: '10px' }}><Crown size={24} color="black" /></div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>MEMBER LEVEL</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{user?.subscription_plan || "ELITE GUEST"}</div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>LOYALTY POINTS</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--gold)' }}>{user?.loyalty_points || 0} PTS</div>
                        </div>
                    </div>
                </div>

                {/* 🕹️ ACTIONS */}
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <Link to="/profile" className="btn-gold" style={{ padding: '1.4rem 4rem', borderRadius: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        TRACK SESSION <ArrowRight size={18} />
                    </Link>
                    <button onClick={() => window.print()} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '1.4rem 4rem', borderRadius: '40px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                        <Download size={18} /> DOWNLOAD TOKEN
                    </button>
                </div>
            </div>

            <footer style={{ marginTop: '5rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={20} color="var(--gold)" />
                    <span style={{ fontSize: '0.8rem', letterSpacing: '3px', fontWeight: 'bold' }}>CUTSLOT SECURE PROTOCOL V2.1</span>
                </div>
                <p style={{ opacity: 0.5, fontSize: '0.75rem' }}>Present this token at the Floor 0{booking.floor} entrance for verification by the assigned Artisan.</p>
            </footer>
        </div>
    );
};

export default BookingConfirmation;
