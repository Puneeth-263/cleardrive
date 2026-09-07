import request from './api';

export function getReviews(carId) {
  return request(`/reviews/${carId}`);
}

export function addReview(carId, payload) {
  return request(`/reviews/${carId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
