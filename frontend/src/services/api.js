import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname.includes('/jg-admin')) {
        window.location.href = '/jg-admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const aboutAPI = {
  get: () => api.get('/about/'),
  update: (id, data) => api.put(`/about/${id}`, data),
  uploadImage: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/about/${id}/upload-image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadResume: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/about/${id}/upload-resume`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const skillsAPI = {
  get: () => api.get('/skills/'),
  categories: () => api.get('/skills/categories'),
  create: (data) => api.post('/skills/', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export const projectsAPI = {
  get: (status) => api.get('/projects/', { params: { status } }),
  featured: () => api.get('/projects/featured'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadThumbnail: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/projects/${id}/upload-thumbnail`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadImage: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/projects/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteImage: (projectId, imageId) => api.delete(`/projects/${projectId}/images/${imageId}`),
};

export const certificatesAPI = {
  get: () => api.get('/certificates/'),
  getById: (id) => api.get(`/certificates/${id}`),
  create: (data) => api.post('/certificates/', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
  uploadImage: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/certificates/${id}/upload-image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadPdf: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/certificates/${id}/upload-pdf`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const educationAPI = {
  get: () => api.get('/education/'),
  create: (data) => api.post('/education/', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
};

export const experienceAPI = {
  get: () => api.get('/experience/'),
  create: (data) => api.post('/experience/', data),
  update: (id, data) => api.put(`/experience/${id}`, data),
  delete: (id) => api.delete(`/experience/${id}`),
};

export const contactAPI = {
  get: () => api.get('/contact/'),
  update: (id, data) => api.put(`/contact/${id}`, data),
};

export const analyticsAPI = {
  track: () => api.post('/analytics/track'),
  summary: () => api.get('/analytics/summary'),
};

export const settingsAPI = {
  get: () => api.get('/settings/'),
  update: (id, data) => api.put(`/settings/${id}`, data),
};
