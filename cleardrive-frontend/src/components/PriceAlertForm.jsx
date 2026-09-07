import { useState } from 'react';
import { createAlert } from '../services/alertService';

export default function PriceAlertForm({ carId, currentPrice }) {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.95));
  const [status, setStatus] = useState('idle'); // idle | saving | done | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      await createAlert({ carId, email, targetPrice });
      setStatus('done');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="notice-box" style={{ marginTop: 24 }}>
        You're set — we'll flag it if the on-road price for this car drops to ₹{targetPrice.toLocaleString('en-IN')} or below.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 18, marginBottom: 4 }}>Get notified on a price drop</h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 12 }}>
        Note: this saves your alert, but actually emailing you requires the site owner to connect a real email
        provider — ask them if this doesn't seem to be wired up yet.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="field" style={{ margin: 0 }}>
          <label>Your email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field" style={{ margin: 0, maxWidth: 180 }}>
          <label>Alert me at (₹)</label>
          <input type="number" required value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} />
        </div>
        <button type="submit" className="btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Set alert'}
        </button>
      </form>
      {error && <div className="error-box" style={{ marginTop: 8 }}>{error}</div>}
    </div>
  );
}
