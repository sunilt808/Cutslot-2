import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, Scissors, Heart, Flower, Crown, Clock, CreditCard, ChevronRight, Check, Shield, Info, Smartphone, Wallet, User as UserIcon, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const Booking = () => {
  const { api, user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const initialService = location.state?.service;
  
  const [selectedFloor, setSelectedFloor] = useState(initialService?.floor || 1);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [bookingService, setBookingService] = useState(null);
  const [stylist, setStylist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentStep, setPaymentStep] = useState(false);
  const [category, setCategory] = useState("normal");
  const [gender, setGender] = useState("male");

  const floors = [
    { id: 1, name: "Common", icon: <Scissors size={20} />, desc: "Hair & Grooming (Mens)" },
    { id: 2, name: "VIP", icon: <Crown size={20} />, desc: "Private Styling Suite" },
    { id: 3, name: "Beauty", icon: <Flower size={20} />, desc: "Facials & Aesthetics" },
    { id: 4, name: "Member", icon: <Shield size={20} />, desc: "Club Membership Rituals" }
  ];

  useEffect(() => {
    fetchServices();
    fetchWorkers();
  }, [selectedFloor, api]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/services/?floor=${selectedFloor}`);
      setServices(response.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchWorkers = async () => {
    try {
        const res = await api.get(`/workers/?floor=${selectedFloor}`);
        setWorkers(res.data);
    } catch (err) { console.error(err); }
  };

  const initiatePayment = (e) => {
    e.preventDefault();
    if (!user) {
        alert("Please login to complete your booking.");
        navigate('/auth');
        return;
    }
    setPaymentStep(true);
  };

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      const res = await api.post('/bookings/', {
        service_id: bookingService.id,
        floor: selectedFloor,
        stylist_name: stylist || "Not Specified",
        category: category,
        gender: gender,
        booking_time: `${date}T${time}:00`
      });
      refreshUser();
      navigate('/booking-confirmation', { state: { booking: res.data, service: bookingService } });
    } catch (err) { alert(err.response?.data?.detail || "FAILED"); setPaymentStep(false); }
    finally { setLoading(false); }
  };

  return (
    <div className="booking-page fade-in-up">
      <header className="glass-card" style={{ padding: '3.5rem', marginBottom: '3rem', borderTop: '4px solid var(--gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="serif gradient-text" style={{ fontSize: '4rem', margin: 0, letterSpacing: '-2px' }}>BOOK <span style={{ color: 'var(--text-cream)' }}>APPOINTMENT</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.8rem' }}>Fast and easy booking for all your salon needs.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {floors.map(f => (
            <button key={f.id} onClick={() => setSelectedFloor(f.id)} className="btn-gold" style={{ padding: '1rem 1.5rem', background: selectedFloor === f.id ? 'var(--gold)' : 'rgba(255,255,255,0.05)', color: selectedFloor === f.id ? 'black' : 'var(--gold)', border: '1px solid var(--gold)', fontSize: '0.85rem', fontWeight: 'bold' }}>{f.icon} {f.name.toUpperCase()}</button>
          ))}
        </div>
      </header>

      <section style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(212,175,55,0.05)', borderRadius: '15px', marginBottom: '4rem', border: '1px solid var(--gold-glow)' }}>
         <Info color="var(--gold)" size={22} />
         <p style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 'bold' }}>FLOOR 0{selectedFloor} IS ACTIVE: Selecting services for {floors.find(f => f.id === selectedFloor)?.name}.</p>
      </section>

      <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
        {services.length === 0 && !loading && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '5rem', color: 'var(--text-dim)' }}>
                <Scissors size={50} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p>No services found for this floor. Please select another floor.</p>
            </div>
        )}
        {services.map(service => (
          <div key={service.id} className="glass-card hover-lift" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--glass-border)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '2px' }}>
                <span>{service.category.toUpperCase()}</span>
                <span>{service.duration} MIN</span>
             </div>
             <h3 className="serif" style={{ fontSize: '2rem', margin: 0 }}>{service.name}</h3>
             <p style={{ fontSize: '1rem', color: 'var(--text-dim)', lineHeight: 1.6, height: '80px', overflow: 'hidden' }}>{service.description}</p>
             <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="serif" style={{ fontSize: '2.5rem' }}>₹{service.price}</div>
                <button onClick={() => setBookingService(service)} className="btn-gold" style={{ padding: '1rem 2rem', fontWeight: 'bold' }}>SELECT SERVICE <ChevronRight size={18} /></button>
             </div>
          </div>
        ))}
      </div>

      {bookingService && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5, 4, 8, 0.98)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card fade-in" style={{ maxWidth: '700px', width: '95%', padding: '5rem', position: 'relative', border: '2px solid var(--gold)' }}>
             <button onClick={() => setBookingService(null)} style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>CLOSE [X]</button>
             
             {paymentStep ? (
               <div className="fade-in">
                  <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
                    {user?.subscription_plan ? 'MEMBERSHIP PAYMENT' : 'SERVICE PAYMENT'}
                  </h2>
                  
                  <div className="glass-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '3rem', marginBottom: '3rem', textAlign: 'center' }}>
                     {user?.subscription_plan ? (
                        <>
                           <div style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '1rem' }}>MEMBERSHIP STATUS</div>
                           <div className="serif" style={{ fontSize: '2.5rem', color: 'var(--text-cream)' }}>{user.subscription_plan?.toUpperCase()}</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2rem' }}>This booking is covered by your plan.</div>
                        </>
                     ) : (
                        <>
                           <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 'bold', marginBottom: '1rem' }}>TOTAL AMOUNT</div>
                           <div className="serif" style={{ fontSize: '4.5rem', color: 'var(--gold)' }}>₹{bookingService.price}</div>
                           <div style={{ fontSize: '0.75rem', color: '#4caf50', marginTop: '2rem', fontWeight: 'bold' }}>SECURE PAYMENT GATEWAY</div>
                        </>
                     )}
                  </div>

                  <button onClick={handleFinalBooking} className="btn-gold" style={{ width: '100%', padding: '1.8rem', fontSize: '1.3rem', fontWeight: 'bold', borderRadius: '50px' }}>
                    <Wallet size={24} style={{ marginRight: '15px' }} /> 
                    {user?.subscription_plan ? 'CONFIRM BOOKING' : 'PAY NOW'}
                  </button>
                  <button onClick={() => setPaymentStep(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', width: '100%', padding: '2rem', cursor: 'pointer', fontSize: '1rem' }}>GO BACK</button>
               </div>
            ) : (
              <>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>BOOKING <span style={{ color: 'var(--gold)' }}>DETAILS</span></h2>
                <form onSubmit={initiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* 👤 WORKER SELECTOR */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>SELECT WORKER / ARTIST</label>
                       <div style={{ position: 'relative' }}>
                          <UserIcon size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                          <select value={stylist} onChange={(e) => setStylist(e.target.value)} required className="glass-input" style={{ width: '100%', padding: '1.3rem 1.3rem 1.3rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--gold)', color: 'var(--text-cream)', borderRadius: '15px', appearance: 'none' }}>
                             <option value="" style={{ background: 'var(--bg-dark)' }}>Choose an artist...</option>
                             {workers.map(w => (
                                <option key={w.id} value={w.username} style={{ background: 'var(--bg-dark)' }}>{w.full_name || w.username} (Available)</option>
                             ))}
                             {workers.length === 0 && <option disabled style={{ background: 'var(--bg-dark)' }}>No workers available for this floor.</option>}
                          </select>
                       </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>GENDER</label>
                          <select value={gender} onChange={(e) => setGender(e.target.value)} required className="glass-input" style={{ width: '100%', padding: '1.3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px', appearance: 'none' }}>
                             <option value="male" style={{ background: 'var(--bg-dark)' }}>Male</option>
                             <option value="female" style={{ background: 'var(--bg-dark)' }}>Female</option>
                             <option value="child" style={{ background: 'var(--bg-dark)' }}>Child</option>
                          </select>
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>CATEGORY</label>
                          <select value={category} onChange={(e) => setCategory(e.target.value)} required className="glass-input" style={{ width: '100%', padding: '1.3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px', appearance: 'none' }}>
                             <option value="normal" style={{ background: 'var(--bg-dark)' }}>Normal</option>
                             <option value="vip" style={{ background: 'var(--bg-dark)' }}>VIP Member</option>
                          </select>
                       </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>DATE</label>
                          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} className="glass-input" style={{ width: '100%', padding: '1.3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>TIME</label>
                          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="glass-input" style={{ width: '100%', padding: '1.3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                       </div>
                    </div>

                  <button type="submit" className="btn-gold" style={{ padding: '1.8rem', marginTop: '3rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem' }}>PROCEED TO PAYMENT</button>
                  <button type="button" onClick={() => setBookingService(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '1rem' }}>CANCEL</button>
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
