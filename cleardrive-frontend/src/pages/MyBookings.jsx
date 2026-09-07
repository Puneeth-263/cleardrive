import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../services/bookingService';

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    getMyBookings()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  if (authLoading || loading) return <div className="page loading">Loading your bookings…</div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>My bookings</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
        Bookings you've made while logged in as {user.name}.
      </p>

      {error && <div className="error-box">{error}</div>}

      {bookings.length === 0 && !error && (
        <p>
          No bookings yet. <Link to="/requirements">Find a car</Link> to get started.
        </p>
      )}

      {bookings.map((b) => (
        <div key={b.id || b._id} className="notice-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Booking #{b.id || b._id}</strong>
            <div>{formatINR(b.finalPrice)} · {new Date(b.createdAt).toLocaleDateString('en-IN')}</div>
          </div>
          <Link to={`/booking/${b.id || b._id}/track`} className="btn-primary" style={{ textDecoration: 'none' }}>
            Track status
          </Link>
        </div>
      ))}

      <p style={{ marginTop: 24, fontSize: 13, color: 'var(--ink-soft)' }}>
        Have a booking from before you had an account?{' '}
        <Link to="/dashboard">Track it by booking ID</Link> instead.
      </p>
    </div>
  );
}
