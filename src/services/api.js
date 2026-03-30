import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Scan API
export const scanApi = {
    startScan: (url) => api.post('/scans/start', { url }),
    getAllScans: (params) => api.get('/scans', { params }),
    getScanStatus: (scanId) => api.get(`/scans/${scanId}/status`),
    getScanResults: (scanId, params) => api.get(`/scans/${scanId}/results`, { params }),
    getScanHistory: (scanId) => api.get(`/scans/${scanId}/history`),
    getVulnerabilityById: (vulnId) => api.get(`/scans/vulnerability/${vulnId}`),
    deleteScan: (scanId) => api.delete(`/scans/${scanId}`),
    getDashboardStats: () => api.get('/scans/stats/dashboard')
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

export default api;