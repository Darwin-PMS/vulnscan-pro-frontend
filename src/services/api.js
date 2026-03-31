import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

// Scan API
export const scanApi = {
    startScan: (url) => api.post('/scans/start', { url }),
    getAllScans: (params) => api.get('/scans', { params }),
    getScanStatus: (scanId) => api.get(`/scans/${scanId}/status`),
    getScanResults: (scanId, params) => api.get(`/scans/${scanId}/results`, { params }),
    getScanHistory: (scanId) => api.get(`/scans/${scanId}/history`),
    getVulnerabilityById: (vulnId) => api.get(`/scans/vulnerability/${vulnId}`),
    deleteScan: (scanId) => api.delete(`/scans/${scanId}`),
    getDashboardStats: () => api.get('/scans/stats/dashboard'),
    getUserStats: () => api.get('/scans/user/stats')
};

// Dork API
export const dorkApi = {
    getAllPatterns: () => api.get('/dorks'),
    getPatternsByCategory: (category) => api.get(`/dorks/category/${category}`),
    getPatternByGhdbId: (ghdbId) => api.get(`/dorks/ghdb/${ghdbId}`)
};

// AI API
export const aiApi = {
    chat: (message, context) => api.post('/ai/chat', { message, context }),
    analyzeVulnerability: (vulnerabilityData) => api.post('/ai/analyze', { vulnerabilityData }),
    generateReportSummary: (scanResults) => api.post('/ai/report-summary', { scanResults }),
    suggestRemediation: (vulnerabilityType, severity) => api.post('/ai/remediation', { vulnerabilityType, severity }),
    explainCVE: (cveId) => api.get(`/ai/cve/${cveId}`),
    getSecurityTips: () => api.get('/ai/tips')
};

// Mobile App Security API
export const mobileApi = {
    scanAPK: (content, platform, appName) => api.post('/mobile/scan', { content, platform, app_name: appName }),
    analyzeManifest: (content, platform) => api.post('/mobile/analyze/manifest', { content, platform }),
    analyzeCode: (content, platform) => api.post('/mobile/analyze/code', { content, platform }),
    analyzeNetwork: (content, platform) => api.post('/mobile/analyze/network', { content, platform }),
    getPatterns: (platform) => api.get(`/mobile/patterns/${platform}`),
    getTools: (platform) => api.get(`/mobile/tools/${platform}`),
    getSecurityGuide: (platform) => api.get(`/mobile/guide/${platform}`)
};

// Admin API
export const adminApi = {
    getDashboardStats: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserById: (userId) => api.get(`/admin/users/${userId}`),
    createUser: (userData) => api.post('/admin/users', userData),
    updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
    getSubscriptions: (params) => api.get('/admin/subscriptions', { params }),
    updateSubscription: (subId, data) => api.put(`/admin/subscriptions/${subId}`, data),
    getTiers: () => api.get('/admin/tiers'),
    updateTier: (tierId, data) => api.put(`/admin/tiers/${tierId}`, data),
    getScans: (params) => api.get('/admin/scans', { params }),
    deleteScan: (scanId) => api.delete(`/admin/scans/${scanId}`)
};

export default api;