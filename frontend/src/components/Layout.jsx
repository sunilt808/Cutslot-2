import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors, User as UserIcon, LogOut, Shield, Briefcase, Calendar, Home, Crown, Armchair, Sparkles, Wallet, History, TrendingUp, Settings, Sun, Moon, Database } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`layout-root ${theme}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'var(--transition)' }}>
      
      {/* 🚀 NAVBAR */}
      <nav className="navbar glass-card" style={{ 
        margin: '1.5rem 2rem', 
        padding: '0.8rem 2.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'sticky', 
        top: '1rem', 
        zIndex: 1000,
        borderRadius: '50px',
        border: '1px solid var(--glass-border)',
        background: theme === 'dark' ? 'rgba(5, 4, 8, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(15px)'
      }}>
        
        {/* ✂️ BRAND */}
        <div className="logo-group">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="logo-icon pulse-gold" style={{ background: 'var(--gold)', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scissors color="black" size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span className="serif" style={{ fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '4px', color: 'var(--text-cream)', lineHeight: 1 }}>CutSlot</span>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>
                  <Armchair size={10} /> LUXURY SALON <Sparkles size={10} />
               </div>
            </div>
          </Link>
        </div>

        {/* 🎖️ NAVIGATION */}
        <div className="nav-links" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '40px', border: '1px solid var(--glass-border)' }}>
          <Link to="/" className={`nav-button ${isActive('/') ? 'active' : ''}`} style={{ 
            textDecoration: 'none', padding: '10px 18px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/') ? 'var(--gold)' : 'transparent', fontSize: '0.8rem', fontWeight: 'bold'
          }}>
            <Home size={14} /> HOME
          </Link>
          
          <Link to="/services" className={`nav-button ${isActive('/services') ? 'active' : ''}`} style={{ 
            textDecoration: 'none', padding: '10px 18px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/services') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/services') ? 'var(--gold)' : 'transparent', fontSize: '0.8rem', fontWeight: 'bold'
          }}>
            <Scissors size={14} /> SERVICES
          </Link>

          {user && (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className={`nav-button ${isActive('/admin') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/admin') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/admin') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Shield size={14} /> DASHBOARD
                  </Link>
                  <Link to="/admin/workers" className={`nav-button ${isActive('/admin/workers') || isActive('/admin/credentials') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/admin/workers') || isActive('/admin/credentials') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/admin/workers') || isActive('/admin/credentials') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Briefcase size={14} /> STAFF
                  </Link>
                  <Link to="/admin/services" className={`nav-button ${isActive('/admin/services') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/admin/services') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/admin/services') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Database size={14} /> INVENTORY
                  </Link>
                  <Link to="/admin/revenue" className={`nav-button ${isActive('/admin/revenue') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/admin/revenue') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/admin/revenue') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <TrendingUp size={14} /> REVENUE
                  </Link>
                </>
              )}
              {user.role === 'staff' && (
                <>
                  <Link to="/staff" className={`nav-button ${isActive('/staff') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/staff') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/staff') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Briefcase size={14} /> DASHBOARD
                  </Link>
                  <Link to="/staff/queue" className={`nav-button ${isActive('/staff/queue') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/staff/queue') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/staff/queue') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Clock size={14} /> QUEUE
                  </Link>
                  <Link to="/staff/performance" className={`nav-button ${isActive('/staff/performance') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/staff/performance') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/staff/performance') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <TrendingUp size={14} /> PERFORMANCE
                  </Link>
                </>
              )}
              {user.role === 'customer' && (
                <>
                  <Link to="/profile" className={`nav-button ${isActive('/profile') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/profile') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/profile') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <UserIcon size={14} /> PROFILE
                  </Link>
                  <Link to="/booking" className={`nav-button ${isActive('/booking') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/booking') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/booking') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Calendar size={14} /> BOOKING
                  </Link>
                  <Link to="/profile/wallet" className={`nav-button ${isActive('/profile/wallet') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/profile/wallet') ? 'var(--bg-dark)' : 'var(--text-cream)', background: isActive('/profile/wallet') ? 'var(--gold)' : 'transparent', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    <Wallet size={14} /> REVENUE
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* 💍 ACTIONS */}
        <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          <button onClick={toggleTheme} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--gold)'
          }}>
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user && user.role === 'admin' && (
            <Link to="/admin/profile" className={`nav-button ${isActive('/admin/profile') ? 'active' : ''}`} style={{ textDecoration: 'none', padding: '10px 15px', borderRadius: '30px', background: isActive('/admin/profile') ? 'var(--gold)' : 'rgba(255,255,255,0.03)', color: isActive('/admin/profile') ? 'var(--bg-dark)' : 'var(--text-cream)' }}>
               <UserIcon size={18} />
            </Link>
          )}

          {user ? (
            <>
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', background: 'rgba(212,175,55,0.05)', padding: '5px 20px', borderRadius: '40px', border: '1px solid var(--gold-glow)' }}>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--gold)', letterSpacing: '1px' }}>{user.username.toUpperCase()}</span>
                   <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>{user.role.toUpperCase()}</span>
                </div>
                <button onClick={handleLogout} className="btn-logout" style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn-gold" style={{ padding: '0.8rem 2rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.8rem' }}>
              LOGIN
            </Link>
          )}
        </div>
      </nav>

      <main className="content-container" style={{ flex: 1 }}>
        {children}
      </main>

      <footer className="glass-card" style={{ margin: '4rem 2rem 1.5rem 2rem', padding: '5rem', textAlign: 'center', borderRadius: '40px', borderTop: '1px solid var(--gold-glow)' }}>
        <div className="serif" style={{ fontSize: '2rem', color: 'var(--gold)', letterSpacing: '6px', marginBottom: '1rem' }}>CUTSLOT</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem', opacity: 0.5 }}>
           <Scissors size={20} /> <Armchair size={20} /> <Crown size={20} />
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', letterSpacing: '2px' }}>EXCELLENCE IN HAIR & BEAUTY &copy; 2026</p>
      </footer>
    </div>
  );
};

export default Layout;
