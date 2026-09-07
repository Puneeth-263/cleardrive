const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function adminRequest(path, options = {}) {
  const token = localStorage.getItem('cleardrive_admin_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Something went wrong' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export function adminLogin(password) {
  return adminRequest('/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
}

export function getAdminBookings() {
  return adminRequest('/admin/bookings');
}

export function adminAdvanceBooking(id) {
  return adminRequest(`/admin/bookings/${id}/advance`, { method: 'POST' });
}

export function getAdminCars() {
  return adminRequest('/admin/cars');
}

export function updateAdminCar(id, updates) {
  return adminRequest(`/admin/cars/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export function updateAdminDiscount(carId, updates) {
  return adminRequest(`/admin/discounts/${carId}`, { method: 'PUT', body: JSON.stringify(updates) });
}
