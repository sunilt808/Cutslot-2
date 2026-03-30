import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Shield, Users, Briefcase, Zap, BadgeCheck, Smartphone, Phone, Heart, Eye, EyeOff, Layout, Crown, CheckCircle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [floor, setFloor] = useState(1);
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [customerCategory, setCustomerCategory] = useState("normal");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup, subscribe, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin && role === 'customer') {
        fetchPlans();
    }
  }, [isLogin, role]);

  const fetchPlans = async () => {
    try {
        const res = await api.get('/services/?floor=4');
        setPlans(res.data);
    } catch(err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const nameRegex = /^\w{3,20}$/;
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
      
      if (password.length < 8) {
        alert("ERROR: Password must be at least 8 characters long.");
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
        await login(username, password);
      } else {
        await signup(username, fullName, email, password, role, floor);
        if (role === 'staff') {
            alert("Artisan application submitted. Please wait for administrative approval.");
            setIsLogin(true);
            return;
        }
        await login(username, password); 
        if (role === 'customer' && selectedPlan) {
            await subscribe(selectedPlan);
        }
      }
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.detail || "Process failed. Please verify your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-elite fade-in" style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', padding: '5rem 2rem' }}>
      <div className="glass-card" style={{ maxWidth: '850px', width: '100%', padding: '5rem 4rem', boxSizing: 'border-box', borderTop: '4px solid var(--gold)' }}>
        <h1 className="serif gradient-text" style={{ fontSize: '4rem', textAlign: 'center', margin: '0 0 1rem 0' }}>
          {isLogin ? "LOGIN" : "SIGN UP"}
        </h1>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '4rem', fontSize: '1.1rem' }}>
          {isLogin ? "Welcome back to the excellence." : "Join the elite community of luxury connoisseurs."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* ROLE SELECTOR */}
          <div className="role-selector-detailed">
             <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem', textAlign: 'center' }}>IDENTIFY YOUR ROLE</label>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isLogin ? '1fr' : '1fr 1fr', gap: '2rem' }}>
            <div className="input-field" style={{ position: 'relative' }}>
                <UserIcon size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="USERNAME" style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
            </div>
            {!isLogin && (
                <div className="input-field" style={{ position: 'relative' }}>
                    <Zap size={20} color="var(--gold)" style={{ position: 'absolute', left: '1.2rem', top: '1.2rem' }} />
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="FULL NAME" style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                </div>
            )}
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
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))} required maxLength={10} placeholder="PHONE" style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
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

              {role === 'customer' && (
                  <div className="subscription-choice slide-in" style={{ background: 'rgba(212,175,55,0.03)', padding: '2.5rem', borderRadius: '25px', border: '1px solid var(--gold-glow)' }}>
                      <label style={{ fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                          <Crown size={20} /> SELECT YOUR ELITE MEMBERSHIP (OPTIONAL)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                          {plans.length > 0 ? plans.map(p => (
                              <div key={p.id} onClick={() => setSelectedPlan(selectedPlan === p.id ? null : p.id)} style={{ padding: '1.5rem', borderRadius: '18px', border: selectedPlan === p.id ? '2px solid var(--gold)' : '1px solid var(--glass-border)', background: selectedPlan === p.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease', transform: selectedPlan === p.id ? 'scale(1.02)' : 'scale(1)' }}>
                                  <div style={{ fontWeight: 'bold', fontSize: '1rem', color: selectedPlan === p.id ? 'var(--gold)' : 'var(--text-cream)', marginBottom: '5px' }}>{p.name.split(' ')[0]}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold' }}>₹{p.price}</div>
                                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '8px' }}>{(p.description || '').slice(0, 30)}...</div>
                                  {selectedPlan === p.id && <CheckCircle size={18} color="var(--gold)" style={{ position: 'absolute', right: '1rem', top: '1.2rem' }} />}
                              </div>
                          )) : (
                              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '1rem', color: 'var(--text-dim)', fontSize: '0.8rem', border: '1px dashed var(--glass-border)', borderRadius: '10px' }}>
                                 SYNCHRONIZING MEMBERSHIP REGISTRY...
                              </div>
                          )}
                      </div>
                  </div>
              )}

              {role === 'staff' && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 'bold' }}>ASSIGNED OPERATIONAL FLOOR</label>
                      <input type="number" min="1" max="4" value={floor} onChange={(e) => setFloor(parseInt(e.target.value))} required style={{ width: '100%', marginTop: '1rem', padding: '1rem', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '10px', fontSize: '1.5rem', textAlign: 'center' }} />
                  </div>
              )}
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
                 I AGREE TO THE <span style={{ color: 'var(--gold)', fontWeight: 'bold', borderBottom: '1px solid var(--gold)' }}>TERMS & CONDITIONS</span>.
               </p>
            </div>
          )}

          <button type="submit" className="btn-gold" style={{ padding: '1.5rem', fontSize: '1.2rem', marginTop: '1rem', borderRadius: '50px', fontWeight: 'bold' }} disabled={loading}>
            {loading ? "PROCESSING..." : isLogin ? "LOGIN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
            {isLogin ? "New to CutSlot?" : "Already an elite member?"} 
            <button onClick={() => { setIsLogin(!isLogin); }} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '1rem', borderBottom: '1px solid var(--gold)' }}>{isLogin ? "Sign Up" : "Log In"}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
