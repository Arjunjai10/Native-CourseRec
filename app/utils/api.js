import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    async (config) => {
        let token;
        if (Platform.OS === 'web') {
            token = localStorage.getItem('token');
        }
        // Note: For native, we would typically use AsyncStorage here

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
};

export const courseAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    getRecommendations: (userId) => api.get(`/courses/recommendations/${userId}`),
};

export default api;
