import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    changePassword: (passwords) => api.post('/auth/change-password', passwords),
};

// User Management APIs (Admin)
export const userAPI = {
    getSalesManagers: () => api.get('/users/sales-managers'),
    createSalesManager: (data) => api.post('/users/sales-managers', data),
    resetPassword: (id, data) => api.put(`/users/sales-managers/${id}/reset-password`, data),
};

// Health Insurance APIs
export const healthInsuranceAPI = {
    getAll: (params) => api.get('/health-insurance', { params }),
    create: (data) => api.post('/health-insurance', data),
    update: (id, data) => api.put(`/health-insurance/${id}`, data),
    delete: (id) => api.delete(`/health-insurance/${id}`),
};

// Motor Insurance APIs
export const motorInsuranceAPI = {
    getAll: (params) => api.get('/motor-insurance', { params }),
    create: (data) => api.post('/motor-insurance', data),
    update: (id, data) => api.put(`/motor-insurance/${id}`, data),
    delete: (id) => api.delete(`/motor-insurance/${id}`),
};

// Life Insurance APIs
export const lifeInsuranceAPI = {
    getAll: (params) => api.get('/life-insurance', { params }),
    create: (data) => api.post('/life-insurance', data),
    update: (id, data) => api.put(`/life-insurance/${id}`, data),
    delete: (id) => api.delete(`/life-insurance/${id}`),
};

export default api;
