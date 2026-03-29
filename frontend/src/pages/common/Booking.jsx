import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, Scissors, Heart, Flower, Crown, Clock, CreditCard, ChevronRight, Check, Shield, Info, Smartphone, Wallet } from 'lucide-react';

const Booking = () => {
  const { api, user, refreshUser } = useAuth();
  const location = useLocation();
  const initialService = location.state?.service;
  const [selectedFloor, setSelectedFloor] = useState(initialService?.floor || 1);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingService, setBookingService] = useState(null);
  const [stylist, setStylist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);

  const floors = [
    { id: 1, name: "Common", icon: <Scissors size={20} />, desc: "Elite Grooming (Males)" },
    { id: 2, name: "Wellness", icon: <Heart size={20} />, desc: "Massage & Skin Rituals" },
    { id: 3, name: "Female-only", icon: <Flower size={20} />, desc: "Exclusive Beauty Therapy" },
    { id: 4, name: "Premium", icon: <Crown size={20} />, desc: "VIP Club & Private Stylists" }
  ];

  useEffect(() => {
    fetchServices();
  }, [selectedFloor, api]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/services/?floor=${selectedFloor}`);
      setServices(response.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const initiatePayment = (e) => {
    e.preventDefault();
    setPaymentStep(true);
  };

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      await api.post('/bookings/', {
        service_id: bookingService.id,
        floor: selectedFloor,
        stylist_name: stylist,
        booking_time: `${date}T${time}:00`
      });
      setBookingSuccess(true);
      refreshUser();
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingService(null);
        setPaymentStep(false);
      }, 5000);
    } catch (err) { alert(err.response?.data?.detail || "FAILED"); setPaymentStep(false); }
    finally { setLoading(false); }
  };

  return (
    <div className="booking-page fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', borderTop: '4px solid var(--gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>BOOK <span style={{ color: 'var(--text-cream)' }}>EXPERIENCE</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Our intelligent slotting algorithm ensures zero waiting time on all levels.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {floors.map(f => (
            <button key={f.id} onClick={() => setSelectedFloor(f.id)} className="btn-gold" style={{ padding: '0.8rem 1.2rem', background: selectedFloor === f.id ? 'var(--gold)' : 'transparent', color: selectedFloor === f.id ? 'var(--bg-dark)' : 'var(--gold)', border: '1px solid var(--gold)', fontSize: '0.8rem' }}>{f.icon} {f.name}</button>
          ))}
        </div>
      </header>

      <section style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,175,55,0.05)', borderRadius: '15px', marginBottom: '3rem', border: '1px solid var(--gold-glow)' }}>
         <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Info color="var(--gold)" size={20} />
            <p style={{ color: 'var(--gold)', letterSpacing: '1px', fontSize: '0.85rem', fontWeight: 'bold' }}>INTUITION ENGINE ACTIVE: Floor {selectedFloor} slots optimized for efficiency.</p>
         </div>
      </section>

      <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {services.map(service => (
          <div key={service.id} className="glass-card service-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid var(--glass-border)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--gold)' }}>
                <span>{service.category.toUpperCase()}</span>
                <span>{service.duration} MIN SESSION</span>
             </div>
             <h3 className="serif" style={{ fontSize: '1.6rem', margin: 0 }}>{service.name}</h3>
             <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{service.description}</p>
             <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="serif" style={{ fontSize: '2rem' }}>₹{service.price}</div>
                <button onClick={() => setBookingService(service)} className="btn-gold" style={{ padding: '0.8rem 1.5rem' }}>RESERVE <ChevronRight size={16} /></button>
             </div>
          </div>
        ))}
      </div>

      {bookingService && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '90%', padding: '3.5rem', position: 'relative' }}>
            {bookingSuccess ? (
              <div className="fade-in-up" style={{ textAlign: 'center' }}>
                <Check size={60} color="var(--gold)" style={{ marginBottom: '2rem' }} />
                <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>SECURED <span style={{ color: 'var(--gold)' }}>SESSION</span></h2>
                <button onClick={() => setBookingService(null)} className="btn-gold" style={{ padding: '1rem 3rem', marginTop: '1.5rem' }}>EXIT ATELIER</button>
              </div>
            ) : paymentStep ? (
               <div className="fade-in">
                  <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>BOUTIQUE <span style={{ color: 'var(--gold)' }}>PAYMENT</span></h2>
                  <div className="glass-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
                     <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>TOTAL PAYABLE</div>
                     <div className="serif" style={{ fontSize: '2.5rem', color: 'var(--gold)' }}>₹{bookingService.price}</div>
                  </div>
                  <button onClick={handleFinalBooking} className="btn-gold" style={{ width: '100%', padding: '1.2rem' }}><Wallet size={20} /> AUTHORIZE PAYMENT</button>
                  <button onClick={() => setPaymentStep(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', width: '100%', padding: '1rem' }}>GO BACK</button>
               </div>
            ) : (
              <>
                <h2 className="serif" style={{ fontSize: '2.2rem', marginBottom: '2.5rem', textAlign: 'center' }}>ELITE <span style={{ color: 'var(--gold)' }}>BOOKING</span></h2>
                <form onSubmit={initiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input type="text" value={stylist} onChange={(e) => setStylist(e.target.value)} placeholder="Artisan Name" required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1.2rem', color: 'var(--text-cream)', borderRadius: '15px' }} />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1.2rem', color: 'var(--text-cream)', borderRadius: '15px' }} />
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1.2rem', color: 'var(--text-cream)', borderRadius: '15px' }} />
                  <button type="submit" className="btn-gold" style={{ padding: '1.2rem', marginTop: '1rem' }}>PROCEED TO TRANSACTION</button>
                  <button type="button" onClick={() => setBookingService(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)' }}>CANCEL</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
