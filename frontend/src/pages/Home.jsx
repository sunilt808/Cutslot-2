import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Shield, Award, Users, BookOpen, Clock, Crown, Sparkles } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: <Users size={28} />, label: "Clients Served", value: "10,000+" },
    { icon: <Award size={28} />, label: "Awards Won", value: "25+" },
    { icon: <Shield size={28} />, label: "Floors", value: "4 Premium" },
    { icon: <Clock size={28} />, label: "Experience", value: "15 Years" }
  ];

  const features = [
    { title: "Floor 1: Common", desc: "Premium haircuts and wellness for the modern male.", icon: <Star size={24} /> },
    { title: "Floor 2: General", desc: "Expert massage, facials, and grooming for all.", icon: <Shield size={24} /> },
    { title: "Floor 3: Female-only", desc: "Exclusive spa and styling rituals for women.", icon: <Sparkles size={24} /> },
    { title: "Floor 4: Premium", desc: "Elite membership, luxury treatments, and VIP perks.", icon: <Crown size={24} /> }
  ];

  return (
    <div className="home-container fade-in-up" style={{ textAlign: 'center' }}>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', fontWeight: 'bold', lineHeight: '1', maxWidth: '1000px', margin: '0 auto' }}>
          ELEVATE YOUR <br /> LUXURY EXPERIENCE
        </h1>
        <p className="description" style={{ fontSize: '1.25rem', color: 'var(--text-dim)', maxWidth: '700px', margin: '1rem auto' }}>
          Step into a world of timeless elegance across four floors of dedicated excellence. 
          Discover precision grooming and holistic wellness rituals tailored to perfection.
        </p>
        <div className="hero-ctas" style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
          <button onClick={() => navigate('/floors')} className="btn-gold" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem' }}>
            <BookOpen size={20} /> BOOK YOUR SESSION
          </button>
          <button className="btn-gold" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem', border: '1px solid var(--text-dim)', color: 'var(--text-dim)' }}>
            EXPLORE THE ATELIER
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '4rem 0' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2.5rem' }}>
            <div style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div className="serif" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stat.value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Floor Overview */}
      <section className="floor-overview" style={{ padding: '5rem 0' }}>
        <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '3rem', letterSpacing: '1px' }}>FLOOR-WISE <span style={{ color: 'var(--gold)' }}>SEGMENTATION</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--gold)' }}>{feature.icon}</div>
                <div style={{ fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--gold-glow)' }}>0{idx + 1}</div>
              </div>
              <div>
                <h3 className="serif" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
              <button 
                onClick={() => navigate('/floors', { state: { floor: idx + 1 } })}
                className="btn-gold" 
                style={{ width: '100%', borderRadius: '10px' }}
              >
                VIEW SERVICES
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Subscriptions CTA */}
      <section className="glass-card sub-cta" style={{ margin: '4rem 0', padding: '5rem', background: 'linear-gradient(rgba(212,175,55,0.05), rgba(18,16,22,0.9))' }}>
        <h2 className="serif gradient-text" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>EXQUISITE PRIVILEGES</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto 2rem auto' }}>
          Join the LUMIÈRE Circle for exclusive benefits, priority bookings, and bespoke wellness treatments across all floors.
        </p>
        <button className="btn-gold" style={{ padding: '1.2rem 3rem' }}>ENROLL IN SUBSCRIPTION</button>
      </section>
    </div>
  );
};

export default Home;
