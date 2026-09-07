import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsedCars() {
  const navigate = useNavigate();
  const [maxBudget, setMaxBudget] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/recommendations?maxBudget=${maxBudget}&isUsed=true`);
  }

  return (
    <div className="page" style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Used cars</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 28 }}>
        Certified listings with mileage, ownership history, and condition upfront — same transparent pricing approach as new cars.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Maximum budget (₹)</label>
          <input
            type="number"
            required
            placeholder="e.g. 800000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Show used cars
        </button>
      </form>
    </div>
  );
}
