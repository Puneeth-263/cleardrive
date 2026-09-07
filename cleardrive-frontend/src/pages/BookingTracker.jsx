import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProcessTracker from '../components/ProcessTracker';
import { getBooking, advanceBooking } from '../services/bookingService';

function formatINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export default function BookingTracker() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  const fetchBooking = useCallback(() => {
    getBooking(id).then(setBooking).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    fetchBooking();
    // Poll every 5s to simulate real-time updates coming from the showroom side.
    const interval = setInterval(fetchBooking, 5000);
    return () => clearInterval(interval);
  }, [fetchBooking]);

  // Demo-only control so you can see the tracker move without a real showroom backend.
  async function simulateShowroomUpdate() {
    await advanceBooking(id);
    fetchBooking();
  }

  if (error) return <div className="page"><div className="error-box">{error}</div></div>;
  if (!booking) return <div className="page loading">Loading your booking…</div>;

  const isComplete = booking.currentStageIndex === booking.stages.length - 1;

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>Booking #{booking.id}</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 8 }}>
        Locked-in price: <strong>{formatINR(booking.finalPrice)}</strong>
      </p>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 32, fontSize: 13.5 }}>
        This page updates automatically as the showroom moves your car through each stage.
      </p>

      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: '28px 32px' }}>
        <ProcessTracker booking={booking} />
      </div>

      {!isComplete && (
        <button className="btn-primary" style={{ marginTop: 24 }} onClick={simulateShowroomUpdate}>
          Simulate next stage (demo only)
        </button>
      )}

      {isComplete && (
        <p style={{ marginTop: 24, color: 'var(--forest)', fontWeight: 600 }}>
          Your car has been delivered. Congratulations!
        </p>
      )}
    </div>
  );
}
