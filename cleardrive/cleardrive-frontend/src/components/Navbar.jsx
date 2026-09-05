import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/requirements', label: 'Find my car' },
    { to: '/used-cars', label: 'Used cars' },
    { to: user ? '/my-bookings' : '/dashboard', label: 'My bookings' },
  ];

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Clear<span>Drive</span>
      </Link>
      <nav className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <>
            <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>Hi, {user.name.split(' ')[0]}</span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: 'var(--ink-soft)', textDecoration: 'underline' }}
            >
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Log in</Link>
        )}
      </nav>
    </header>
  );
}
