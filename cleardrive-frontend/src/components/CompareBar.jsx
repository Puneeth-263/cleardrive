import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import './CompareBar.css';

export default function CompareBar() {
  const { selected, toggle, clear } = useCompare();
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  return (
    <div className="compare-bar">
      <div className="compare-bar-cars">
        {selected.map((car) => (
          <span key={car.id} className="compare-bar-chip">
            {car.brand} {car.model}
            <button onClick={() => toggle(car)} aria-label={`Remove ${car.model} from comparison`}>×</button>
          </span>
        ))}
      </div>
      <div className="compare-bar-actions">
        <button className="compare-bar-clear" onClick={clear}>Clear</button>
        <button
          className="btn-primary"
          disabled={selected.length < 2}
          onClick={() => navigate(`/compare?ids=${selected.map((c) => c.id).join(',')}`)}
        >
          Compare {selected.length > 1 ? `(${selected.length})` : ''}
        </button>
      </div>
    </div>
  );
}
