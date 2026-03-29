import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Flower, Crown, Zap, Info, HandMetal, Clock, ArrowRight, ShieldCheck, Sparkles, Smartphone, Star, Layout, Layers, Shield, Sparkle, Diamond, CheckCircle, SmartphoneIcon, MapPin, Award, User, Gem, Heart, Trophy, CreditCard, Lock } from 'lucide-react';

const Services = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState("common");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const segments = [
    { id: "common", name: "GENERAL", floor: 1, icon: <Scissors size={20} />, label: "Standard Excellence" },
    { id: "female", name: "BEAUTY", floor: 3, icon: <Flower size={20} />, label: "Aesthetic Rituals" },
    { id: "subscription", name: "MEMBERSHIP", floor: 4, icon: <Crown size={20} />, label: "Loyalty Plans" },
    { id: "advance", name: "VIP BOOKING", floor: 2, icon: <Zap size={20} />, label: "Elite Privacy" }
  ];

  useEffect(() => {
    fetchData();
  }, [activeSegment]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const segment = segments.find(s => s.id === activeSegment);
      const res = await api.get(`/services/?floor=${segment.floor}`);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatBooking = (service) => {
    if (!user) {
      alert("Please login to book a luxury seat.");
      navigate('/auth');
      return;
    }
    if (service.floor === 4) {
        handleActivatePlan(service);
        return;
    }
    navigate('/booking', { state: { service } });
  };

  const [payingService, setPayingService] = useState(null);
  const [cardNumber, setCardNumber] = useState("");

  const handleActivatePlan = (service) => {
      setPayingService(service);
  };

  const processPayment = async () => {
      if(cardNumber.length < 16) {
          alert("Elite credit protocol requires 16-digit authorization.");
          return;
      }
      try {
          await api.post('/subscribe/', { service_id: payingService.id });
          alert(`${payingService.name.toUpperCase()} ACTIVATED. REVENUE RECORDED.`);
          setPayingService(null);
          window.location.reload();
      } catch(err) {
          alert(err.response?.data?.detail || "Transaction declined.");
      }
  };

  // 🏛️ RENDERING LOGIC FOR EACH UNIQUE CATEGORY
  
  // 1. GENERAL (F1) - Clean Efficient 3-Column Grid
  const renderGeneral = () => (
    <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
      {services.map(s => (
        <div key={s.id} className="glass-card hover-lift" style={{ padding: '3rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--gold)' }}><Scissors size={18} /> <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>#{s.id}</div></div>
          <h3 className="serif" style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{s.name}</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', marginBottom: '2rem', height: '60px', overflow: 'hidden' }}>{s.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
             <div className="serif" style={{ fontSize: '2rem' }}>₹{s.price}</div>
             <button onClick={() => handleSeatBooking(s)} className="btn-gold" style={{ padding: '0.8rem 2rem' }}>BOOK NOW</button>
          </div>
        </div>
      ))}
    </div>
  );

  // 2. BEAUTY (F3) - Silk/Floral List with Round Elements
  const renderBeauty = () => (
    <div className="beauty-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {services.map(s => (
        <div key={s.id} className="glass-card hover-lift" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center', gap: '3rem', padding: '3rem', borderRadius: '40px', background: 'linear-gradient(to right, rgba(212,175,55,0.05), transparent)' }}>
           <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Flower size={40} color="var(--gold)" /></div></div>
           <div>
              <h3 className="serif" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{s.description}</p>
              <div style={{ marginTop: '1rem', color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '2px' }}><Clock size={12} /> {s.duration} MINUTES TREATMENT</div>
           </div>
           <div style={{ textAlign: 'right' }}>
              <div className="serif" style={{ fontSize: '3rem', marginBottom: '1rem' }}>₹{s.price}</div>
              <button onClick={() => handleSeatBooking(s)} className="btn-gold" style={{ width: '100%' }}>SELECT</button>
           </div>
        </div>
      ))}
    </div>
  );

  // 3. MEMBERSHIP (F4) - Refined Compact Tiered Cards (3-Column Grid)
  const renderMembership = () => (
    <div className="membership-tiers" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
      {services.map(s => (
        <div key={s.id} className="glass-card hover-lift" style={{ 
            padding: '3rem', 
            textAlign: 'center', 
            background: 'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent)', 
            border: '1px solid var(--gold)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem'
        }}>
           <div style={{ margin: '0 auto' }}><Award size={32} color="var(--gold)" /></div>
           <h3 className="serif" style={{ fontSize: '2rem', color: 'var(--gold)', letterSpacing: '2px' }}>{s.name.toUpperCase()}</h3>
           <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-cream)' }}>₹{s.price}</div>
           <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.6', height: '50px', overflow: 'hidden' }}>{s.description}</p>
           
           <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold' }}>✓ 30% EXCLUSIVE SAVINGS</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold' }}>✓ PRIORITY BOOKING STATUS</div>
           </div>
           
           <button onClick={() => handleSeatBooking(s)} className="btn-gold" style={{ marginTop: 'auto', padding: '1rem', width: '100%', fontSize: '0.9rem' }}>ACTIVATE PLAN</button>
        </div>
      ))}
    </div>
  );

  // 4. VIP BOOKING (F2) - Split-Suite Style in 2-Column Grid (UNIQUE & REFINED)
  const renderVIP = () => (
    <div className="vip-split-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '2.5rem' }}>
      {services.map(s => (
        <div key={s.id} className="glass-card hover-lift" style={{ 
            padding: '0', 
            overflow: 'hidden', 
            display: 'grid', 
            gridTemplateColumns: '1.5fr 0.5fr', 
            border: '1px solid var(--gold)', 
            background: 'rgba(255,255,255,0.01)',
            minHeight: '380px'
        }}>
           <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '1.5rem' }}>
                 <Lock size={16} /> VIP ESTATE SUITE
              </div>
              <h3 className="serif" style={{ fontSize: '2.8rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.7', flex: 1, marginBottom: '2rem' }}>{s.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                 <div className="serif" style={{ fontSize: '3.5rem', color: 'var(--gold)' }}>₹{s.price}</div>
                 <button onClick={() => handleSeatBooking(s)} className="btn-gold" style={{ padding: '1.2rem 3rem', borderRadius: '40px', fontSize: '1rem' }}>
                   BOOK SUITE
                 </button>
              </div>
           </div>
           <div style={{ background: 'rgba(212,175,55,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="floating"><Crown size={60} color="var(--gold)" style={{ opacity: 0.3 }} /></div>
           </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="services-page-elite fade-in" style={{ padding: '2rem' }}>
      <header className="glass-card" style={{ padding: '5rem 4rem', marginBottom: '4rem', borderTop: '4px solid var(--gold)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent)' }}>
         <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
               <ShieldCheck size={18} /> THE ESTATE COLLECTION
            </div>
            <h1 className="serif gradient-text" style={{ fontSize: '5rem', margin: 0, letterSpacing: '-2px' }}>
               LUXURY <span style={{ color: 'var(--text-cream)' }}>SERVICES</span>
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', marginTop: '1rem', maxWidth: '600px' }}>Experience premium grooming, beauty, and relaxation across 4 floors of excellence.</p>
         </div>

         <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '60px', border: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
            {segments.map(s => {
               const isActive = activeSegment === s.id;
               return (
                  <button key={s.id} onClick={() => setActiveSegment(s.id)} style={{
                        padding: '1.5rem 3rem', borderRadius: '40px', border: 'none', background: isActive ? 'var(--gold)' : 'transparent', color: isActive ? 'var(--bg-dark)' : 'var(--text-cream)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '2px', cursor: 'pointer', transition: '0.4s', display: 'flex', alignItems: 'center', gap: '12px'
                  }}>{s.icon} {s.name}</button>
               );
            })}
         </div>
      </header>

      <div className="portal-container" style={{ minHeight: '600px', marginBottom: '10rem' }}>
         {/* 💍 RE-POSITIONED & RE-SIZED FLOOR NUMBER */}
         <div style={{ marginBottom: '8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6rem' }}>
               <div className="serif" style={{ fontSize: '14rem', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '0rem 3rem', borderRadius: '30px', lineHeight: 1, fontWeight: 'bold', pointerEvents: 'none' }}>
                  0{segments.find(s => s.id === activeSegment).floor}
               </div>
               <div style={{ textAlign: 'left' }}>
                  <h2 className="serif" style={{ fontSize: '4.5rem', margin: 0, lineHeight: 1, letterSpacing: '-1px' }}>FLOOR PORTAL</h2>
                  <p style={{ color: 'var(--text-dim)', letterSpacing: '10px', margin: 0, marginTop: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>{segments.find(s => s.id === activeSegment).label.toUpperCase()}</p>
               </div>
            </div>
         </div>

         {loading ? (
            <div style={{ textAlign: 'center', padding: '10rem' }}>
               <div className="pulse-gold" style={{ marginBottom: '2rem' }}><Sparkles size={50} color="var(--gold)" /></div>
               <p style={{ color: 'var(--gold)', letterSpacing: '4px' }}>ACCESSING DATABASE...</p>
            </div>
         ) : (
            <div className="fade-in">
               {activeSegment === 'common' && renderGeneral()}
               {activeSegment === 'female' && renderBeauty()}
               {activeSegment === 'subscription' && renderMembership()}
               {activeSegment === 'advance' && renderVIP()}
            </div>
         )}
      </div>

      <section style={{ padding: '8rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '5rem' }}>THE <span style={{ color: 'var(--gold)' }}>EXCELLENCE</span> GUARANTEE</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', maxWidth: '1400px', margin: '0 auto' }}>
           <div><ShieldCheck size={40} color="var(--gold)" /> <h4>TRUST</h4></div>
           <div><Smartphone size={40} color="var(--gold)" /> <h4>SPEED</h4></div>
           <div><Layers size={40} color="var(--gold)" /> <h4>LEVELS</h4></div>
           <div><Sparkles size={40} color="var(--gold)" /> <h4>LUXURY</h4></div>
        </div>
      </section>
    </div>
  );
};

export default Services;