import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Shield, Users, Briefcase } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [floor, setFloor] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await signup(username, email, password, role, floor);
      }
      navigate('/');
    } catch (err) {
      alert("Authentication failed. Ensure your choice matches the elite standards.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in-up" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '4rem 3rem' }}>
        <h1 className="serif gradient-text" style={{ fontSize: '3rem', margin: '0 0 1rem 0', textAlign: 'center' }}>
          {isLogin ? "LUXURY ACCESS" : "JOIN THE ATELIER"}
        </h1>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '2.5rem' }}>
          {isLogin ? "Authenticate to resume your excellence." : "Select your role and begin your journey."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>USERNAME</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <UserIcon size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--gold)' }} />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem 3rem', color: 'var(--text-cream)', borderRadius: '15px', width: '100%' }} />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>EMAIL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--gold)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem 3rem', color: 'var(--text-cream)', borderRadius: '15px', width: '100%' }} />
                </div>
              </div>

              <div className="role-selector" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setRole('customer')} className="btn-gold" style={{ flex: 1, padding: '0.8rem', opacity: role === 'customer' ? 1 : 0.4 }}><Users size={16} /> CLIENT</button>
                <button type="button" onClick={() => setRole('staff')} className="btn-gold" style={{ flex: 1, padding: '0.8rem', opacity: role === 'staff' ? 1 : 0.4 }}><Briefcase size={16} /> WORKER</button>
                <button type="button" onClick={() => setRole('admin')} className="btn-gold" style={{ flex: 1, padding: '0.8rem', opacity: role === 'admin' ? 1 : 0.4 }}><Shield size={16} /> ADMIN</button>
              </div>

              {role === 'staff' && (
                <div className="input-group slide-in" style={{ marginTop: '1rem' }}>
                   <label style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>ASSIGNED FLOOR (1-4)</label>
                   <input type="number" min="1" max="4" value={floor} onChange={(e) => setFloor(parseInt(e.target.value))} required style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold)', padding: '1rem', color: 'var(--text-cream)', borderRadius: '15px', width: '100%' }} />
                </div>
              )}
            </>
          )}

          <div className="input-group">
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>PASSWORD</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--gold)' }} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem 3rem', color: 'var(--text-cream)', borderRadius: '15px', width: '100%' }} />
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ padding: '1.2rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? "AUTHENTICATING..." : isLogin ? "LOG IN" : "ESTABLISH ACCOUNT"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            {isLogin ? "New to the atelier?" : "Already established?"} 
            <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem' }}>{isLogin ? "Join Now" : "Log In"}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
