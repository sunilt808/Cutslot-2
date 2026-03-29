import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Trash, Check, UserPlus, Key, Eye, EyeOff, ShieldCheck, User, Edit, Save, X, Phone, Mail, MapPin, UserCheck } from 'lucide-react';

const Workers = () => {
  const { api } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchWorkers();
  }, [api]);

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/admin/workers');
      setWorkers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEdit = (worker) => {
    setEditingId(worker.id);
    setEditForm({ ...worker });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/admin/workers/${editingId}`, editForm);
      setEditingId(null);
      fetchWorkers();
    } catch (err) { alert("Error updating worker."); }
  };

  const approveWorker = async (id) => {
    try {
      await api.put(`/admin/workers/${id}/approve`);
      fetchWorkers();
    } catch (err) { alert("Error approving worker."); }
  };

  const deleteWorker = async (id) => {
    if (!confirm("Decommission this worker?")) return;
    try {
      await api.delete(`/admin/workers/${id}`);
      fetchWorkers();
    } catch (err) { alert("Error deleting worker."); }
  };

  return (
    <div className="admin-workers-page fade-in">
      <header className="glass-card" style={{ padding: '4rem', marginBottom: '3rem', borderLeft: '8px solid var(--gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h1 className="serif gradient-text" style={{ fontSize: '4rem', margin: 0 }}>STAFF <span style={{ color: 'var(--text-cream)' }}>DIRECTORY</span></h1>
           <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Full administrative control over salon workers and floor assignments.</p>
        </div>
        <Link to="/admin/credentials" className="btn-gold" style={{ padding: '1.2rem 3rem' }}><Key size={18} /> VIEW CREDENTIALS</Link>
      </header>

      <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(212,175,55,0.05)', color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '2px' }}>
            <tr>
              <th style={{ padding: '2rem' }}>NAME / EMAIL</th>
              <th>PHONE</th>
              <th>GENDER</th>
              <th>FLOOR</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right', paddingRight: '2rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '2rem' }}>
                   {editingId === w.id ? (
                     <input className="glass-input" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} style={{ marginBottom: '5px' }} />
                   ) : (
                     <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{w.username}</div>
                   )}
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{w.email}</div>
                </td>
                <td>
                   {editingId === w.id ? (
                     <input className="glass-input" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                   ) : (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}><Phone size={14} /> {w.phone || "---"}</div>
                   )}
                </td>
                <td>
                   {editingId === w.id ? (
                     <select className="glass-input" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                     </select>
                   ) : (
                     <div style={{ textTransform: 'capitalize' }}>{w.gender}</div>
                   )}
                </td>
                <td>
                   {editingId === w.id ? (
                     <input type="number" className="glass-input" value={editForm.assigned_floor} onChange={e => setEditForm({...editForm, assigned_floor: parseInt(e.target.value)})} style={{ width: '60px' }} />
                   ) : (
                     <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>FLOOR 0{w.assigned_floor}</div>
                   )}
                </td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.is_approved ? '#4caf50' : '#f44336' }}></div>
                      <span style={{ fontSize: '0.8rem' }}>{w.is_approved ? "APPROVED" : "PENDING"}</span>
                   </div>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                   <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      {editingId === w.id ? (
                        <>
                           <button onClick={saveEdit} style={{ padding: '0.8rem', background: '#4caf50', borderRadius: '10px', color: 'white' }}><Save size={18} /></button>
                           <button onClick={() => setEditingId(null)} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}><X size={18} /></button>
                        </>
                      ) : (
                        <>
                           {!w.is_approved && <button onClick={() => approveWorker(w.id)} className="btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}><UserCheck size={14} /> APPROVE</button>}
                           <button onClick={() => handleEdit(w)} style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}><Edit size={18} /></button>
                           <button onClick={() => deleteWorker(w.id)} style={{ padding: '0.8rem', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '10px' }}><Trash size={18} /></button>
                        </>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Workers;
