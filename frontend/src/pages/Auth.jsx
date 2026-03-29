import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Shield, Users, Briefcase, Zap, BadgeCheck, Smartphone, Phone, Heart, Eye, EyeOff, Layout } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [floor, setFloor] = useState(1);
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const nameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!nameRegex.test(username)) {
      alert("ERROR: Username must be 3-20 characters long and can only have letters, numbers, and underscores.");
      return;
    }

    if (!isLogin) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phoneRegex = /^[0-9]{10}$/; 
      
      if (!emailRegex.test(email)) {
        alert("ERROR: Please enter a correct email address.");
        return;
      }
      if (!phoneRegex.test(phone)) {
        alert("ERROR: Phone number must be exactly 10 digits.");
        return;
      }
      if (password.length < 6) {
        alert("ERROR: Password must be at least 6 characters long.");
        return;
      }
      if (!terms) {
        alert("ERROR: You must agree to the Terms & Conditions.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        // We log in normally, role will be determined by the backend token response
        await login(username, password);
      } else {
        await signup(username, email, password, role, floor, gender, phone);
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-elite fade-in" style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', padding: '5rem 2rem' }}>
      <div className="glass-card" style={{ maxWidth: '750px', width: '100%', padding: '5rem 4rem', boxSizing: 'border-box', borderTop: '4px solid var(--gold)' }}>
        <h1 className="serif gradient-text" style={{ fontSize: '4rem', textAlign: 'center', margin: '0 0 1rem 0' }}>
          {isLogin ? "LOGIN" : "SIGN UP"}
        </h1>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '4rem', fontSize: '1.1rem' }}>
          {isLogin ? "Welcome back! Enter your login details." : "Create a new account and choose your role."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* ROLE SELECTOR: Now visible for both Login and Signup as per user request */}
          <div className="role-selector-detailed">
             <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem', textAlign: 'center' }}>CHOOSE YOUR ROLE</label>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div onClick={() => setRole('customer')} className={`role-card ${role === 'customer' ? 'active' : ''}`} style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '20px', cursor: 'pointer', background: role === 'customer' ? 'rgba(212,175,55,0.1)' : 'transparent', border: role === 'customer' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', transition: '0.3s' }}>
                   <Users size={24} color="var(--gold)" />
                   <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginTop: '0.8rem' }}>CUSTOMER</div>
                </div>
                <div onClick={() => setRole('staff')} className={`role-card ${role === 'staff' ? 'active' : ''}`} style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '20px', cursor: 'pointer', background: role === 'staff' ? 'rgba(212,175,55,0.1)' : 'transparent', border: role === 'staff' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', transition: '0.3s' }}>
                   <Briefcase size={24} color="var(--gold)" />
                   <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginTop: '0.8rem' }}>STAFF</div>
                </div>
                <div onClick={() => setRole('admin')} className={`role-card ${role === 'admin' ? 'active' : ''}`} style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '20px', cursor: 'pointer', background: role === 'admin' ? 'rgba(212,175,55,0.1)' : 'transparent', border: role === 'admin' ? '1px solid var(--gold)' : '1px solid var(--glass-border)', transition: '0.3s' }}>
                   <Shield size={24} color="var(--gold)" />
                   <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginTop: '0.8rem' }}>ADMIN</div>
                </div>
             </div>
             {!isLogin && role === 'staff' && (
               <div className="floor-selector-rich slide-in" style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 'bold' }}>WHICH FLOOR DO YOU WORK ON?</label>
                  <input type="number" min="1" max="4" value={floor} onChange={(e) => setFloor(parseInt(e.target.value))} required style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '10px', fontSize: '1.5rem', textAlign: 'center' }} />
               </div>
             )}
          </div>

          <div className="input-field" style={{ position: 'relative' }}>
             <UserIcon size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
             <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="USERNAME" style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
          </div>

          {!isLogin && (
            <>
              <div className="input-field" style={{ position: 'relative' }}>
                <Mail size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="EMAIL ADDRESS" style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="input-field" style={{ position: 'relative' }}>
                    <Phone size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))} required maxLength={10} placeholder="PHONE (10 DIGITS)" style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                  </div>
                  <div className="input-field" style={{ position: 'relative' }}>
                    <Heart size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                    <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-cream)', borderRadius: '15px', appearance: 'none' }}>
                       <option value="Male" style={{ background: 'var(--bg-dark)' }}>MALE</option>
                       <option value="Female" style={{ background: 'var(--bg-dark)' }}>FEMALE</option>
                       <option value="Other" style={{ background: 'var(--bg-dark)' }}>OTHER</option>
                    </select>
                  </div>
              </div>
            </>
          )}

          <div className="input-field" style={{ position: 'relative' }}>
            <Lock size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="PASSWORD" style={{ width: '100%', padding: '1.2rem 4rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
            <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1.2rem', top: '1.2rem', cursor: 'pointer', color: 'var(--text-dim)' }}>
               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
               <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--gold)', cursor: 'pointer' }} />
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                 I AGREE TO THE <span style={{ color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer', borderBottom: '1px solid var(--gold)' }}>TERMS & CONDITIONS</span>.
               </p>
            </div>
          )}

          <button type="submit" className="btn-gold" style={{ padding: '1.5rem', fontSize: '1.2rem', marginTop: '1rem', borderRadius: '50px', boxShadow: '0 10px 30px rgba(212,175,55,0.2)' }} disabled={loading}>
            {loading ? "PLEASE WAIT..." : isLogin ? "LOG IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
            {isLogin ? "New here?" : "Already have an account?"} 
            <button onClick={() => { setIsLogin(!isLogin); setRole('customer'); }} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '1rem', borderBottom: '1px solid var(--gold)' }}>{isLogin ? "Sign Up" : "Log In"}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
