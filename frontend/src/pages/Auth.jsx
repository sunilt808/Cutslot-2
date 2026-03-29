import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, Shield, Award, Users, BookOpen, Clock, Crown, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        await signup(username, email, password);
      }
      navigate('/');
    } catch (err) {
      alert("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 0' }}>
      <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '4rem 3rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        <h1 className="serif gradient-text" style={{ fontSize: '3rem', margin: '0 0 1rem 0', textAlign: 'center' }}>
          {isLogin ? "WELCOME BACK" : "JOIN THE CIRCLE"}
        </h1>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '2.5rem' }}>
          {isLogin ? "Login to access your luxury profile." : "Experience elite grooming rituals today."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '1px' }}>USERNAME</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <UserIcon size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--gold)' }} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username" 
                required
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem 1rem 1rem 3rem', color: 'var(--text-cream)', borderRadius: '15px', outline: 'none', width: '100%' }} 
              />
            </div>
          </div>

          {!isLogin && (
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '1px' }}>EMAIL</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--gold)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address" 
                  required
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem 1rem 1rem 3rem', color: 'var(--text-cream)', borderRadius: '15px', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
          )}

          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold', letterSpacing: '1px' }}>PASSWORD</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--gold)' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure password" 
                required
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem 1rem 1rem 3rem', color: 'var(--text-cream)', borderRadius: '15px', outline: 'none', width: '100%' }} 
              />
            </div>
          </div>

          <button type="submit" className="btn-gold" style={{ padding: '1.2rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? "AUTHENTICATING..." : isLogin ? "LOG IN" : "SIGN UP"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account?" : "Already a member?"} 
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'transparent', border: 'none', color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '0.5rem', textDecoration: 'underline' }}
            >
              {isLogin ? "Register Now" : "Log In Here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
