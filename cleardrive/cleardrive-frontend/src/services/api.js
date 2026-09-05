// In development, Vite loads VITE_API_BASE_URL from .env.local (falls back to
// localhost). In production (Netlify), set VITE_API_BASE_URL in the site's
// environment variables to point at your deployed backend, e.g.
// https://cleardrive-backend.onrender.com/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('cleardrive_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Something went wrong' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export default request;
