import { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';

function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('cleardrive_admin_token'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [tab, setTab] = useState('bookings');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await adminService.adminLogin(password);
      localStorage.setItem('cleardrive_admin_token', res.token);
      setToken(res.token);
    } catch (e) {
      setError(e.message);
    }
  }

  function loadBookings() {
    setLoading(true);
    adminService.getAdminBookings().then(setBookings).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  function loadCars() {
    setLoading(true);
    adminService.getAdminCars().then(setCars).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!token) return;
    if (tab === 'bookings') loadBookings();
    if (tab === 'cars') loadCars();
  }, [token, tab]);

  async function handleAdvance(id) {
    try {
      await adminService.adminAdvanceBooking(id);
      loadBookings();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handlePriceChange(car, newPrice) {
    try {
      await adminService.updateAdminCar(car.id, { exShowroomPrice: Number(newPrice) });
      loadCars();
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    localStorage.removeItem('cleardrive_admin_token');
    setToken(null);
  }

  if (!token) {
    return (
      <div className="page" style={{ maxWidth: 380 }}>
        <h1 style={{ fontSize: 26, marginBottom: 20 }}>Admin login</h1>
        {error && <div className="error-box">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Admin password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Log in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 26 }}>Admin dashboard</h1>
        <button onClick={logout} className="compare-bar-clear">Log out</button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <button className={tab === 'bookings' ? 'btn-primary' : 'compare-bar-clear'} onClick={() => setTab('bookings')}>Bookings</button>
        <button className={tab === 'cars' ? 'btn-primary' : 'compare-bar-clear'} onClick={() => setTab('cars')}>Cars & pricing</button>
      </div>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="loading">Loading…</div>}

      {tab === 'bookings' && !loading && (
        <div>
          {bookings.length === 0 && <p>No bookings yet.</p>}
          {bookings.map((b) => (
            <div key={b.id || b._id} className="notice-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>#{b.id || b._id}</strong> — {b.customerName} — {formatINR(b.finalPrice)}
                <div style={{ fontSize: 12.5 }}>Stage {b.currentStageIndex + 1} of {b.stages?.length || 5}</div>
              </div>
              <button className="btn-primary" onClick={() => handleAdvance(b.id || b._id)}>Advance stage</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'cars' && !loading && (
        <table className="compare-table" style={{ minWidth: 'unset' }}>
          <thead>
            <tr><th>Car</th><th>Ex-showroom price</th></tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id}>
                <td className="compare-table-label">{c.brand} {c.model} {c.variant}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={c.exShowroomPrice}
                    style={{ width: 140, padding: 6, border: '1px solid var(--line)', borderRadius: 6 }}
                    onBlur={(e) => e.target.value != c.exShowroomPrice && handlePriceChange(c, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'cars' && (
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-soft)' }}>
          Editing prices here requires MongoDB to be connected (MONGODB_URI set on the backend) — it won't persist in demo/in-memory mode.
        </p>
      )}
    </div>
  );
}
