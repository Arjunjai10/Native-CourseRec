import axios from 'axios';
import { Platform } from 'react-native';

// Modern IP-based addressing for mobile access (replace with your local IP if changed)
const LOCAL_IP = '172.17.27.226'; 

const NODE_API_URL = Platform.OS === 'web' ? 'http://localhost:5000/api' : `http://${LOCAL_IP}:5000/api`;
const JAVA_API_URL = Platform.OS === 'web' ? 'http://localhost:8080/api' : `http://${LOCAL_IP}:8080/api`;

// Dynamic selection
let activeUrl = NODE_API_URL;
if (Platform.OS === 'web') {
    const savedBackend = localStorage.getItem('backend_choice');
    if (savedBackend === 'java') {
        activeUrl = JAVA_API_URL;
    }
} else {
    // Force IP for andoird/ios dev
}

const api = axios.create({
    baseURL: activeUrl,
});

// Helper to switch backend at runtime (requires reload usually)
export const switchBackend = (choice) => {
    if (Platform.OS === 'web') {
        localStorage.setItem('backend_choice', choice);
        window.location.reload();
    }
};

export const getActiveBackend = () => {
    return activeUrl === JAVA_API_URL ? 'Java (Spring Boot)' : 'Node.js (Express)';
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
};

export const courseAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    getRecommendations: (userId) => api.get(`/courses/recommendations/${userId}`),
};

export default api;
