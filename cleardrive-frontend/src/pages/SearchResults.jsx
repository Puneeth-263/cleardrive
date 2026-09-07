import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import CompareBar from '../components/CompareBar';
import { searchCars } from '../services/carService';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }
    setLoading(true);
    searchCars(q)
      .then((res) => setCars(res.cars))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q]);

  if (loading) return <div className="page loading">Searching…</div>;

  return (
    <div className="page">
      <h1 style={{ fontSize: 26, marginBottom: 8 }}>Results for "{q}"</h1>
      {error && <div className="error-box">{error}</div>}
      {!error && cars.length === 0 && (
        <p style={{ color: 'var(--ink-soft)' }}>
          No cars matched that search. Try a brand or model name, like "Creta" or "Swift". Or{' '}
          <Link to="/requirements">search by budget instead</Link>.
        </p>
      )}
      <div className="grid-cars" style={{ marginTop: 20, marginBottom: 80 }}>
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      <CompareBar />
    </div>
  );
}
