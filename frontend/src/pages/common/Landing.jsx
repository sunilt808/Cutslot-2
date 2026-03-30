import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Award, Users, BookOpen, Clock, Crown, Sparkles, Zap, Smartphone, Layers, Layout, HandMetal, Heart, ArrowRight, Star, Scissors, CheckCircle, ShieldCheck, Armchair, Flower, MapPin, Tablet, Trophy, Gem, Moon } from 'lucide-react';

const Landing = () => {
  const { api } = useAuth();
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

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get('/reviews/')
      .then(res => setReviews(res.data.slice(0, 3)))
      .catch(err => console.error("Elite testimonials unavailable at this time.", err));
  }, [api]);

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
              <div key={idx} className="glass-card" style={{ minWidth: '400px', padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', transition: '0.5s', flexShrink: 0 }}>
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

      {/* 2.5 SERVICE CIRCLE MARQUEE (20+ SERVICES) */}
      <section style={{ padding: '4rem 0', background: 'var(--glass-tint)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', overflow: 'hidden' }}>
        <div style={{ color: 'var(--gold)', textAlign: 'center', letterSpacing: '8px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '3rem' }}>CURATED CUTSLOT SERVICES</div>
        <div className="marquee-container">
          <div className="marquee-content" style={{ gap: '4rem', animationDuration: '60s' }}>
            {[
              { name: "ROYAL BEARD SCULPT", icon: <Scissors size={20} /> },
              { name: "GOLDEN GLOW FACIAL", icon: <Sparkles size={20} /> },
              { name: "ELITE KERATIN INFUSION", icon: <Zap size={20} /> },
              { name: "SILVER SCISSORS CUT", icon: <Scissors size={20} /> },
              { name: "DIAMOND SKIN POLISH", icon: <Gem size={20} /> },
              { name: "DETOX SCALP RITUAL", icon: <Heart size={20} /> },
              { name: "IMPERIAL PEDICURE", icon: <Flower size={20} /> },
              { name: "AESTHETIC EYE LIFT", icon: <Star size={20} /> },
              { name: "SILK THREADING", icon: <Shield size={20} /> },
              { name: "DEEP TISSUE ESCAPE", icon: <HandMetal size={20} /> },
              { name: "ARTISAN HAIR COLOR", icon: <Layers size={20} /> },
              { name: "MIDNIGHT SKIN CLARITY", icon: <Moon size={20} /> },
              { name: "PLATINUM BRIDAL", icon: <Crown size={20} /> },
              { name: "GROOM'S ELITE PREP", icon: <Trophy size={20} /> },
              { name: "OZONE HAIR THERAPY", icon: <Zap size={20} /> },
              { name: "MOROCCAN CLAY", icon: <Flower size={20} /> },
              { name: "CRYO-FACIAL BOOST", icon: <Sparkles size={20} /> },
              { name: "VELVET SHAVE", icon: <Scissors size={20} /> },
              { name: "PRECISION HIGH-FADE", icon: <Scissors size={20} /> },
              { name: "FOOT REFLEXOLOGY", icon: <Heart size={20} /> }
            ].concat([
              { name: "ROYAL BEARD SCULPT", icon: <Scissors size={20} /> },
              { name: "GOLDEN GLOW FACIAL", icon: <Sparkles size={20} /> },
              { name: "ELITE KERATIN INFUSION", icon: <Zap size={20} /> },
              { name: "SILVER SCISSORS CUT", icon: <Scissors size={20} /> },
              { name: "DIAMOND SKIN POLISH", icon: <Gem size={20} /> },
              { name: "DETOX SCALP RITUAL", icon: <Heart size={20} /> },
              { name: "IMPERIAL PEDICURE", icon: <Flower size={20} /> },
              { name: "AESTHETIC EYE LIFT", icon: <Star size={20} /> },
              { name: "SILK THREADING", icon: <Shield size={20} /> },
              { name: "DEEP TISSUE ESCAPE", icon: <HandMetal size={20} /> },
              { name: "ARTISAN HAIR COLOR", icon: <Layers size={20} /> },
              { name: "MIDNIGHT SKIN CLARITY", icon: <Moon size={20} /> },
              { name: "PLATINUM BRIDAL", icon: <Crown size={20} /> },
              { name: "GROOM'S ELITE PREP", icon: <Trophy size={20} /> },
              { name: "OZONE HAIR THERAPY", icon: <Zap size={20} /> },
              { name: "MOROCCAN CLAY", icon: <Flower size={20} /> },
              { name: "CRYO-FACIAL BOOST", icon: <Sparkles size={20} /> },
              { name: "VELVET SHAVE", icon: <Scissors size={20} /> },
              { name: "PRECISION HIGH-FADE", icon: <Scissors size={20} /> },
              { name: "FOOT REFLEXOLOGY", icon: <Heart size={20} /> }
            ]).map((s, idx) => (
              <div key={idx} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-cream)', opacity: 0.7 }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                  {s.icon}
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', letterSpacing: '2px' }}>{s.name}</span>
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

      {/* 3.5 ESTATE MEMBERSHIPS (SPECIAL SUBSCRIPTIONS) */}
      <section style={{ padding: '8rem 2rem', background: 'var(--bg-dark)', borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="serif" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          ATELIER <span style={{ color: 'var(--gold)' }}>MEMBERSHIPS</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '1.1rem', letterSpacing: '4px', marginBottom: '5rem' }}>UNLOCATED LUXURY BENEFITS</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
          {[
            { name: "SILVER", price: "₹10,000", benefits: ["20% OFF ALL RITUALS", "MONTHLY HAIR CARE", "FLEXIBLE SLOTS"], color: "#c0c0c0" },
            { name: "GOLD", price: "₹15,000", benefits: ["30% OFF ALL RITUALS", "VIP LOUNGE ACCESS", "PRIVATE STYLIST"], color: "var(--gold)" },
            { name: "ELITE", price: "₹25,000", benefits: ["50% OFF BEST RITUALS", "PRIORITY BOOKING", "PRODUCT CONCIERGE"], color: "#e5e4e2" },
            { name: "ROYAL", price: "₹50,000", benefits: ["UNLIMITED ACCESS", "DOORSTEP LUXURY", "PRIVATE ESTATE BOX"], color: "#ffab40" }
          ].map((tier, i) => (
            <div key={i} className="glass-card hover-lift" style={{ padding: '4rem 3rem', textAlign: 'center', border: `1px solid ${tier.color}33`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '4px', background: tier.color }}></div>
              <div className="serif" style={{ fontSize: '1.2rem', color: tier.color, letterSpacing: '6px', marginBottom: '1.5rem' }}>{tier.name}</div>
              <div className="serif" style={{ fontSize: '3.5rem', marginBottom: '2.5rem' }}>{tier.price}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
                {tier.benefits.map((b, j) => (
                  <div key={j} style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <ShieldCheck size={14} color={tier.color} /> {b}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/auth')} className="btn-gold" style={{ background: 'transparent', border: `1px solid ${tier.color}`, color: tier.color, width: '100%', padding: '1.2rem' }}>ELEVATE STATUS</button>
            </div>
          ))}
        </div>
      </section>

      {/* 3.6 EXCLUSIVE OFFERS */}
      <section style={{ padding: '8rem 2rem', borderTop: '1px solid var(--glass-border)', background: 'radial-gradient(circle at bottom left, rgba(212,175,55,0.05), transparent)' }}>
        <h2 className="serif" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          EXCLUSIVE <span style={{ color: 'var(--gold)' }}>OFFERS</span>
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '1.1rem', letterSpacing: '4px', marginBottom: '5rem' }}>LIMITED TIME ELITE DEALS</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div className="glass-card hover-lift" style={{ padding: '3rem', border: '1px solid var(--gold)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '-2.5rem', background: 'var(--gold)', color: 'var(--bg-dark)', padding: '0.5rem 3rem', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.8rem' }}>40% OFF</div>
            <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>GUEST SPECIAL</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Hair Ritual + Deep Facial Spa for first-time elite guests.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="serif" style={{ fontSize: '2.2rem', color: 'var(--gold)' }}>₹1,999</div>
              <button onClick={handleBookNow} className="btn-gold" style={{ padding: '0.8rem 1.5rem' }}>CLAIM</button>
            </div>
          </div>
          <div className="glass-card hover-lift" style={{ padding: '3rem', border: '1px solid var(--gold)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '-2.5rem', background: 'var(--gold)', color: 'var(--bg-dark)', padding: '0.5rem 3rem', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.8rem' }}>HOT DEAL</div>
            <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>BRIDAL COMBO</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Full Makeup + Hair Styling + Luxury Spa Experience.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="serif" style={{ fontSize: '2.2rem', color: 'var(--gold)' }}>₹12,499</div>
              <button onClick={handleBookNow} className="btn-gold" style={{ padding: '0.8rem 1.5rem' }}>CLAIM</button>
            </div>
          </div>
          <div className="glass-card hover-lift" style={{ padding: '3rem', border: '1px solid var(--gold)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '-2.5rem', background: 'var(--gold)', color: 'var(--bg-dark)', padding: '0.5rem 3rem', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.8rem' }}>MEMBERS ONLY</div>
            <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>WEEKEND SPA</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Unlimited weekend access to Floor 2 Wellness Rituals.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="serif" style={{ fontSize: '2.2rem', color: 'var(--gold)' }}>₹4,999</div>
              <button onClick={handleBookNow} className="btn-gold" style={{ padding: '0.8rem 1.5rem' }}>CLAIM</button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PUBLIC REVIEWS */}
      <section style={{ padding: '8rem 2rem', background: 'rgba(255,255,255,0.01)' }}>
        <h2 className="serif" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '4rem' }}>
          GUEST <span style={{ color: 'var(--gold)' }}>EXPERIENCES</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
          {reviews.length > 0 ? reviews.map((r, i) => (
            <div key={i} className="glass-card" style={{ padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '1.5rem' }}>
                {[...Array(r.rating)].map((_, j) => <Star key={j} size={16} fill="var(--gold)" color="var(--gold)" />)}
              </div>
              <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '0.8rem', display: 'flex', gap: '10px' }}>
                <span>{r.service_category?.toUpperCase() || "ELITE"}</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>{r.service_name?.toUpperCase() || "RITUAL"}</span>
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '2rem' }}>"{r.comment}"</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '2px', fontSize: '0.85rem' }}>{r.user_name || `GUEST #${r.user_id}`}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'normal' }}>for <span style={{ color: 'var(--gold)' }}>{r.worker_name}</span></div>
              </div>
            </div>
          )) : (
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', gridColumn: 'span 3' }}>No reviews yet. Be the first to share your experience!</p>
          )}
        </div>
      </section>

      {/* 4. LOYALTY PROGRAM */}
      <section style={{ padding: '8rem 2rem', background: 'var(--bg-dark)' }}>
        <div className="glass-card" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '5rem', padding: '5rem', border: '1px solid var(--gold)', borderRadius: '40px' }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>ELITE REWARDS</div>
            <h2 className="serif" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>BECOME A <span style={{ color: 'var(--gold)' }}>LOYAL GUEST</span></h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3rem' }}>
              Every month you visit the atelier, you accumulate **Loyalty points**.
              Once you complete **40 points**, you can unlock an **Exclusive 15% Discount** on your next premium ritual.
            </p>
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="serif" style={{ fontSize: '2.5rem', color: 'var(--gold)' }}>10</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>POINTS / VISIT</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="serif" style={{ fontSize: '2.5rem', color: 'var(--gold)' }}>40</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>FOR CLAIM</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="serif" style={{ fontSize: '2.5rem', color: 'var(--gold)' }}>15%</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>OFF RITUALS</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div className="pulse-gold" style={{ width: '300px', height: '300px', borderRadius: '50%', background: 'var(--gold-glow)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--gold)' }}>
              <Trophy size={120} color="var(--gold)" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. APP FEATURES */}
      <section style={{ padding: '8rem 2rem' }}>
        <div className="glass-card" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', textAlign: 'center', padding: '5rem' }}>
          {/* ... existing content ... */}
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
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '3px' }}>Services Real Time Review Based </p>
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