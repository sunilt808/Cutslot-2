import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Trash, Edit, X, ShieldCheck, Briefcase, Zap, Eye, EyeOff, UserCheck, CheckCircle, Lock, Check } from 'lucide-react';

const AdminWorkers = () => {
  const { api } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingWorker, setEditingWorker] = useState(null); 
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', full_name: '', email: '', password: '', phone: '', gender: 'Male', assigned_floor: 1, role: 'staff', commission_rate: 15.0 });
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
      setFormData({ username: '', full_name: '', email: '', password: '', phone: '', gender: 'Male', assigned_floor: 1, role: 'staff', commission_rate: 15.0 });
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

  const pendingWorkers = workers.filter(w => !w.is_approved);
  const approvedWorkers = workers.filter(w => w.is_approved);

  return (
    <div className="admin-workers-page fade-in" style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header className="glass-card" style={{ padding: '5rem', marginBottom: '6rem', borderRadius: '40px', borderRight: '4px solid var(--gold)', background: 'linear-gradient(to left, rgba(212,175,55,0.05), transparent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
               <Briefcase size={18} /> STAFF DIRECTORY
            </div>
            <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>
               ARTISAN <span style={{ color: 'var(--text-cream)' }}>CORPS</span>
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Administer staff assignments, clearance levels, and floor rotations.</p>
         </div>
         <button onClick={handleOpenAdd} className="btn-gold" style={{ padding: '1.5rem 3.5rem', borderRadius: '40px', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Users size={22} /> REGISTER ARTISAN
         </button>
      </header>

      {/* 🛡️ VETTING TERMINAL (PENDING APPROVAL) */}
      {pendingWorkers.length > 0 && (
          <div className="glass-card" style={{ padding: '4.5rem', marginBottom: '6rem', border: '1px solid var(--gold)', background: 'rgba(212,175,55,0.02)', borderRadius: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '3.5rem' }}>
                  <ShieldCheck size={35} color="var(--gold)" />
                  <h3 className="serif" style={{ fontSize: '3rem', margin: 0 }}>PENDING <span style={{ color: 'var(--gold)' }}>ACCREDITATION</span></h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
                  {pendingWorkers.map(w => (
                      <div key={w.id} className="glass-card hover-lift" style={{ padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Lock size={24} color="var(--gold)" />
                              </div>
                              <div>
                                  <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: 'white' }}>{w.username.toUpperCase()}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '5px' }}>Floor 0{w.assigned_floor} Assigned</div>
                              </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => approveWorker(w.id)} style={{ background: '#4caf50', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><UserCheck size={20} /></button>
                              <button onClick={() => handleDelete(w.id)} style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid #f44336', color: '#f44336', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}><X size={20} /></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* 📝 WORKER FORM MODAL */}
      {showForm && (
        <section className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 4, 8, 0.95)', backdropFilter: 'blur(15px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
           <form className="glass-card fade-in" onSubmit={handleSave} style={{ maxWidth: '900px', width: '100%', padding: '6rem', position: 'relative', border: '1px solid var(--gold)', borderRadius: '40px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ position: 'absolute', right: '3rem', top: '3rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={40} /></button>
                <h2 className="serif" style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>ARTISAN <span style={{ color: 'var(--gold)' }}>ACCREDITATION</span></h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', marginBottom: '5rem' }}>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', display: 'block', marginBottom: '1.2rem' }}>USERNAME</label>
                        <input className="glass-input" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>FULL NAME</label>
                        <input className="glass-input" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>EMAIL ADDRESS</label>
                        <input type="email" className="glass-input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>PHONE NUMBER</label>
                        <input type="text" className="glass-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} />
                    </div>
                    {!editingWorker && (
                        <div className="input-field" style={{ position: 'relative' }}>
                            <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>PASSWORD</label>
                            <input type={showPassword ? "text" : "password"} className="glass-input" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} />
                            <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1.5rem', top: '3.8rem', cursor: 'pointer', color: 'var(--text-dim)' }}>
                               {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                            </div>
                        </div>
                    )}
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>ASSIGNED FLOOR</label>
                        <input type="number" min="1" max="4" className="glass-input" required value={formData.assigned_floor} onChange={e => setFormData({...formData, assigned_floor: parseInt(e.target.value)})} style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} />
                    </div>
                    <div className="input-field">
                      <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>COMMISSION %</label>
                      <input type="number" step="0.1" className="glass-input" required value={formData.commission_rate} onChange={e => setFormData({...formData, commission_rate: parseFloat(e.target.value)})} style={{ width: '100%', padding: '1.5rem', borderRadius: '15px' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button type="submit" className="btn-gold" style={{ flex: 1, padding: '1.8rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {editingWorker ? "COMMIT CHANGES" : "REGISTER ARTISAN"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ flex: 0.5, padding: '1.8rem', borderRadius: '50px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>DISCARD</button>
                </div>
           </form>
        </section>
      )}

      {/* 📊 STAFF LIST */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '3.5rem' }}>
         {loading ? (
             [1,2,3,4].map(i => <div key={i} className="shimmer glass-card" style={{ height: '350px' }}></div>)
         ) : approvedWorkers.map(w => (
             <div key={w.id} className="glass-card hover-lift" style={{ padding: '4rem', borderRadius: '40px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), #f9d976)', padding: '4px' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={35} color="var(--gold)" />
                        </div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '4px', fontWeight: 'bold' }}>ELITE ARTISAN</div>
                        <div style={{ fontSize: '0.8rem', color: '#4caf50', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}><CheckCircle size={14} /> CERTIFIED</div>
                     </div>
                </div>

                <div>
                    <h3 className="serif" style={{ fontSize: '2.8rem', margin: 0 }}>{w.full_name || w.username}</h3>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', padding: '8px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>FLOOR 0{w.assigned_floor}</span>
                        <span style={{ fontSize: '0.8rem', padding: '8px 20px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: '12px' }}>{w.commission_rate}% YIELD</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '3rem', marginTop: 'auto' }}>
                    <button onClick={() => handleOpenEdit(w)} className="nav-button" style={{ flex: 1, padding: '1.2rem', borderRadius: '15px' }}><Edit size={18} /> EDIT</button>
                    <button onClick={() => handleDelete(w.id)} style={{ padding: '1.2rem', background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', color: '#f44336', borderRadius: '15px', cursor: 'pointer' }}><Trash size={18} /></button>
                </div>
             </div>
         ))}
      </div>

      <footer style={{ marginTop: '10rem', textAlign: 'center', padding: '6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '50px', border: '1px solid var(--glass-border)' }}>
          <Zap size={40} color="var(--gold)" style={{ marginBottom: '2rem' }} />
          <h4 className="serif" style={{ fontSize: '2.5rem' }}>ESTATE <span style={{ color: 'var(--gold)' }}>DIRECTORATE</span></h4>
          <p style={{ color: 'var(--text-dim)', maxWidth: '650px', margin: '1.5rem auto', fontSize: '1.1rem' }}>All staff credentials must undergo multi-factor administrative vetting before atelier floor access is synchronized with the ritual ledger.</p>
      </footer>
    </div>
  );
};

export default AdminWorkers;
