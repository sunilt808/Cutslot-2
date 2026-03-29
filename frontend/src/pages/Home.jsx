import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Award, Users, BookOpen, Clock, Crown, Sparkles, Zap, Smartphone, Layers, Layout, HandMetal } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const algorithms = [
    { title: "Elite Slotting Algorithm", desc: "Our AI-driven backend optimizes service durations across all 4 floors to ensure zero wait time.", icon: <Zap size={28} /> },
    { title: "Floor-Wise Intelligence", desc: "Each floor operates on a dedicated queue system tailored for specific service categories.", icon: <Layers size={28} /> },
    { title: "Predictive Loyalty", desc: "Earn and track loyalty points using our tiered reward algorithm.", icon: <Award size={28} /> }
  ];

  const features = [
    { title: "Common Floor", desc: "Quick & Elite Grooming (Males)", icon: <HandMetal size={24} />, floor: 1 },
    { title: "Wellness Floor", desc: "Massages & Skin Care (Unisex)", icon: <Smartphone size={24} />, floor: 2 },
    { title: "Female Rituals", desc: "Exclusive Hair & Beauty (Females)", icon: <Sparkles size={24} />, floor: 3 },
    { title: "High-End Elite", desc: "VIP Subscriptions & Private Stylists", icon: <Crown size={24} />, floor: 4 }
  ];

  return (
    <div className="landing-container fade-in-up">
      {/* Hero Section */}
      <section className="hero" style={{ padding: '8rem 0', textAlign: 'center', background: 'radial-gradient(circle at center, rgba(212,175,55,0.05), transparent)' }}>
         <h1 className="serif gradient-text" style={{ fontSize: '5rem', lineHeight: '1.2', margin: 0 }}>LUMIÈRE <span style={{ color: 'var(--text-cream)' }}>ATELIER</span></h1>
         <p className="serif" style={{ fontSize: '2rem', color: 'var(--gold)', letterSpacing: '4px', marginTop: '1rem' }}>ELEVATED SYSTEM ARCHITECTURE</p>
         <p style={{ maxWidth: '800px', margin: '2rem auto', fontSize: '1.2rem', color: 'var(--text-dim)', lineHeight: '1.8' }}>
            Experience the industry's first floor-wise elite luxury salon management system. 
            Powered by intelligent allocation algorithms and advanced role-based dashboards.
         </p>
         <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem' }}>
            <button onClick={() => navigate('/auth')} className="btn-gold" style={{ padding: '1.5rem 3rem', fontSize: '1.1rem' }}>ENROLL IN ATELIER</button>
            <button onClick={() => navigate('/floors')} className="btn-gold" style={{ background: 'transparent', border: '1px solid var(--gold)', padding: '1.5rem 3rem', fontSize: '1.1rem' }}>EXPLORE SERVICES</button>
         </div>
      </section>

      {/* Stats Algorithm Grid */}
      <section style={{ padding: '5rem 0' }}>
         <h2 className="serif" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>CORE <span style={{ color: 'var(--gold)' }}>INTELLIGENCE</span></h2>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            {algorithms.map((alg, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--glass-border)' }}>
                 <div style={{ color: 'var(--gold)', background: 'var(--gold-glow)', padding: '1.5rem', borderRadius: '50%' }}>{alg.icon}</div>
                 <h3 className="serif" style={{ fontSize: '1.8rem' }}>{alg.title}</h3>
                 <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{alg.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Floor Segmentation */}
      <section style={{ padding: '5rem 0' }}>
         <h2 className="serif" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>FLOOR-WISE <span style={{ color: 'var(--gold)' }}>SEGMENTATION</span></h2>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 2fr)', gap: '2rem' }}>
            {features.map((f, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3rem', cursor: 'pointer', transition: '0.3s' }} onClick={() => navigate('/floors', { state: { floor: f.floor } })}>
                 <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--gold)' }}>{f.icon}</div>
                    <div>
                       <h3 className="serif" style={{ fontSize: '2rem', margin: 0 }}>{f.title}</h3>
                       <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{f.desc}</p>
                    </div>
                 </div>
                 <div className="serif" style={{ fontSize: '3rem', opacity: 0.1 }}>0{f.floor}</div>
              </div>
            ))}
         </div>
      </section>

      {/* Dashboard Previews */}
      <section style={{ padding: '8rem 0', background: 'rgba(212,175,55,0.02)', textAlign: 'center' }}>
         <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '2rem' }}>ROLE-BASED <span style={{ color: 'var(--gold)' }}>EXCELLENCE</span></h2>
         <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto 4rem auto' }}>Our ecosystem provides tailored experiences for every stakeholder, from administrative oversight to specialized worker terminals.</p>
         <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <div className="glass-card" style={{ padding: '2rem', flex: 1 }}>
               <Shield size={32} color="var(--gold)" />
               <h3 className="serif">ADMIN</h3>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Revenue, Statistics, Reviews, & Logs.</p>
            </div>
            <div className="glass-card" style={{ padding: '2rem', flex: 1 }}>
               <Users size={32} color="var(--gold)" />
               <h3 className="serif">WORKER</h3>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Personal Queue & Performance Tracking.</p>
            </div>
            <div className="glass-card" style={{ padding: '2rem', flex: 1 }}>
               <Crown size={32} color="var(--gold)" />
               <h3 className="serif">CLIENT</h3>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Wallet, History, & Loyalty Points.</p>
            </div>
         </div>
      </section>

      {/* Subscription CTA */}
      <section style={{ padding: '8rem 0', textAlign: 'center' }}>
         <div className="glass-card" style={{ padding: '6rem', background: 'linear-gradient(rgba(212,175,55,0.05), transparent)' }}>
            <h2 className="serif gradient-text" style={{ fontSize: '4rem', marginBottom: '2rem' }}>ESTABLISH YOUR LEGACY</h2>
            <p style={{ fontSize: '1.4rem', color: 'var(--text-cream)', maxWidth: '800px', margin: '0 auto 3rem auto' }}>Subscribe starting at ₹2000/mo for access to elite floors and private artisan sessions.</p>
            <button className="btn-gold" style={{ padding: '1.5rem 4rem', fontSize: '1.2rem' }}>DISCOVER MEMBERSHIPS</button>
         </div>
      </section>
    </div>
  );
};

export default Home;
