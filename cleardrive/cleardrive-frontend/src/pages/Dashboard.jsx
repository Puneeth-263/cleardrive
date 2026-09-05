import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [bookingId, setBookingId] = useState('');
  const navigate = useNavigate();

  function handleTrack(e) {
    e.preventDefault();
    if (bookingId) navigate(`/booking/${bookingId}/track`);
  }

  return (
    <div className="page" style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>Track a booking</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>
        Enter your booking ID (shown when you booked a car) to see live status.
      </p>
      <form onSubmit={handleTrack}>
        <div className="field">
          <label>Booking ID</label>
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Track my booking
        </button>
      </form>
    </div>
  );
}
