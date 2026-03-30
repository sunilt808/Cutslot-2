import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, Truck, Crown, Sparkles, Shield, ChevronRight, User as UserIcon, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdvanceBooking = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [bookingType, setBookingType] = useState('standard'); // standard, custom, home
    const [date, setDate] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [services, setServices] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');

    useEffect(() => {
        if (bookingType) fetchServices();
        fetchWorkers();
    }, [bookingType]);

    const fetchServices = async () => {
        try {
            const res = await api.get('/services/');
            // Filter by type or category
            const filtered = res.data.filter(s => {
                if (bookingType === 'home') return s.service_type === 'home' || s.category === 'doorstep';
                if (bookingType === 'custom') return s.service_type === 'custom' || s.category === 'bespoke';
                return s.service_type === 'standard' || s.floor < 4;
            });
            setServices(filtered);
        } catch (err) { console.error(err); }
    };

    const fetchWorkers = async () => {
        try {
            const res = await api.get('/workers/');
            setWorkers(res.data);
        } catch (err) { console.error(err); }
    };

    const handleFinalize = async () => {
        if (!date || !selectedService || (bookingType !== 'home' && !selectedWorker)) return alert("Protocol incomplete. Please fill all fields.");
        try {
            const bookingData = {
                service_id: selectedService.id,
                floor: selectedService.floor,
                stylist_name: bookingType === 'home' ? "ADMIN_ALLOCATED" : selectedWorker,
                category: selectedService.category,
                gender: user.gender || "not specified",
                booking_time: date,
                service_type: bookingType
            };
            await api.post('/bookings/', bookingData);
            navigate('/booking-confirmation');
        } catch (err) { alert(err.response?.data?.detail || "Ritual scheduling failed."); }
    };

    const types = [
        { id: 'standard', name: 'Atelier Ritual', icon: <UserIcon size={24} />, desc: 'Standard service at Floor 1-3' },
        { id: 'custom', name: 'Bespoke Craft', icon: <Sparkles size={24} />, desc: 'Custom tailored grooming (Elite required)' },
        { id: 'home', name: 'Doorstep Luxury', icon: <Truck size={24} />, desc: 'Artisan travels to your coordinates' }
    ];

    return (
        <div className="advance-booking-page fade-in" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '6rem', textAlign: 'center' }}>
                <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0 }}>ADVANCE <span style={{ color: 'var(--text-cream)' }}>SCHEDULING</span></h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Lock your ritual into the estate timeline.</p>
            </header>

            <div style={{ display: 'flex', gap: '3rem', marginBottom: '4rem', overflowX: 'auto', padding: '1rem' }}>
                {types.map(t => (
                    <button 
                        key={t.id} 
                        onClick={() => { setBookingType(t.id); setStep(2); }} 
                        className="glass-card hover-lift" 
                        style={{ 
                            flex: 1, minWidth: '250px', padding: '3rem', textAlign: 'left', 
                            border: bookingType === t.id ? '2px solid var(--gold)' : '1px solid var(--glass-border)',
                            background: bookingType === t.id ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.01)'
                        }}
                    >
                        <div style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>{t.icon}</div>
                        <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.name}</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{t.desc}</p>
                    </button>
                ))}
            </div>

            <main style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
                <div className="glass-card" style={{ padding: '4rem' }}>
                    <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>1. SERVICE <span style={{ color: 'var(--gold)' }}>SELECTION</span></h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        {services.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => setSelectedService(s)} 
                                style={{ 
                                    padding: '2rem', borderRadius: '15px', border: selectedService?.id === s.id ? '1px solid var(--gold)' : '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{s.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{s.category.toUpperCase()} | {s.duration} MINS</div>
                                </div>
                                <div style={{ fontWeight: 'bold', color: 'var(--gold)' }}>₹{s.price}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div className="glass-card shadow-gold" style={{ padding: '4rem' }}>
                        <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>2. TIMELINE</h2>
                        
                        <div className="input-field" style={{ marginBottom: '2rem' }}>
                            <label style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '2px', fontWeight: 'bold' }}>SELECT DATE & HOUR</label>
                            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }} />
                        </div>

                        {bookingType !== 'home' && (
                            <div className="input-field" style={{ marginBottom: '4rem' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '2px', fontWeight: 'bold' }}>DIRECT ARTISAN ALLOCATION</label>
                                <select value={selectedWorker} onChange={(e) => setSelectedWorker(e.target.value)} style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', color: 'white' }}>
                                    <option value="">AWAITING SYSTEM ASSIGNMENT</option>
                                    {workers.map(w => <option key={w.username} value={w.username}>{w.username.toUpperCase()}</option>)}
                                </select>
                            </div>
                        )}

                        <button onClick={handleFinalize} className="btn-gold" style={{ width: '100%', padding: '1.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
                            SCHEDULING PROTOCOL
                        </button>
                    </div>

                    <div className="glass-card" style={{ padding: '3rem', border: '1px solid var(--glass-border)' }}>
                        <h4 className="serif" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}><Shield size={20} color="var(--gold)" style={{ verticalAlign: 'middle', marginRight: '10px' }} /> CLEARANCE</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                            {bookingType === 'home' ? "DOORSTEP PROTOCOL: Admin will allocate an artisan based on distance and priority. Expect a call 60 mins before ritual." : "ATELIER PROTOCOL: Arrive 5 mins prior to your ritual slot."}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdvanceBooking;
