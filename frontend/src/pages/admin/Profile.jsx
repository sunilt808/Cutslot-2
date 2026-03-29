import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCircle, Shield, Settings, Mail, Phone, MapPin, Save, Fingerprint, Lock, Sun, Moon, Bell, ShieldAlert } from 'lucide-react';

const AdminProfile = () => {
    const { user, theme, toggleTheme } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="admin-profile-page fade-in">
            <header className="glass-card" style={{ padding: '4rem', marginBottom: '4rem', display: 'flex', gap: '4rem', alignItems: 'center', borderTop: '4px solid var(--gold)' }}>
                 <div style={{ position: 'relative' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <UserCircle size={80} color="black" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--bg-dark)', borderRadius: '50%', padding: '10px', border: '1px solid var(--gold)' }}>
                       <Shield size={20} color="var(--gold)" />
                    </div>
                 </div>
                 <div>
                    <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0 }}>ADMIN <span style={{ color: 'var(--text-cream)' }}>CONSOLE</span></h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Management profile for {user.username.toUpperCase()}</p>
                 </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3rem' }}>
                
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'btn-gold' : 'nav-button'} style={{ width: '100%', justifyContent: 'flex-start', padding: '1.5rem 2rem' }}>
                       <UserCircle size={18} /> PROFILE IDENTITY
                    </button>
                    <button onClick={() => setActiveTab('security')} className={activeTab === 'security' ? 'btn-gold' : 'nav-button'} style={{ width: '100%', justifyContent: 'flex-start', padding: '1.5rem 2rem' }}>
                       <Lock size={18} /> SECURITY LEVEL
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'btn-gold' : 'nav-button'} style={{ width: '100%', justifyContent: 'flex-start', padding: '1.5rem 2rem' }}>
                       <Settings size={18} /> SYSTEM PREFERENCE
                    </button>
                </aside>

                <main className="glass-card" style={{ padding: '4rem' }}>
                   {activeTab === 'profile' && (
                      <div className="fade-in">
                         <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>IDENTITY <span style={{ color: 'var(--gold)' }}>PROFILE</span></h3>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                            <div>
                               <label style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '2px', fontWeight: 'bold' }}>USER IDENTIFIER</label>
                               <input className="glass-input" defaultValue={user.username} style={{ width: '100%', marginTop: '0.8rem' }} disabled />
                            </div>
                            <div>
                               <label style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '2px', fontWeight: 'bold' }}>ADMINISTRATION EMAIL</label>
                               <input className="glass-input" defaultValue={user.email} style={{ width: '100%', marginTop: '0.8rem' }} />
                            </div>
                         </div>
                         <button className="btn-gold" style={{ marginTop: '4rem', padding: '1.2rem 4rem' }}>SAVE UPDATES</button>
                      </div>
                   )}

                   {activeTab === 'security' && (
                      <div className="fade-in">
                         <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>ENCRYPTION <span style={{ color: 'var(--gold)' }}>PROTOCOLS</span></h3>
                         <div style={{ background: 'rgba(212,175,55,0.05)', padding: '3rem', borderRadius: '20px', border: '1px solid var(--gold)', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                               <ShieldAlert size={40} color="var(--gold)" />
                               <div>
                                  <h4 style={{ fontSize: '1.2rem', margin: 0 }}>TWO-FACTOR AUTHENTICATION</h4>
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Add an extra layer of security to your administrative console access.</p>
                               </div>
                               <button className="btn-gold" style={{ marginLeft: 'auto', padding: '0.8rem 2rem' }}>ENABLE</button>
                            </div>
                         </div>
                         <button className="btn-gold" style={{ border: '1px solid #f44336', color: '#f44336' }}>REVOKE ALL SESSIONS</button>
                      </div>
                   )}

                   {activeTab === 'settings' && (
                      <div className="fade-in">
                         <h3 className="serif" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>SYSTEM <span style={{ color: 'var(--gold)' }}>VIBE</span></h3>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '20px' }}>
                            <div>
                               <h4 style={{ margin: 0 }}>THEME INTERFACE</h4>
                               <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Switch between Lumière dark mode and standard luxury light mode.</p>
                            </div>
                            <button onClick={toggleTheme} className="btn-gold" style={{ padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} {theme === 'dark' ? "DAWN MODE" : "DUSK MODE"}
                            </button>
                         </div>
                      </div>
                   )}
                </main>

            </div>
        </div>
    );
};

export default AdminProfile;
