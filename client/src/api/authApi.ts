import api from './axios';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  signup: (data: {
    employeeId: string;
    email: string;
    password: string;
    fullName: string;
    position: string;
    department: string;
    role?: string;
  }) => api.post('/auth/signup', data),

  getMe: () => api.get('/auth/me'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: () => api.post('/auth/logout'),
};