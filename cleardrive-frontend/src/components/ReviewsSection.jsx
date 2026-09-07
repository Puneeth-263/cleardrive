import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReviews, addReview } from '../services/reviewService';

export default function ReviewsSection({ carId }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getReviews(carId).then(setData).catch((e) => setError(e.message));
  }

  useEffect(load, [carId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return setError('Please select a star rating');
    if (!user && !name.trim()) return setError('Please enter your name');

    setSubmitting(true);
    setError('');
    try {
      await addReview(carId, { rating, comment, name: user ? undefined : name });
      setRating(0);
      setComment('');
      setName('');
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontSize: 18, marginBottom: 8 }}>
        Reviews {data && data.reviewCount > 0 && `— ★ ${data.avgRating} (${data.reviewCount})`}
      </h3>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div className="star-input" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n <= rating ? 'filled' : ''} onClick={() => setRating(n)}>★</span>
          ))}
        </div>

        {!user && (
          <div className="field" style={{ maxWidth: 280 }}>
            <label>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya S." />
          </div>
        )}

        <div className="field">
          <label>Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={{ width: '100%', fontFamily: 'var(--font-body)', padding: 10, borderRadius: 8, border: '1px solid var(--line)' }}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post review'}
        </button>
      </form>

      {data && data.reviews.length === 0 && <p style={{ color: 'var(--ink-soft)' }}>No reviews yet — be the first.</p>}

      {data && data.reviews.map((r) => (
        <div key={r.id || r._id} className="review-item">
          <div className="review-item-header">
            <span><strong>{r.name}</strong> — {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            <span>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
          {r.comment && <p style={{ margin: 0, fontSize: 14 }}>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
