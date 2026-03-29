import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, Activity, Database, Check, X, Shield, AlertCircle } from 'lucide-react';

const Admin = () => {
  const { api, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, logsRes] = await Promise.all([
          api.get('/bookings/'),
          api.get('/audit-logs/') // I'll need to add this to backend
        ]);
        setBookings(bookingsRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  const updateBookingStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return 'var(--gold)';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <AlertCircle size={60} color="var(--gold)" style={{ marginBottom: '2rem' }} />
        <h1 className="serif">ACCESS DENIED</h1>
        <p style={{ color: 'var(--text-dim)' }}>Only the salon administrators can view this atelier dashboard.</p>
      </div>
    );
  }

  return (
    <div className="admin-container fade-in-up">
      <h1 className="serif gradient-text" style={{ fontSize: '3rem', marginBottom: '3rem' }}>ATELIER <span style={{ color: 'var(--text-cream)' }}>ADMIN</span></h1>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}><Calendar size={20} /></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{bookings.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Bookings</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}><Users size={20} /></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{new Set(bookings.map(b => b.user_id)).size}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Clients</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}><Activity size={20} /></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{logs.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Security Actions</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}><Shield size={20} /></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ACTIVE</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>System Status</div>
        </div>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Bookings Table */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} color="var(--gold)" /> APPOINTMENT LOG
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--gold)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem' }}>SESS ID</th>
                  <th style={{ padding: '1rem' }}>CLIENT</th>
                  <th style={{ padding: '1rem' }}>FLOOR</th>
                  <th style={{ padding: '1rem' }}>DATE & TIME</th>
                  <th style={{ padding: '1rem' }}>STATUS</th>
                  <th style={{ padding: '1rem' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>#S{booking.id.toString().padStart(4, '0')}</td>
                    <td style={{ padding: '1rem' }}>User ID: {booking.user_id}</td>
                    <td style={{ padding: '1rem' }}>FLOOR {booking.floor}</td>
                    <td style={{ padding: '1rem' }}>{new Date(booking.booking_time).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ color: getStatusColor(booking.status), fontWeight: '600', textTransform: 'uppercase', fontSize: '0.75rem' }}>{booking.status}</span>
                    </td>
                    <td style={{ padding: '1rem', display: 'flex', gap: '5px' }}>
                      <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} style={{ background: 'rgba(76, 175, 80, 0.2)', border: 'none', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}><Check size={16} color="#4caf50" /></button>
                      <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} style={{ background: 'rgba(244, 67, 54, 0.2)', border: 'none', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}><X size={16} color="#f44336" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="glass-card">
          <h2 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={24} color="var(--gold)" /> SECURITY FEED
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            {logs.slice().reverse().map(log => (
              <div key={log.id} style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1rem', paddingBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold' }}>{log.action}</div>
                <div style={{ fontSize: '0.85rem' }}>{log.details}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
