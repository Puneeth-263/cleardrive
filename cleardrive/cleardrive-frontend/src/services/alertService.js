import request from './api';

export function createAlert(payload) {
  return request('/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
