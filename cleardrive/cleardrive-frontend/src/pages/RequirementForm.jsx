import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RequirementForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    maxBudget: '',
    minBudget: '',
    fuelType: '',
    bodyType: '',
    transmission: '',
    isUsed: '',
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/recommendations?${params.toString()}`);
  }

  return (
    <div className="page" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>What are you looking for?</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 32 }}>
        We'll match cars to your budget and needs — no sales pressure, no bias.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Maximum budget (ex-showroom, ₹)</label>
          <input
            type="number"
            required
            placeholder="e.g. 1200000"
            value={form.maxBudget}
            onChange={(e) => update('maxBudget', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Minimum budget (optional, ₹)</label>
          <input
            type="number"
            placeholder="e.g. 800000"
            value={form.minBudget}
            onChange={(e) => update('minBudget', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Fuel type</label>
          <select value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)}>
            <option value="">Any</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div className="field">
          <label>Body type</label>
          <select value={form.bodyType} onChange={(e) => update('bodyType', e.target.value)}>
            <option value="">Any</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
          </select>
        </div>

        <div className="field">
          <label>Transmission</label>
          <select value={form.transmission} onChange={(e) => update('transmission', e.target.value)}>
            <option value="">Any</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div className="field">
          <label>New or used?</label>
          <select value={form.isUsed} onChange={(e) => update('isUsed', e.target.value)}>
            <option value="">Either</option>
            <option value="false">New only</option>
            <option value="true">Used only</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Show matching cars
        </button>
      </form>
    </div>
  );
}
