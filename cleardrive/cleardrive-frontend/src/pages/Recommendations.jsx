import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import CompareBar from '../components/CompareBar';
import { getRecommendations } from '../services/carService';

export default function Recommendations() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const isUsedParam = searchParams.get('isUsed');
    const payload = {
      maxBudget: searchParams.get('maxBudget'),
      minBudget: searchParams.get('minBudget') || undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      bodyType: searchParams.get('bodyType') || undefined,
      transmission: searchParams.get('transmission') || undefined,
      isUsed: isUsedParam ? isUsedParam === 'true' : undefined,
    };

    setLoading(true);
    getRecommendations(payload)
      .then((res) => setCars(res.cars))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="page">
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Cars matching your requirements</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>
        Sorted by fit to your budget. Tap any car to see its full, itemized on-road price.
      </p>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="loading">Finding your best matches…</div>}

      {!loading && cars.length === 0 && !error && (
        <p>No cars matched your filters. Try widening your budget or removing a filter.</p>
      )}

      <div className="grid-cars">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      <div style={{ marginTop: 32, marginBottom: 80 }}>
        <Link to="/requirements" style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
          ← Adjust my requirements
        </Link>
      </div>
      <CompareBar />
    </div>
  );
}
