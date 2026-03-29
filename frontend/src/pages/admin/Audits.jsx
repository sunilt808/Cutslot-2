import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { History, Search, Shield, Filter, Calendar, Clock, Lock, AlertTriangle } from 'lucide-react';

const AdminAudits = () => {
    const { api } = useAuth();
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/admin/audits');
            setLogs(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const filteredLogs = logs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-audits-page fade-in-up">
            <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <h1 className="serif gradient-text" style={{ fontSize: '3.5rem', margin: 0 }}>SECURITY <span style={{ color: 'var(--text-cream)' }}>OVERSEER</span></h1>
                   <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Comprehensive audit trail of all elite stakeholder activities.</p>
                </div>
                <div className="search-bar glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', borderRadius: '40px' }}>
                    <Search size={20} color="var(--gold)" />
                    <input 
                        type="text" 
                        placeholder="SEARCH PROTOCOLS..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-cream)', outline: 'none', fontSize: '1rem' }}
                    />
                </div>
            </header>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(212,175,55,0.05)', color: 'var(--gold)', letterSpacing: '2px', fontSize: '0.8rem' }}>
                        <tr>
                            <th style={{ padding: '2rem', textAlign: 'left' }}>TIMESTAMP</th>
                            <th style={{ padding: '2rem', textAlign: 'left' }}>CLEARANCE ID</th>
                            <th style={{ padding: '2rem', textAlign: 'left' }}>ACTION</th>
                            <th style={{ padding: '2rem', textAlign: 'left' }}>DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '2rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Clock size={14} /> {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </td>
                                <td style={{ padding: '2rem', fontWeight: 'bold' }}>USER-0{log.user_id}</td>
                                <td style={{ padding: '2rem' }}>
                                    <span style={{ 
                                        padding: '5px 15px', 
                                        borderRadius: '20px', 
                                        background: log.action === 'SIGNUP' ? 'rgba(76,175,80,0.1)' : 'rgba(212,175,55,0.1)',
                                        color: log.action === 'SIGNUP' ? '#4caf50' : 'var(--gold)',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        border: '1px solid'
                                    }}>
                                        {log.action}
                                    </span>
                                </td>
                                <td style={{ padding: '2rem', color: 'var(--text-cream)', fontSize: '0.9rem' }}>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAudits;
