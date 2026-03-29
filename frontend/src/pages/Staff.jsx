import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Check, X, Bell, User as UserIcon, Scissors, Clock } from 'lucide-react';

const Staff = () => {
  const { user, api } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await api.get('/bookings/');
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching staff bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [api]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert("Status update failed.");
    }
  };

  if (user?.role !== 'staff') {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h1 className="serif">STAFF ACCESS ONLY</h1>
        <p style={{ color: 'var(--text-dim)' }}>Please log in as a worker to manage floor sessions.</p>
      </div>
    );
  }

  return (
    <div className="staff-container fade-in-up">
      <header style={{ marginBottom: '3rem', borderLeft: '4px solid var(--gold)', paddingLeft: '1.5rem' }}>
        <h1 className="serif gradient-text" style={{ fontSize: '3rem', margin: 0 }}>WORKER <span style={{ color: 'var(--text-cream)' }}>DASHBOARD</span></h1>
        <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Managing <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>FLOOR {user.assigned_floor || "ALL"}</span> | Welcome back, {user.username}.</p>
      </header>

      <div className="staff-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h2 className="serif" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} color="var(--gold)" /> UPCOMING DUTIES
          </h2>
          
          {loading ? (
            <div style={{ color: 'var(--gold)' }}>LOADING TASKS...</div>
          ) : bookings.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', padding: '2rem', textAlign: 'center' }}>No assigned tasks on your floor today.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {bookings.map(booking => (
                <div key={booking.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--gold)', textAlign: 'center', borderRight: '1px solid var(--glass-border)', paddingRight: '1.5rem' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{new Date(booking.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>TODAY</div>
                    </div>
                    <div>
                      <div className="serif" style={{ fontSize: '1.3rem' }}>{booking.stylist_name} <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontStyle: 'italic' }}> - Client ID: {booking.user_id}</span></div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Scissors size={14} /> Service #{booking.service_id} | Floor {booking.floor}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {booking.status === 'pending' ? (
                      <>
                        <button onClick={() => updateStatus(booking.id, 'confirmed')} className="btn-gold" style={{ padding: '0.6rem 1rem', background: '#4caf50', border: 'none', color: 'white' }}>
                          <Check size={18} /> CONFIRM
                        </button>
                        <button onClick={() => updateStatus(booking.id, 'cancelled')} className="btn-gold" style={{ padding: '0.6rem 1rem', background: 'transparent', borderColor: '#f44336', color: '#f44336' }}>
                          <X size={18} /> REJECT
                        </button>
                      </>
                    ) : (
                       <div style={{ color: booking.status === 'confirmed' ? '#4caf50' : '#f44336', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', border: '1px solid', padding: '0.5rem 1rem', borderRadius: '5px' }}>
                         {booking.status}
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <h3 className="serif" style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={20} color="var(--gold)" /> NOTICES
            </h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              Maintain floor hygiene. <br /><br />
              Ensure premium experience for VIP clients. <br /><br />
              Report any equipment issues immediately.
            </div>
          </div>

          <div className="glass-card" style={{ background: 'linear-gradient(rgba(212,175,55,0.05), transparent)' }}>
            <h3 className="serif" style={{ fontSize: '1.4rem', marginBottom: '1.2rem' }}>YOUR STATUS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Shift</span>
                <span style={{ color: 'var(--gold)' }}>8:00 AM - 4:00 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Floor Performance</span>
                <span style={{ color: '#4caf50' }}>EXCELLENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
