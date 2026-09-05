import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { compareCars } from '../services/carService';

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

const ROWS = [
  { label: 'Ex-showroom price', get: (c) => formatINR(c.exShowroomPrice) },
  { label: 'Body type', get: (c) => c.bodyType },
  { label: 'Fuel type', get: (c) => c.fuelType },
  { label: 'Transmission', get: (c) => c.transmission },
  { label: 'Mileage', get: (c) => `${c.mileage} ${c.fuelType === 'Electric' ? 'km/charge' : 'km/l'}` },
  { label: 'Seating', get: (c) => `${c.seating} seats` },
  { label: 'Safety rating', get: (c) => `${c.safetyRating}★` },
  { label: 'Rating', get: (c) => (c.reviewCount ? `★ ${c.avgRating} (${c.reviewCount})` : 'No reviews yet') },
  { label: 'Key features', get: (c) => c.features.join(', ') },
];

export default function CompareCars() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
    if (ids.length < 2) {
      setError('Select at least 2 cars to compare.');
      setLoading(false);
      return;
    }
    compareCars(ids)
      .then((res) => setCars(res.cars))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <div className="page loading">Loading comparison…</div>;
  if (error) {
    return (
      <div className="page">
        <div className="error-box">{error}</div>
        <Link to="/requirements" style={{ color: 'var(--ink-soft)', fontSize: 14 }}>← Find cars to compare</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Comparing {cars.length} cars</h1>
      <div style={{ overflowX: 'auto' }}>
        <table className="compare-table">
          <thead>
            <tr>
              <th></th>
              {cars.map((c) => (
                <th key={c.id}>
                  <img src={c.image} alt={c.model} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                  <div>{c.brand} {c.model}</div>
                  <div style={{ fontWeight: 400, color: 'var(--ink-soft)', fontSize: 13 }}>{c.variant}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <td className="compare-table-label">{row.label}</td>
                {cars.map((c) => (
                  <td key={c.id}>{row.get(c)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td></td>
              {cars.map((c) => (
                <td key={c.id}>
                  <Link to={`/car/${c.id}/price`} className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                    See true price
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
