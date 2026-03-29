import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Trash, Edit, Plus, Save, X, Shield, Lock, Phone, Mail, UserPlus, ShieldCheck, Briefcase, Zap, Star, Key, Eye, EyeOff, UserCheck } from 'lucide-react';

const AdminWorkers = () => {
  const { api } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create / Edit modal state
  const [editingWorker, setEditingWorker] = useState(null); 
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', full_name: '', email: '', password: '', phone: '', gender: 'Male', assigned_floor: 1, role: 'staff' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, [api]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/workers');
      setWorkers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenAdd = () => {
      setEditingWorker(null);
      setFormData({ username: '', full_name: '', email: '', password: '', phone: '', gender: 'Male', assigned_floor: 1, role: 'staff' });
      setShowForm(true);
  };

  const handleOpenEdit = (worker) => {
      setEditingWorker(worker);
      setFormData({ ...worker, password: '' });
      setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
        if (editingWorker) {
            await api.put(`/admin/workers/${editingWorker.id}`, formData);
            alert("STAFF PROTOCOL UPDATED.");
        } else {
            await api.post('/admin/workers/', { ...formData, role: 'staff' });
            alert("NEW ARTISAN REGISTERED AND APPROVED.");
        }
        setShowForm(false);
        fetchWorkers();
    } catch (err) { alert(err.response?.data?.detail || "Action failed."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Decommission this artisan from the staff directory?")) return;
    try {
      await api.delete(`/admin/workers/${id}`);
      fetchWorkers();
    } catch (err) { alert("Error removing staff."); }
  };

  const approveWorker = async (id) => {
    try {
      await api.put(`/admin/workers/${id}/approve`);
      fetchWorkers();
    } catch (err) { alert("Error approving artisan."); }
  };

  return (
    <div className="admin-workers-page fade-in" style={{ padding: '2rem' }}>
      <header className="glass-card" style={{ padding: '4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent)' }}>
         <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
               <Briefcase size={18} /> STAFF DIRECTORY
            </div>
            <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>
               ARTISAN <span style={{ color: 'var(--text-cream)' }}>MANAGEMENT</span>
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Administer staff assignments, clearance levels, and floor rotations.</p>
         </div>
         <button onClick={handleOpenAdd} className="btn-gold" style={{ padding: '1.5rem 3.5rem', borderRadius: '40px', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <UserPlus size={22} /> REGISTER NEW ARTISAN
         </button>
      </header>

      {/* 📝 WORKER FORM MODAL */}
      {showForm && (
        <section className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 4, 8, 0.9)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
           <form className="glass-card fade-in" onSubmit={handleSave} style={{ maxWidth: '850px', width: '100%', padding: '5rem', position: 'relative', border: '1px solid var(--gold)' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={30} /></button>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '3.5rem' }}>{editingWorker ? "EDIT ARTISAN" : "NEW ARTISAN"} <span style={{ color: 'var(--gold)' }}>PROTOCOL</span></h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>USERNAME</label>
                        <input className="glass-input" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>FULL NAME</label>
                        <input className="glass-input" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>EMAIL ADDRESS</label>
                        <input type="email" className="glass-input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>PHONE NUMBER</label>
                        <input type="text" className="glass-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    {!editingWorker && (
                        <div className="input-field" style={{ position: 'relative' }}>
                            <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>PASSWORD</label>
                            <input type={showPassword ? "text" : "password"} className="glass-input" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%' }} />
                            <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1.2rem', top: '3.3rem', cursor: 'pointer', color: 'var(--text-dim)' }}>
                               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    )}
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>ASSIGNED FLOOR</label>
                        <input type="number" min="1" max="4" className="glass-input" required value={formData.assigned_floor} onChange={e => setFormData({...formData, assigned_floor: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>GENDER</label>
                        <select className="glass-input" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{ width: '100%', padding: '1.2rem' }}>
                            <option value="Male">MALE</option>
                            <option value="Female">FEMALE</option>
                            <option value="Other">OTHER</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <button type="submit" className="btn-gold" style={{ flex: 1, padding: '1.4rem', borderRadius: '40px', fontWeight: 'bold', fontSize: '1rem' }}>
                        {editingWorker ? "COMMIT CHANGES" : "REGISTER ARTISAN"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ flex: 0.5, padding: '1.4rem', borderRadius: '40px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>DISCARD</button>
                </div>
           </form>
        </section>
      )}

      {/* 📊 STAFF LIST */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2.5rem' }}>
         {loading ? (
             [1,2,3,4].map(i => <div key={i} className="shimmer glass-card" style={{ height: '350px' }}></div>)
         ) : workers.map(w => (
             <div key={w.id} className="glass-card hover-lift" style={{ padding: '3.5rem', border: '1px solid var(--glass-border)', position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--gold-glow)', padding: '12px', borderRadius: '12px', color: 'var(--gold)' }}>
                        <Users size={22} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>FLOOR 0{w.assigned_floor}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>ID: #{w.id}</div>
                    </div>
                </div>

                <h3 className="serif" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>{w.full_name || w.username}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>{w.email} • {w.phone || "No Contact"}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: w.is_approved ? '#4caf50' : '#f44336' }}></div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: w.is_approved ? '#4caf50' : '#f44336' }}>{w.is_approved ? "APPROVED" : "PENDING"}</span>
                   </div>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      {!w.is_approved && <button onClick={() => approveWorker(w.id)} className="btn-gold" style={{ padding: '0.8rem 1.2rem', fontSize: '0.7rem' }}><UserCheck size={16} /> APPROVE</button>}
                      <button onClick={() => handleOpenEdit(w)} className="btn-gold" style={{ padding: '0.8rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}><Edit size={18} /></button>
                      <button onClick={() => handleDelete(w.id)} style={{ padding: '0.8rem', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '12px' }}><Trash size={18} /></button>
                   </div>
                </div>
             </div>
         ))}
      </div>

      <footer style={{ marginTop: '8rem', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '40px' }}>
          <ShieldCheck size={40} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
          <h4 className="serif" style={{ fontSize: '2rem' }}>ESTATE <span style={{ color: 'var(--gold)' }}>DIRECTORATE</span></h4>
          <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '1rem auto' }}>All artisans must are vetted and approved before floor access protocols are synchronized.</p>
      </footer>
    </div>
  );
};

export default AdminWorkers;
