import api from './api';

export const adminAPI = {
  // User Management
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Course Management
  createCourse: (data) => api.post('/admin/courses', data),
  updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSetting: (key, value) => api.post('/admin/settings', { key, value }),
  deleteSetting: (id) => api.delete(`/admin/settings/${id}`)
};
