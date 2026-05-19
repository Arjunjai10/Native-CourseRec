import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_NODE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const switchBackend = (choice) => {
    // Disabled - Java backend removed
};

export const getActiveBackend = () => {
    return 'Node.js (Express)';
};

api.interceptors.request.use(
    async (config) => {
        let token;
        if (Platform.OS === 'web') {
            token = localStorage.getItem('token');
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    signup: (userData) => api.post('/auth/signup', userData),
};

export const userAPI = {
    getProfile: (userId) => api.get(`/users/profile/${userId}`),
    updateProfile: (userId, data) => api.put(`/users/profile/${userId}`, data),
    updatePassword: (userId, data) => api.put(`/users/security/${userId}`, data),
    updateNotifications: (userId, data) => api.put(`/users/notifications/${userId}`, data),
    enroll: (courseId) => api.post(`/users/enroll/${courseId}`),
    complete: (courseId) => api.post(`/users/complete/${courseId}`),
    updateProgress: (hours) => api.post('/users/progress', { hours }),
    submitSupport: (data) => api.post('/users/support', data),
    bookmark: (courseId) => api.post(`/users/bookmark/${courseId}`),
};

export const courseAPI = {
    getAll: (params = {}) => api.get('/courses', { params }),
    getById: (id) => api.get(`/courses/${id}`),
    getRecommendations: (userId) => api.get(`/courses/recommendations/${userId}`),
    getCategories: () => api.get('/courses/categories'),
};

export default api;
