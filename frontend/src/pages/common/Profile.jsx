import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Info, Smartphone, Mail, Settings, Layout, Search, Sparkles, Layers, ArrowRight, Save, Lock, Bell, Trophy } from 'lucide-react';

const ProfileSettings = () => {
    const { user, api, refreshUser } = useAuth();
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotifications] = useState(true);
    const [username, setUsername] = useState(user?.username || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [gender, setGender] = useState(user?.gender || "male");

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setPhone(user.phone || "");
            setGender(user.gender || "male");
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            await api.put('/users/me', { username, phone, gender });
            alert("Elite profile protocol updated. Changes synchronized with the CUTSLOT database.");
            refreshUser();
        } catch(err) { alert("Error synchronized profile."); }
    };

    const handleClaimDiscount = async () => {
        try {
            const res = await api.post('/loyalty/claim');
            alert(res.data.msg);
            refreshUser();
        } catch(err) { alert(err.response?.data?.detail || "Claim failed."); }
    };

    return (
        <div className="profile-settings-page fade-in-up">
            <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>PROFILE <span style={{ color: 'var(--text-cream)' }}>PROTOCOLS</span></h1>
                   <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Personal identity and interface preferences in the CutSlot ecosystem.</p>
                </div>
            </header>

            <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', height: 'fit-content' }}>
                    <div className="profile-icon" style={{ background: 'var(--gold-glow)', padding: '3rem', borderRadius: '50%', width: '150px', height: '150px', margin: '0 auto 2.5rem' }}>
                        <User size={80} color="var(--gold)" />
                    </div>
                    <div className="serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{user?.username}</div>
                    <div style={{ color: 'var(--gold)', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>ACCESS CLEARANCE: {user?.role?.toUpperCase()}</div>
                    <div style={{ padding: '0.5rem 1.5rem', border: '1px solid var(--gold)', borderRadius: '20px', marginTop: '1.5rem', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold' }}>
                        FLOOR {user?.assigned_floor || "ALL"} AUTHORIZED
                    </div>
                    
                    <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(212,175,55,0.05)', borderRadius: '25px', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <div style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '3px', fontWeight: 'bold', marginBottom: '1rem' }}>LOYALTY POINTS</div>
                        <div className="serif" style={{ fontSize: '3.5rem', color: 'var(--text-cream)' }}>{user?.loyalty_points || 0}</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '1rem' }}>40 POINTS = 15% DISCOUNT</p>
                        {user?.loyalty_points >= 40 && (
                            <button onClick={handleClaimDiscount} className="btn-gold" style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', borderRadius: '30px', fontSize: '0.8rem' }}>CLAIM 15% DISCOUNT</button>
                        )}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '5rem' }}>
                    <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3.5rem' }}>INTERFACE <span style={{ color: 'var(--gold)' }}>PREFERENCES</span></h3>
                    
                    <div className="settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>USERNAME</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.5rem', top: '1.5rem' }} />
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '1.4rem 1.4rem 1.4rem 4rem', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>EMAIL ADDRESS</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.5rem', top: '1.5rem' }} />
                                    <input type="email" value={user?.email} readOnly style={{ padding: '1.4rem 1.4rem 1.4rem 4rem', width: '100%', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', color: 'rgba(255,255,255,0.3)', cursor: 'not-allowed', borderRadius: '15px' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>CONTACT PHONE</label>
                                <div style={{ position: 'relative' }}>
                                    <Smartphone size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.5rem', top: '1.5rem' }} />
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ padding: '1.4rem 1.4rem 1.4rem 4rem', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '1rem', marginBottom: '1.2rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>GENDER IDENTITY</label>
                                <div style={{ position: 'relative' }}>
                                    <Sparkles size={18} color="var(--gold)" style={{ position: 'absolute', left: '1.5rem', top: '1.5rem', pointerEvents: 'none' }} />
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ padding: '1.4rem 1.4rem 1.4rem 4rem', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', color: 'var(--text-cream)', borderRadius: '15px', appearance: 'none' }}>
                                        <option value="male" style={{ background: 'var(--bg-dark)' }}>MALE</option>
                                        <option value="female" style={{ background: 'var(--bg-dark)' }}>FEMALE</option>
                                        <option value="other" style={{ background: 'var(--bg-dark)' }}>OTHER</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>DISPLAY MODE</label>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <button onClick={() => setTheme('dark')} className={`btn-gold ${theme === 'dark' ? 'active' : ''}`} style={{ flex: 1, padding: '1.2rem', background: theme === 'dark' ? 'var(--gold)' : 'transparent', color: theme === 'dark' ? 'var(--bg-dark)' : 'var(--text-cream)' }}>DARK CUTSLOT</button>
                                <button onClick={() => setTheme('light')} className={`btn-gold ${theme === 'light' ? 'active' : ''}`} style={{ flex: 1, padding: '1.2rem', background: theme === 'light' ? 'var(--gold)' : 'transparent', color: theme === 'light' ? 'var(--bg-dark)' : 'rgba(255,255,255,0.3)', opacity: 0.5, borderStyle: 'dashed' }}>LIGHT (SOON)</button>
                            </div>
                        </div>

                        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', border: '1px solid var(--glass-border)', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '10px', borderRadius: '12px' }}><Bell color="var(--gold)" size={20} /></div>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>HAPTIC NOTARY FEED</div>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Receive real-time artisan push alerts for all floor sessions.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={() => setNotifications(!notifications)} style={{ padding: '10px 20px', borderRadius: '30px', background: notifications ? 'var(--gold)' : 'transparent', color: notifications ? 'var(--bg-dark)' : 'var(--text-cream)', border: '1px solid var(--gold)', fontWeight: 'bold', fontSize: '0.8rem' }}>{notifications ? "ENABLED" : "DISABLED"}</button>
                            </div>
                        </div>

                        <button onClick={handleUpdate} className="btn-gold" style={{ padding: '1.5rem 5rem', borderRadius: '50px', fontSize: '1.1rem', marginTop: '2rem', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '15px' }}>
                             <Save size={20} /> SYNCHRONIZE PROFILE
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
