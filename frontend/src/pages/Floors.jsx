import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Scissors, Heart, Flower, Crown, Clock, CreditCard, ChevronRight, Check } from 'lucide-react';

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

  const floors = [
    { id: 1, name: "Common", icon: <Scissors size={20} />, desc: "Haircuts & Basic Wellness" },
    { id: 2, name: "General", icon: <Heart size={20} />, desc: "Massage & Skin Care" },
    { id: 3, name: "Female-only", icon: <Flower size={20} />, desc: "Exclusive Women's Spa" },
    { id: 4, name: "Premium", icon: <Crown size={20} />, desc: "VIP & Subscriptions" }
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

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to book a session.");
      return;
    }
    
    try {
      const response = await api.post('/bookings/', {
        service_id: bookingService.id,
        floor: selectedFloor,
        stylist_name: stylist,
        booking_time: `${date}T${time}:00`
      });
      setBookingSuccess(true);
      refreshUser(); // Update points
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingService(null);
      }, 5000);
    } catch (err) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="floors-container fade-in-up" style={{ textAlign: 'left' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 className="serif gradient-text" style={{ fontSize: '3rem', margin: 0 }}>EXPLORE <span style={{ color: 'var(--text-cream)' }}>FLOORS</span></h1>
          <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Tailored luxury for every floor of our atelier.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {floors.map(f => (
            <button 
              key={f.id} 
              onClick={() => setSelectedFloor(f.id)}
              className="btn-gold" 
              style={{ padding: '0.7rem 1.2rem', gap: '8px', background: selectedFloor === f.id ? 'var(--gold)' : 'transparent', color: selectedFloor === f.id ? 'var(--bg-dark)' : 'var(--gold)' }}
            >
              {f.icon} {f.name}
            </button>
          ))}
        </div>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 className="serif" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {floors.find(f => f.id === selectedFloor).icon} Floor {selectedFloor}: {floors.find(f => f.id === selectedFloor).name}
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{floors.find(f => f.id === selectedFloor).desc}</p>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--gold)' }}>LOADING LUXURY...</div>
      ) : (
        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {services.map(service => (
            <div key={service.id} className="glass-card service-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: 'var(--gold-glow)', color: 'var(--gold)', fontSize: '0.75rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}>{service.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  <Clock size={16} /> {service.duration} MIN
                </div>
              </div>
              <h3 className="serif" style={{ fontSize: '1.6rem', color: 'var(--text-cream)', margin: '0.5rem 0' }}>{service.name}</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-dim)', flexGrow: 1, lineHeight: '1.6' }}>{service.description}</p>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.2rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="serif" style={{ fontSize: '1.7rem', fontWeight: 'bold' }}>₹{service.price}</div>
                <button onClick={() => setBookingService(service)} className="btn-gold" style={{ padding: '0.6rem 2rem', gap: '5px' }}>
                  BOOK <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal (Simplified) */}
      {bookingService && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '90%', padding: '3rem', position: 'relative', border: bookingSuccess ? '2px solid var(--gold)' : '1px solid var(--glass-border)' }}>
            {bookingSuccess ? (
              <div className="fade-in-up" style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ background: 'var(--gold)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', boxShadow: '0 0 30px var(--gold-glow)' }}>
                  <Check size={40} color="var(--bg-dark)" />
                </div>
                <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>RESERVATION <span style={{ color: 'var(--gold)' }}>SECURED</span></h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Your treatment at LUMIÈRE Atelier is confirmed. <br /> Check your profile for details.</p>
                <button onClick={() => setBookingService(null)} className="btn-gold" style={{ padding: '0.8rem 2rem' }}>CLOSE ATELIER</button>
              </div>
            ) : (
              <>
                <h2 className="serif" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>RESERVE <span style={{ color: 'var(--gold)' }}>SESSION</span></h2>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{bookingService.name}</div>
                  <div style={{ fontSize: '1rem', color: 'var(--gold)' }}>₹{bookingService.price} | Floor {selectedFloor}</div>
                </div>

                <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '1px' }}>CHOOSE STYLIST</label>
                    <input 
                      type="text" 
                      value={stylist}
                      onChange={(e) => setStylist(e.target.value)}
                      placeholder="Preferred Stylist Name" 
                      required
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'var(--text-cream)', borderRadius: '10px', outline: 'none' }} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '1px' }}>DATE</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'var(--text-cream)', borderRadius: '10px', outline: 'none' }} 
                      />
                    </div>
                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '1px' }}>TIME</label>
                      <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'var(--text-cream)', borderRadius: '10px', outline: 'none' }} 
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-gold" style={{ flexGrow: 1, padding: '1.2rem' }}>
                      CONFIRM APPOINTMENT
                    </button>
                    <button type="button" onClick={() => setBookingService(null)} className="btn-gold" style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)' }}>
                      CANCEL
                    </button>
                  </div>
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
