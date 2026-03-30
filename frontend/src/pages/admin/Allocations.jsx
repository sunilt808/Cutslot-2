import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Truck, Sparkles, User as UserIcon, Check, X, Clock, MapPin, Filter } from 'lucide-react';

const AdminAllocations = () => {
    const { user, api } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bRes, wRes] = await Promise.all([
                api.get('/bookings/'),
                api.get('/admin/workers')
            ]);
            // Only show bookings that need allocation or are pending active status
            const active = bRes.data.filter(b => b.status === 'pending' || b.status === 'confirmed');
            setBookings(active);
            setWorkers(wRes.data.filter(w => w.is_approved));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAllocate = async (bookingId, workerName) => {
        try {
            await api.put(`/admin/bookings/${bookingId}/allocate`, { staff_name: workerName });
            fetchData();
            alert(`Artisan ${workerName} dispatched to booking #${bookingId}.`);
        } catch (err) { alert("Allocation failed."); }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const filteredBookings = bookings.filter(b => {
        if (filterType === 'home') return b.service_type === 'home';
        if (filterType === 'custom') return b.service_type === 'custom';
        return true;
    });

    return (
        <div className="admin-allocations-page fade-in" style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header className="glass-card" style={{ padding: '5rem', marginBottom: '6rem', position: 'relative', overflow: 'hidden', borderRadius: '40px', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.08), transparent)' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>MISSION <span style={{ color: 'var(--text-cream)' }}>CONTROL</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.3rem', marginTop: '1rem', maxWidth: '700px' }}>Atelier Dispatch Terminal for coordinating elite rituals across the floor estate and doorstep doorstep rituals.</p>
                </div>
                <Truck size={200} style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.03, transform: 'rotate(-15deg)' }} />
            </header>

            {/* 🛠️ STRATEGIC FILTER BAR */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
                <button onClick={() => setFilterType('all')} className={filterType === 'all' ? "btn-gold" : "nav-button"} style={{ padding: '1.2rem 3rem', borderRadius: '50px' }}>ALL RITUALS</button>
                <button onClick={() => setFilterType('home')} className={filterType === 'home' ? "btn-gold center-align" : "nav-button center-align"} style={{ display: 'flex', gap: '10px', padding: '1.2rem 3rem', borderRadius: '50px' }}><Truck size={18} /> DOORSTEP DISPATCH</button>
                <button onClick={() => setFilterType('custom')} className={filterType === 'custom' ? "btn-gold center-align" : "nav-button center-align"} style={{ display: 'flex', gap: '10px', padding: '1.2rem 3rem', borderRadius: '50px' }}><Sparkles size={18} /> BESPOKE SESSIONS</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '3rem' }}>
                {filteredBookings.length === 0 ? (
                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '12rem', background: 'rgba(255,255,255,0.01)', borderRadius: '40px', border: '1px dashed var(--glass-border)' }}>
                        <Shield size={60} color="var(--gold)" style={{ opacity: 0.2, marginBottom: '2.5rem' }} />
                        <h2 className="serif" style={{ fontSize: '2.5rem', color: 'var(--text-dim)' }}>ALL RITUALS ALLOCATED</h2>
                        <p style={{ color: 'var(--text-dim)' }}>The estate is operating at peak efficiency. No pending dispatches detected.</p>
                    </div>
                ) : (
                    filteredBookings.map(b => (
                        <div key={b.id} className="glass-card hover-lift" style={{ padding: '3.5rem', borderRadius: '35px', display: 'flex', flexDirection: 'column', gap: '2.5rem', border: '1px solid var(--glass-border)', background: 'linear-gradient(135deg, rgba(255,255,255,0.02), transparent)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '3px', fontWeight: 'bold', marginBottom: '1.5rem' }}>{b.service_type?.toUpperCase()} RITUAL</div>
                                    <h3 className="serif" style={{ fontSize: '2.5rem', margin: 0 }}>{b.user_name}</h3>
                                    <div style={{ color: 'var(--text-dim)', fontSize: '1rem', marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Clock size={16} /> {new Date(b.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on {new Date(b.booking_time).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', background: 'var(--gold-glow)', borderRadius: '15px' }}>
                                    {b.service_type === 'home' ? <Truck size={24} color="var(--gold)" /> : <Sparkles size={24} color="var(--gold)" />}
                                </div>
                            </div>

                            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '25px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-dim)' }}>ESTATE FLOOR</span>
                                    <span style={{ fontWeight: 'bold' }}>FLOOR 0{b.floor}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-dim)' }}>RITUAL TIKE</span>
                                    <span style={{ fontWeight: 'bold' }}>{b.category.toUpperCase()}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <label style={{ fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '3px', fontWeight: 'bold', display: 'block', marginBottom: '1.5rem' }}>DISPATCH ARTISAN</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select 
                                        defaultValue={b.stylist_name}
                                        onChange={(e) => handleAllocate(b.id, e.target.value)}
                                        style={{ flex: 1, padding: '1.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '15px', fontSize: '1rem' }}
                                    >
                                        <option value="">AWAITING SELECTION...</option>
                                        {workers.map(w => <option key={w.username} value={w.username}>{w.username.toUpperCase()}</option>)}
                                    </select>
                                    <button className="btn-gold" style={{ padding: '0 2rem', borderRadius: '15px' }}><Check size={24} /></button>
                                </div>
                                {b.stylist_name && <div style={{ fontSize: '0.8rem', color: '#4caf50', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} /> Artisan {b.stylist_name} confirmed for allocation.</div>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminAllocations;
