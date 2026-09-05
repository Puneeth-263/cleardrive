import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import './CarCard.css';

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=600';

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

export default function CarCard({ car }) {
  const { selected, toggle } = useCompare();
  const isSelected = selected.some((c) => c.id === car.id);
  const compareDisabled = !isSelected && selected.length >= 3;

  return (
    <div className="car-card">
      <img
        src={car.image}
        alt={`${car.brand} ${car.model}`}
        className="car-card-image"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
      <div className="car-card-top">
        <span className="car-card-body-type">{car.bodyType}</span>
        <span className="car-card-safety">{car.safetyRating}★ safety</span>
      </div>
      <h3>
        {car.brand} {car.model}
      </h3>
      <p className="car-card-variant">
        {car.variant}
        {car.isUsed && <span className="car-card-used-badge"> · Used, {car.year}</span>}
      </p>

      {car.reviewCount > 0 && (
        <p className="car-card-rating">
          ★ {car.avgRating} <span>({car.reviewCount} review{car.reviewCount === 1 ? '' : 's'})</span>
        </p>
      )}

      <div className="car-card-specs">
        <span>{car.fuelType}</span>
        <span>·</span>
        <span>{car.transmission}</span>
        <span>·</span>
        <span>{car.mileage} {car.fuelType === 'Electric' ? 'km/charge' : 'km/l'}</span>
      </div>

      {car.isUsed ? (
        <p className="car-card-used-meta">
          {car.kmDriven?.toLocaleString('en-IN')} km · {car.owners} owner{car.owners === 1 ? '' : 's'} · {car.condition}
        </p>
      ) : (
        <ul className="car-card-features">
          {car.features.slice(0, 3).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      <label className="car-card-compare">
        <input
          type="checkbox"
          checked={isSelected}
          disabled={compareDisabled}
          onChange={() => toggle(car)}
        />
        Add to compare
      </label>

      <div className="car-card-footer">
        <div>
          <div className="car-card-price-label">{car.isUsed ? 'Asking price' : 'Ex-showroom'}</div>
          <div className="car-card-price">{formatINR(car.exShowroomPrice)}</div>
        </div>
        <Link to={`/car/${car.id}/price`} className="car-card-cta">
          See true price
        </Link>
      </div>
    </div>
  );
}
