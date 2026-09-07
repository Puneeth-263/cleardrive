import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PriceBreakdown from '../components/PriceBreakdown';
import EmiCalculator from '../components/EmiCalculator';
import ReviewsSection from '../components/ReviewsSection';
import PriceAlertForm from '../components/PriceAlertForm';
import { useAuth } from '../context/AuthContext';
import { getCarById } from '../services/carService';
import { calculatePrice } from '../services/priceService';
import { createBooking } from '../services/bookingService';

const STATES = [
  'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra',
  'Delhi', 'Gujarat', 'Kerala', 'West Bengal', 'Uttar Pradesh',
];

export default function PriceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [state, setState] = useState('Andhra Pradesh');
  const [wantsExtendedWarranty, setWantsExtendedWarranty] = useState(false);
  const [accessoriesTotal, setAccessoriesTotal] = useState(0);
  const [applyDiscount, setApplyDiscount] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    getCarById(id).then(setCar).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => {
    if (!car) return;
    calculatePrice({
      carId: car.id,
      state,
      wantsExtendedWarranty,
      accessoriesTotal,
      applyDiscount,
    })
      .then(setPriceData)
      .catch((e) => setError(e.message));
  }, [car, state, wantsExtendedWarranty, accessoriesTotal, applyDiscount]);

  async function handleBookNow() {
    if (!priceData) return;
    setBooking(true);
    try {
      const result = await createBooking({
        carId: car.id,
        customerName: user ? user.name : 'Guest User',
        phone: '0000000000',
        finalPrice: priceData.breakdown.totals.finalOnRoadPrice,
      });
      navigate(`/booking/${result.id}/track`);
    } catch (e) {
      setError(e.message);
      setBooking(false);
    }
  }

  if (error) return <div className="page"><div className="error-box">{error}</div></div>;
  if (!car) return <div className="page loading">Loading car details…</div>;

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 26, marginBottom: 4 }}>
        {car.brand} {car.model} — {car.variant}
      </h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>
        Every cost below is itemized. Nothing is added at delivery time.
      </p>

      <div className="field">
        <label>Registration state (affects RTO tax)</label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={wantsExtendedWarranty}
            onChange={(e) => setWantsExtendedWarranty(e.target.checked)}
          />
          Add extended warranty (optional)
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={applyDiscount}
            onChange={(e) => setApplyDiscount(e.target.checked)}
          />
          Apply active manufacturer discount
        </label>
      </div>

      <div className="field" style={{ maxWidth: 260 }}>
        <label>Accessories total (optional, ₹)</label>
        <input
          type="number"
          min="0"
          value={accessoriesTotal}
          onChange={(e) => setAccessoriesTotal(Number(e.target.value) || 0)}
        />
      </div>

      {priceData && (
        <>
          <PriceBreakdown data={priceData} />
          <button
            className="btn-primary"
            style={{ marginTop: 24, width: '100%' }}
            onClick={handleBookNow}
            disabled={booking}
          >
            {booking ? 'Booking…' : 'Book this car at this price'}
          </button>

          <EmiCalculator emiOptions={priceData.emiOptions} />
          <PriceAlertForm carId={car.id} currentPrice={priceData.breakdown.totals.finalOnRoadPrice} />
        </>
      )}

      <ReviewsSection carId={car.id} />
    </div>
  );
}
