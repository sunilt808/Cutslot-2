import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Award, Clock, Calendar, ChevronRight, Gift, History } from 'lucide-react';

const Profile = () => {
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
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [api]);

  return (
    <div className="profile-container fade-in-up">
      <h1 className="serif gradient-text" style={{ fontSize: '3rem', marginBottom: '3rem' }}>LUXURY <span style={{ color: 'var(--text-cream)' }}>PROFILE</span></h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        {/* Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--gold-glow)', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <User size={60} color="var(--gold)" />
            </div>
            <h2 className="serif" style={{ fontSize: '1.8rem' }}>{user?.username}</h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>{user?.email}</p>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>LOYALTY TIER</div>
              <div className="serif" style={{ fontSize: '1.6rem', color: 'var(--gold)' }}>{user?.loyalty_points > 1000 ? "PLATINUM" : "GOLD"}</div>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="serif" style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Gift size={20} color="var(--gold)" /> REWARDS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Loyalty Points</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Redeem for services</div>
                </div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{user?.loyalty_points} PTS</div>
              </div>
              <button className="btn-gold" style={{ width: '100%', borderRadius: '10px', fontSize: '0.85rem' }}>REDEEM POINTS</button>
            </div>
          </div>
        </div>

        {/* History / Appointments */}
        <div className="glass-card">
          <h3 className="serif" style={{ fontSize: '1.8rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <History size={28} color="var(--gold)" /> APPOINTMENT HISTORY
          </h3>
          
          {loading ? (
            <div style={{ color: 'var(--gold)' }}>FETCHING HISTORY...</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              <Calendar size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>No past appointments found. Time to book a session?</p>
              <button onClick={() => window.location.href='/floors'} className="btn-gold" style={{ marginTop: '1.5rem' }}>BROWSE FLOORS</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--gold)', background: 'var(--gold-glow)', padding: '1rem', borderRadius: '12px' }}>
                      <Clock size={24} />
                    </div>
                    <div>
                      <div className="serif" style={{ fontSize: '1.3rem' }}>{booking.stylist_name || "Assigned Stylist"}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Floor {booking.floor} | {new Date(booking.booking_time).toLocaleDateString()} at {new Date(booking.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '3px' }}>STATUS</div>
                    <div style={{ fontWeight: 'bold', textTransform: 'capitalize', color: booking.status === 'confirmed' ? '#4caf50' : 'var(--gold)' }}>{booking.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
