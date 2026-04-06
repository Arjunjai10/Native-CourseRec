import axios from 'axios';
import { Platform } from 'react-native';

// Toggle this to switch between Node (5000) and Java (8080) backends
const USE_JAVA_BACKEND = false; 

const NODE_API_URL = 'http://localhost:5000/api';
const JAVA_API_URL = 'http://localhost:8080/api';

const API_URL = USE_JAVA_BACKEND ? JAVA_API_URL : NODE_API_URL;

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
    updateProfile: (userId, data) => api.put(`/users/profile/${userId}`, data),
};

export const courseAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    getRecommendations: (userId) => api.get(`/courses/recommendations/${userId}`),
};

export default api;
