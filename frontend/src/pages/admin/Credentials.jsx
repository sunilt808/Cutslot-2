import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Key, Eye, EyeOff, Mail, Briefcase, Lock, UserCheck, AlertTriangle } from 'lucide-react';

const Credentials = () => {
    const { api } = useAuth();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/workers').then(res => {
            setWorkers(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="admin-credentials-page fade-in">
            <header className="glass-card" style={{ padding: '4rem', marginBottom: '4rem', borderBottom: '4px solid var(--gold)' }}>
                 <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0 }}>ESTATE <span style={{ color: 'var(--text-cream)' }}>ACCESS</span></h1>
                 <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Secure management of luxury floor credentials and access level monitoring.</p>
            </header>

            <div className="glass-card" style={{ padding: '4rem', border: '1px solid rgba(244, 67, 54, 0.3)', background: 'rgba(244, 67, 54, 0.02)', marginBottom: '4rem' }}>
                 <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ background: '#f44336', padding: '15px', borderRadius: '15px', color: 'white' }}><Lock size={30} /></div>
                    <div>
                       <h3 className="serif" style={{ fontSize: '2rem', margin: 0 }}>SECURITY PROTOCOL</h3>
                       <p style={{ fontSize: '0.9rem', color: 'rgba(244, 67, 54, 0.8)', marginTop: '0.5rem' }}>Worker credentials are encrypted at the database level. For security, only administrative reset links are permitted.</p>
                    </div>
                 </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
                {workers.map(w => (
                    <div key={w.id} className="glass-card hover-lift" style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                           <h3 className="serif" style={{ fontSize: '2rem', margin: 0 }}>{w.username}</h3>
                           <div style={{ padding: '0.4rem 1.2rem', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold)', borderRadius: '20px', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold' }}>FLOOR 0{w.assigned_floor}</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '15px' }}>
                              <Mail size={16} color="var(--gold)" />
                              <div style={{ wordBreak: 'break-all', fontSize: '1rem' }}>{w.email}</div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '15px' }}>
                              <Key size={16} color="var(--gold)" />
                              <div style={{ letterSpacing: '8px' }}>••••••••••••••</div>
                           </div>
                        </div>

                        <button className="btn-gold" style={{ width: '100%', padding: '1.2rem', fontSize: '0.9rem' }}>GENERATE RESET LINK</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Credentials;
