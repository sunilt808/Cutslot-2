import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Trash, Edit, Plus, Save, X, Layers, Clock, Shield, Star, Crown, Zap, Flower, Database, ArrowRight, ShieldCheck, Tag, Info } from 'lucide-react';

const AdminServices = () => {
  const { api } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create / Edit modal state
  const [editingService, setEditingService] = useState(null); 
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, duration: 30, floor: 1, category: 'common' });

  useEffect(() => {
    fetchServices();
  }, [api]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services/');
      setServices(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenAdd = () => {
      setEditingService(null);
      setFormData({ name: '', description: '', price: 0, duration: 30, floor: 1, category: 'common' });
      setShowForm(true);
  };

  const handleOpenEdit = (service) => {
      setEditingService(service);
      setFormData({ ...service });
      setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
        if (editingService) {
            await api.put(`/admin/services/${editingService.id}`, formData);
            alert("SERVICE PROTOCOL UPDATED.");
        } else {
            await api.post('/admin/services/', formData);
            alert("NEW SERVICE PUBLISHED.");
        }
        setShowForm(false);
        fetchServices();
    } catch (err) { alert(err.response?.data?.detail || "Action failed."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Decommission this service from the floor catalog?")) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) { alert("Error removing service."); }
  };

  const getCategoryIcon = (cat) => {
      switch(cat) {
          case 'female': return <Flower size={18} />;
          case 'subscription': return <Crown size={18} />;
          case 'advance': return <Zap size={18} />;
          default: return <Scissors size={18} />;
      }
  };

  return (
    <div className="admin-services-page fade-in" style={{ padding: '2rem' }}>
      <header className="glass-card" style={{ padding: '4rem', marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '4px solid var(--gold)', background: 'radial-gradient(circle at top right, rgba(212,175,55,0.05), transparent)' }}>
         <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
               <Database size={18} /> SERVICE INVENTORY
            </div>
            <h1 className="serif gradient-text" style={{ fontSize: '4.5rem', margin: 0, letterSpacing: '-2px' }}>
               CATALOG <span style={{ color: 'var(--text-cream)' }}>MANAGEMENT</span>
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>Administer floor assignments, pricing models, and service descriptions.</p>
         </div>
         <button onClick={handleOpenAdd} className="btn-gold" style={{ padding: '1.5rem 3.5rem', borderRadius: '40px', fontWeight: 'bold', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Plus size={22} /> DRAFT NEW RITUAL
         </button>
      </header>

      {/* 📝 SERVICE MODAL / FORM */}
      {showForm && (
        <section className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 4, 8, 0.9)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
           <form className="glass-card fade-in" onSubmit={handleSave} style={{ maxWidth: '850px', width: '100%', padding: '5rem', position: 'relative', border: '1px solid var(--gold)' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={30} /></button>
                <h2 className="serif" style={{ fontSize: '3rem', marginBottom: '3.5rem' }}>{editingService ? "EDIT SERVICE" : "NEW SERVICE"} <span style={{ color: 'var(--gold)' }}>PROTOCOL</span></h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>SERVICE NAME</label>
                        <input className="glass-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>PRICE (INR)</label>
                        <input type="number" className="glass-input" required value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    </div>
                    <div className="input-field" style={{ gridColumn: 'span 2' }}>
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>DESCRIPTION</label>
                        <textarea className="glass-input" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', height: '120px', resize: 'none', padding: '1.5rem' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>DURATION (MINS)</label>
                        <input type="number" className="glass-input" required value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} style={{ width: '100%' }} />
                    </div>
                    <div className="input-field">
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>ASSIGNED FLOOR</label>
                        <select className="glass-input" value={formData.floor} onChange={e => setFormData({...formData, floor: parseInt(e.target.value)})} style={{ width: '100%', padding: '1.2rem' }}>
                            <option value="1">FLOOR 01 (GENERAL)</option>
                            <option value="2">FLOOR 02 (VIP)</option>
                            <option value="3">FLOOR 03 (BEAUTY)</option>
                            <option value="4">FLOOR 04 (MEMBERSHIP)</option>
                        </select>
                    </div>
                    <div className="input-field" style={{ gridColumn: 'span 2' }}>
                        <label style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>CATEGORY KEY</label>
                        <select className="glass-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '1.2rem' }}>
                            <option value="common">COMMON</option>
                            <option value="female">FEMALE / BEAUTY</option>
                            <option value="subscription">SUBSCRIPTION / PLAN</option>
                            <option value="advance">ADVANCE / VIP</option>
                            <option value="custom">CUSTOM</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <button type="submit" className="btn-gold" style={{ flex: 1, padding: '1.4rem', borderRadius: '40px', fontWeight: 'bold', fontSize: '1rem' }}>
                        {editingService ? "COMMIT CHANGES" : "PUBLISH TO ESTATE"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={{ flex: 0.5, padding: '1.4rem', borderRadius: '40px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-dim)' }}>DISCARD</button>
                </div>
           </form>
        </section>
      )}

      {/* 📊 SERVICES LIST */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2.5rem' }}>
         {loading ? (
             [1,2,3,4].map(i => <div key={i} className="shimmer glass-card" style={{ height: '350px' }}></div>)
         ) : services.map(s => (
             <div key={s.id} className="glass-card hover-lift" style={{ padding: '3.5rem', border: '1px solid var(--glass-border)', position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ background: 'var(--gold-glow)', padding: '12px', borderRadius: '12px', color: 'var(--gold)' }}>
                        {getCategoryIcon(s.category)}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', letterSpacing: '2px' }}>FLOOR 0{s.floor}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>ID: #{s.id}</div>
                    </div>
                </div>

                <h3 className="serif" style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>{s.name}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', height: '60px', overflow: 'hidden', marginBottom: '2.5rem' }}>{s.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{s.price}</span>
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> {s.duration} MINUTES</span>
                   </div>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleOpenEdit(s)} className="btn-gold" style={{ padding: '1rem', borderRadius: '15px' }} title="Edit"><Edit size={20} /></button>
                      <button onClick={() => handleDelete(s.id)} style={{ padding: '1rem', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '15px' }} title="Delete"><Trash size={20} /></button>
                   </div>
                </div>
             </div>
         ))}
      </div>

      <footer style={{ marginTop: '8rem', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '40px' }}>
          <ShieldCheck size={40} color="var(--gold)" style={{ marginBottom: '1.5rem' }} />
          <h4 className="serif" style={{ fontSize: '2rem' }}>ESTATE <span style={{ color: 'var(--gold)' }}>SECURITY</span></h4>
          <p style={{ color: 'var(--text-dim)', maxWidth: '600px', margin: '1rem auto' }}>All service changes are instantly propagated to the public booking portals and worker terminals.</p>
      </footer>
    </div>
  );
};

export default AdminServices;
