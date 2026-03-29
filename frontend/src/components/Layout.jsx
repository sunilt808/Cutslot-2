import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Scissors, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar glass-card" style={{ borderRadius: '0 0 20px 20px', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'fixed', top: 0, width: '100%', zindex: 1000 }}>
      <div className="logo serif" style={{ fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Scissors size={28} />
        LUMIÈRE <span style={{ color: 'var(--text-cream)' }}>ATELIER</span>
      </div>

      <div className="nav-links" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-cream)', fontWeight: '500', transition: 'var(--transition)' }}>HOME</Link>
        <Link to="/floors" style={{ textDecoration: 'none', color: 'var(--text-cream)', fontWeight: '500' }}>FLOORS</Link>
        {user?.role === 'admin' && <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--gold)', fontWeight: '600' }}>ADMIN</Link>}
        {user?.role === 'staff' && <Link to="/staff" style={{ textDecoration: 'none', color: 'var(--gold)', fontWeight: '600' }}>WORKER</Link>}
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
          {user ? (
            <>
              <Link to="/profile" className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', transition: 'var(--transition)' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.username}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>{user.loyalty_points} PTS</div>
                </div>
                <div style={{ background: 'var(--gold-glow)', padding: '5px', borderRadius: '50%' }}>
                  <User size={20} color="var(--gold)" />
                </div>
              </Link>
              <button onClick={logout} className="btn-gold" style={{ padding: '0.5rem', borderRadius: '50%', background: 'transparent', border: 'none' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-gold">ENROLL</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', position: 'relative' }}>
      <Navbar />
      <main style={{ padding: '2rem 5%' }}>
        {children}
      </main>
      
      <footer style={{ marginTop: '5rem', padding: '3rem 5%', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <div className="serif" style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--gold)' }}>✨ LUMIÈRE Atelier – CutSlot ✨</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>&copy; 2024 Luxury Salon Ecosystem. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
