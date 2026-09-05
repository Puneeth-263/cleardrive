import request from './api';

export function calculatePrice(payload) {
  return request('/price/calculate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
