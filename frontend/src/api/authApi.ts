import { api } from './client';

export const authApi = {
  register: (payload: { name: string; username: string; email: string; password: string }) =>
    api.post('/auth/register', payload),

  login: (payload: { identifier: string; password: string; rememberMe?: boolean }) =>
    api.post('/auth/login', payload),

  logout: () => api.post('/auth/logout'),

  logoutAll: () => api.post('/auth/logout-all'),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', payload),

  me: () => api.get('/users/me'),
};
