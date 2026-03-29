import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Award, Users, BookOpen, Clock, Crown, Sparkles, Zap, Smartphone, Layers, Layout, HandMetal, Heart, ArrowRight, Star, Scissors, CheckCircle, ShieldCheck, Armchair, Flower, MapPin, Tablet } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleBookNow = () => {
    navigate('/services');
  };

  const images = [
    "/assets/royal_atelier_interior.png",
    "/assets/luxury_salon_hero.png",
    "/assets/elite_stylist_hands.png",
    "/assets/elite_facial_ritual.png",
    "/assets/vip_lumiere_seat_gold.png"
  ];

  const boutiqueCards = [
    { title: "LUXURY FLOORS", img: "/assets/royal_atelier_interior.png", desc: "4 premium floors for hair and beauty." },
    { title: "EXPERT STYLISTS", img: "/assets/elite_stylist_hands.png", desc: "Our top-rated 1% hair experts." },
    { title: "FACIAL CARE", img: "/assets/elite_facial_ritual.png", desc: "Premium skin treatments for everyone." },
    { title: "PRIVATE ROOMS", img: "/assets/vip_lumiere_seat_gold.png", desc: "VIP privacy for a comfortable experience." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  // Double the cards for seamless marquee effect
  const marqueeCards = [...boutiqueCards, ...boutiqueCards];

  return (
    <div className="landing-page-elite fade-in">
      {/* 1. HERO AREA */}
      <section className="hero-section" style={{ padding: '8rem 0', textAlign: 'center', background: 'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2rem' }}>
          <div className="pulse-gold" style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '50%' }}><Sparkles color="var(--gold)" size={28} /></div>
          <div className="pulse-gold" style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '50%' }}><Crown color="var(--gold)" size={28} /></div>
          <div className="pulse-gold" style={{ background: 'var(--gold-glow)', padding: '15px', borderRadius: '50%' }}><ShieldCheck color="var(--gold)" size={28} /></div>
        </div>

        <h1 className="serif gradient-text" style={{ fontSize: '7.5rem', lineHeight: '0.9', margin: 0, fontWeight: 'bold', letterSpacing: '-2px' }}>
          CUT<span style={{ color: 'var(--text-cream)' }}>SLOT</span>
        </h1>

        <p className="serif" style={{ fontSize: '2.8rem', color: 'var(--gold)', letterSpacing: '12px', marginTop: '1.5rem', textTransform: 'uppercase', opacity: 0.9 }}>
          LUXURY SALON
        </p>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem', marginBottom: '4rem' }}>
          <button onClick={handleBookNow} className="btn-gold" style={{ padding: '1.8rem 5rem', fontSize: '1.4rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            CLICK HERE TO BOOK YOUR SEAT <ArrowRight size={24} />
          </button>
        </div>

        {/* SINGLE AUTOMATIC SLIDING HERO CARD */}
        <div className="hero-sliding-card" style={{ maxWidth: '1000px', margin: '0 auto', boxShadow: '0 50px 100px rgba(0,0,0,0.8)', borderRadius: '30px', overflow: 'hidden', border: '1px solid var(--gold)', position: 'relative' }}>
          <img src={images[currentImgIndex]} alt="Luxury Hero" style={{ width: '100%', height: '550px', objectFit: 'cover', transition: 'filter 1s ease-in-out, transform 1s ease-in-out', animation: 'fadeIn 1s' }} />
          <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', padding: '3rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', textAlign: 'left' }}>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>FEATURED GALLERY</div>
            <h3 className="serif" style={{ fontSize: '3.5rem', margin: 0 }}>PREMIUM INTERIORS & SERVICES</h3>
          </div>
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '0.5rem' }}>
            {images.map((_, i) => (
              <div key={i} style={{ width: '30px', height: '4px', background: i === currentImgIndex ? 'var(--gold)' : 'rgba(255,255,255,0.2)', borderRadius: '2px', transition: '0.3s' }}></div>
            ))}
          </div>
        </div>
      </section>

      {/* 1.5 ABOUT THE APP */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <h2 className="serif" style={{ fontSize: '4rem', marginBottom: '3rem' }}>
          ABOUT <span style={{ color: 'var(--gold)' }}>THE APP</span>
        </h2>
        <p style={{ maxWidth: '900px', margin: '0 auto', fontSize: '1.6rem', color: 'var(--text-dim)', lineHeight: '2.5rem' }}>
          CUTSLOT is your gateway to luxury hair and beauty experiences. Book appointments seamlessly, explore premium services across multiple floors, enjoy expert stylists, and unlock exclusive membership benefits – all from the comfort of your device.
        </p>
        <div style={{ marginTop: '3rem' }}>
          <button onClick={handleBookNow} className="btn-gold" style={{ padding: '1.5rem 5rem', fontSize: '1.2rem', borderRadius: '50px' }}>
            EXPLORE THE APP
          </button>
        </div>
      </section>

      {/* 2. AUTOMATIC MARQUEE CAROUSEL */}
      <section style={{ overflow: 'hidden', padding: '4rem 0' }}>
        <div className="marquee-container">
          <div className="marquee-content">
            {marqueeCards.map((card, idx) => (
              <div key={idx} className="glass-card" style={{ minWidth: '400px', padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transition: '0.5s', flexShrink: 0 }}>
                <img src={card.img} alt={card.title} style={{ width: '100%', height: '300px', objectFit: 'cover', opacity: 0.8 }} />
                <div style={{ padding: '2.5rem', textAlign: 'left' }}>
                  <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{card.title}</h3>
                  <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES OVERVIEW */}
      <section style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.01)' }}>
        <h2 className="serif" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '2rem' }}>
          OUR <span style={{ color: 'var(--gold)' }}>CATEGORIES</span>
        </h2>
        <p style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto 5rem', fontSize: '1.6rem', color: 'var(--text-dim)', lineHeight: '2.2rem' }}>
          Discover our premium services designed for every hair and beauty need. Each category ensures luxury, expert care, and an unforgettable experience.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '4rem', borderRight: '6px solid var(--gold)', background: 'rgba(212,175,55,0.02)' }}>
            <Scissors size={40} color="var(--gold)" />
            <h3 className="serif" style={{ fontSize: '2.5rem', marginTop: '2rem' }}>GENERAL</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Modern hair cutting for everyone.</p>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', marginTop: '1.5rem', letterSpacing: '4px' }}>FROM ₹1200</div>
          </div>
          <div className="glass-card" style={{ padding: '4rem', borderRight: '6px solid var(--gold)', background: 'linear-gradient(rgba(212,175,55,0.05), transparent)' }}>
            <Flower size={40} color="var(--gold)" />
            <h3 className="serif" style={{ fontSize: '2.5rem', marginTop: '2rem' }}>BEAUTY</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Expert beauty and skin treatments.</p>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', marginTop: '1.5rem', letterSpacing: '4px' }}>FROM ₹4500</div>
          </div>
          <div className="glass-card" style={{ padding: '4rem', borderRight: '6px solid var(--gold)', background: 'rgba(212,175,55,0.02)' }}>
            <Crown size={40} color="var(--gold)" />
            <h3 className="serif" style={{ fontSize: '2.5rem', marginTop: '2rem' }}>MEMBERSHIP</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Get 30% extra value with our plans.</p>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', marginTop: '1.5rem', letterSpacing: '4px' }}>FROM ₹15000</div>
          </div>
        </div>
      </section>

      {/* 4. APP FEATURES */}
      <section style={{ padding: '8rem 2rem' }}>
        <div className="glass-card" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', textAlign: 'center', padding: '5rem' }}>
          <div>
            <Zap size={32} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <h4 className="serif" style={{ fontSize: '2.5rem' }}>100%</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '3px' }}>ON TIME</p>
          </div>
          <div>
            <Tablet size={32} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <h4 className="serif" style={{ fontSize: '2.5rem' }}>EASY</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '3px' }}>BOOKING PROCESS</p>
          </div>
          <div>
            <Layers size={32} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <h4 className="serif" style={{ fontSize: '2.5rem' }}>4 FLOORS</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '3px' }}>LUXURY SPACE</p>
          </div>
          <div>
            <Star size={32} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
            <h4 className="serif" style={{ fontSize: '2.5rem' }}>5 STAR</h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '3px' }}>SERVICES</p>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section style={{ padding: '10rem 2rem', textAlign: 'center' }}>
        <div className="glass-card pulse-gold" style={{ padding: '8rem', maxWidth: '1200px', margin: '0 auto', border: '1px solid var(--gold)', boxShadow: '0 0 100px rgba(212,175,55,0.1)' }}>
          <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '3rem' }}>READY TO <span style={{ color: 'var(--gold)' }}>LOOK YOUR BEST?</span></h2>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-dim)', marginBottom: '4rem' }}>Experience the best hair and beauty care in the city.</p>
          <button onClick={handleBookNow} className="btn-gold" style={{ padding: '1.8rem 6rem', fontSize: '1.3rem', borderRadius: '50px' }}>BOOK AN APPOINTMENT</button>
        </div>
      </section>
    </div>
  );
};

export default Landing;