import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Scissors, Heart, Flower, Crown, Clock, CreditCard, ChevronRight, Check, Shield, Info, Smartphone, Wallet } from 'lucide-react';

const Floors = () => {
  const { api, user, refreshUser } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(1);
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
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/services/?floor=${selectedFloor}`);
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedFloor, api]);

  const initiatePayment = (e) => {
    e.preventDefault();
    if (!user) { alert("Please login to access the atelier."); return; }
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
    } catch (err) {
      alert(err.response?.data?.detail || "Booking failed. Requested slot is unavailable.");
      setPaymentStep(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="floors-container fade-in-up">
      <header className="glass-card" style={{ padding: '3rem', marginBottom: '3rem', borderTop: '4px solid var(--gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>BOOK <span style={{ color: 'var(--text-cream)' }}>EXPERIENCE</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Our intelligent slotting algorithm ensures zero waiting time on all levels.</p>
        </div>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          {floors.map(f => (
            <button key={f.id} onClick={() => setSelectedFloor(f.id)} className="btn-gold" style={{ padding: '0.8rem 1.5rem', background: selectedFloor === f.id ? 'var(--gold)' : 'transparent', color: selectedFloor === f.id ? 'var(--bg-dark)' : 'var(--gold)' }}>{f.icon} {f.name}</button>
          ))}
        </div>
      </header>

      <section style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,175,55,0.05)', borderRadius: '15px', marginBottom: '3rem' }}>
         <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Info color="var(--gold)" size={24} />
            <p style={{ color: 'var(--gold)', letterSpacing: '1px', fontSize: '0.9rem', fontWeight: 'bold' }}>INTUITION ENGINE ACTIVE: Floor {selectedFloor} slots optimized for efficiency.</p>
         </div>
         <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>ADVANCE BOOKING v2.0</span>
      </section>

      {loading && !paymentStep ? (
        <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--gold)' }}>CALCULATING SLOTS...</div>
      ) : (
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {services.map(service => (
            <div key={service.id} className="glass-card service-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--glass-border)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--gold)' }}>
                  <span>{service.category.toUpperCase()}</span>
                  <span>{service.duration} MIN SESSION</span>
               </div>
               <h3 className="serif" style={{ fontSize: '1.8rem', margin: 0 }}>{service.name}</h3>
               <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{service.description}</p>
               <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="serif" style={{ fontSize: '2rem' }}>₹{service.price}</div>
                  <button onClick={() => setBookingService(service)} className="btn-gold" style={{ padding: '0.8rem 2rem' }}>RESERVE <ChevronRight size={18} /></button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking/Payment Modal */}
      {bookingService && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '600px', width: '90%', padding: '4rem', position: 'relative', border: bookingSuccess ? '2px solid var(--gold)' : '1px solid var(--glass-border)' }}>
            {bookingSuccess ? (
              <div className="fade-in-up" style={{ textAlign: 'center' }}>
                <div style={{ background: 'var(--gold)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 0 40px var(--gold-glow)' }}>
                  <Check size={50} color="var(--bg-dark)" />
                </div>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '1rem' }}>SECURED <span style={{ color: 'var(--gold)' }}>SESSION</span></h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Your reservation at Floor {selectedFloor} is confirmed. An algorithm-optimized slot has been allocated.</p>
                <button onClick={() => setBookingService(null)} className="btn-gold" style={{ padding: '1.2rem 3.5rem' }}>EXIT ATELIER</button>
              </div>
            ) : paymentStep ? (
               <div className="fade-in">
                  <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>BOUTIQUE <span style={{ color: 'var(--gold)' }}>PAYMENT</span></h2>
                  <div className="glass-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', marginBottom: '2rem' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span>TOTAL PAYABLE</span>
                        <span className="serif" style={{ fontSize: '1.6rem', color: 'var(--gold)' }}>₹{bookingService.price}</span>
                     </div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Payment secured via Lumière Elite Merchant Protocol.</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={handleFinalBooking} className="btn-gold" style={{ padding: '1.2rem', fontSize: '1.1rem', background: 'var(--gold-glow)' }}><Wallet size={20} /> AUTHORIZE PAYMENT</button>
                    <button onClick={() => setPaymentStep(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', padding: '1rem' }}>GO BACK</button>
                  </div>
               </div>
            ) : (
              <>
                <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>ELITE <span style={{ color: 'var(--gold)' }}>BOOKING</span></h2>
                <form onSubmit={initiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>STYLIST PREFERENCE</label>
                    <input type="text" value={stylist} onChange={(e) => setStylist(e.target.value)} placeholder="Master Artisan Name" required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1.2rem', color: 'var(--text-cream)', borderRadius: '15px', width: '100%', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="input-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>SERVICE DATE</label>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1.2rem', color: 'var(--text-cream)', borderRadius: '15px', width: '100%', outline: 'none' }} />
                    </div>
                    <div className="input-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>SESSION TIME</label>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1.2rem', color: 'var(--text-cream)', borderRadius: '15px', width: '100%', outline: 'none' }} />
                    </div>
                  </div>
                  <div style={{ background: 'rgba(212,175,55,0.05)', padding: '1rem', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--gold)', border: '1px solid var(--gold)' }}>
                     <Smartphone size={14} /> Our <strong>Advance Slotting Algorithm</strong> will verify availability upon confirmation.
                  </div>
                  <button type="submit" className="btn-gold" style={{ padding: '1.2rem', marginTop: '1rem' }}>PROCEED TO TRANSACTION</button>
                  <button type="button" onClick={() => setBookingService(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)' }}>CANCEL ATELIER</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Floors;
