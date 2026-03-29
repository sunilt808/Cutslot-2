import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Trash, Edit, Plus, Save, X, Layers, Clock, Shield, Star, Crown, Zap, Flower } from 'lucide-react';

const AdminServices = () => {
  const { api } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({ name: '', description: '', price: 0, duration: 30, floor: 1, category: 'common' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [api]);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/');
      setServices(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    try {
      await api.post('/admin/services/', newService);
      setShowAdd(false);
      setNewService({ name: '', description: '', price: 0, duration: 30, floor: 1, category: 'common' });
      fetchServices();
    } catch (err) { alert("Error adding service."); }
  };

  const handleUpdate = async (id, data) => {
    try {
      await api.put(`/admin/services/${id}`, data);
      setEditingId(null);
      fetchServices();
    } catch (err) { alert("Error updating service."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Decommission this service from the list?")) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) { alert("Error removing service."); }
  };

  return (
    <div className="admin-services-page fade-in">
      <header className="glass-card" style={{ padding: '4rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid var(--gold)' }}>
         <div>
            <h1 className="serif gradient-text" style={{ fontSize: '4rem', margin: 0 }}>SERVICE <span style={{ color: 'var(--text-cream)' }}>INVENTORY</span></h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Full management of the luxury floor catalogs and custom offerings.</p>
         </div>
         <button onClick={() => setShowAdd(!showAdd)} className="btn-gold" style={{ padding: '1.5rem 3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {showAdd ? <X size={20} /> : <Plus size={20} />} {showAdd ? "CANCEL ADD" : "ADD NEW SERVICE"}
         </button>
      </header>

      {showAdd && (
        <section className="glass-card fade-in" style={{ padding: '3rem', marginBottom: '4rem', border: '1px dashed var(--gold)' }}>
           <h3 className="serif" style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>DRAFT NEW SERVICE OFFERING</h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
              <input className="glass-input" placeholder="Service Name" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
              <input type="number" className="glass-input" placeholder="Price (INR)" value={newService.price} onChange={e => setNewService({...newService, price: parseInt(e.target.value)})} />
              <input type="number" className="glass-input" placeholder="Duration (Mins)" value={newService.duration} onChange={e => setNewService({...newService, duration: parseInt(e.target.value)})} />
              <input className="glass-input" placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} style={{ gridColumn: 'span 2' }} />
              <select className="glass-input" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}>
                 <option value="common">General (Floor 1)</option>
                 <option value="female">Beauty (Floor 3)</option>
                 <option value="subscription">Membership (Floor 4)</option>
                 <option value="advance">VIP Booking (Floor 2)</option>
                 <option value="custom">Custom (Special)</option>
              </select>
           </div>
           <button onClick={handleCreate} className="btn-gold" style={{ padding: '1.2rem 4rem', fontSize: '1.1rem' }}>PUBLISH TO FLOOR CATALOG</button>
        </section>
      )}

      <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(212,175,55,0.05)', color: 'var(--gold)', letterSpacing: '2px', fontSize: '0.8rem' }}>
            <tr>
              <th style={{ padding: '2rem' }}>SERVICE NAME</th>
              <th>PRICE</th>
              <th>DURATION</th>
              <th>CATEGORY</th>
              <th style={{ textAlign: 'right', paddingRight: '2rem' }}>PROTOCOLS</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '2rem' }}>
                   {editingId === s.id ? (
                      <input className="glass-input" value={s.name} onChange={e => handleUpdate(s.id, { ...s, name: e.target.value })} />
                   ) : (
                      <>
                        <div className="serif" style={{ fontSize: '1.2rem' }}>{s.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{s.description}</div>
                      </>
                   )}
                </td>
                <td style={{ fontWeight: 'bold' }}>₹{s.price}</td>
                <td style={{ color: 'var(--text-dim)' }}>{s.duration} MINS</td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '40px', width: 'fit-content' }}>
                      {s.category === 'common' && <Scissors size={14} color="var(--gold)" />}
                      {s.category === 'female' && <Flower size={14} color="var(--gold)" />}
                      {s.category === 'subscription' && <Crown size={14} color="var(--gold)" />}
                      {s.category === 'advance' && <Zap size={14} color="var(--gold)" />}
                      <span style={{ textTransform: 'uppercase' }}>{s.category} (F0{s.floor})</span>
                   </div>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                   <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleDelete(s.id)} style={{ padding: '0.8rem', background: 'transparent', border: '1px solid #f44336', color: '#f44336', borderRadius: '10px' }}><Trash size={18} /></button>
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

export default AdminServices;
