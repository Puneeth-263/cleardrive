import request from './api';

export function getAllCars() {
  return request('/cars');
}

export function getCarById(id) {
  return request(`/cars/${id}`);
}

export function getRecommendations(requirements) {
  return request('/cars/recommendations', {
    method: 'POST',
    body: JSON.stringify(requirements),
  });
}

export function compareCars(ids) {
  return request('/cars/compare', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}
