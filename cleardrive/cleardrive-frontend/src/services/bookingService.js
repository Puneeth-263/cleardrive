import request from './api';

export function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getBooking(id) {
  return request(`/bookings/${id}`);
}

export function advanceBooking(id) {
  return request(`/bookings/${id}/advance`, { method: 'POST' });
}

export function getMyBookings() {
  return request('/bookings/mine');
}
