import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5004/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000
});

// Rate limit retry configuration
const RETRY_DELAY = 2000;
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 429 Rate Limit with retry
        if (error.response?.status === 429 && !originalRequest._retry) {
            originalRequest._retry = originalRequest._retry || 0;
            
            if (originalRequest._retry < MAX_RETRIES) {
                originalRequest._retry++;
                const retryDelay = RETRY_DELAY * originalRequest._retry;
                
                console.log(`Rate limited. Retrying in ${retryDelay}ms (attempt ${originalRequest._retry}/${MAX_RETRIES})`);
                
                await sleep(retryDelay);
                return api(originalRequest);
            }
        }
        
        // Handle 401/403 - Logout user
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
    updateProfile: (data) => api.put('/auth/profile', data),
    
    // Password Reset
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, userId, newPassword) => api.post('/auth/reset-password', { token, userId, newPassword }),
    verifyResetToken: (token, userId) => api.get('/auth/verify-reset-token', { params: { token, userId } }),
    
    // MFA
    setupMFA: (method, data) => api.post('/mfa/setup', { method, ...data }),
    verifyMFA: (code) => api.post('/mfa/verify', { code }),
    verifyEmailOTP: (code) => api.post('/mfa/verify-email', { code }),
    getMFAStatus: () => api.get('/mfa/status'),
    disableMFA: (code) => api.post('/mfa/disable', { code }),
    verifyBackupCode: (code) => api.post('/mfa/verify-backup', { code })
};

// API Keys
export const apiKeyApi = {
    getAll: () => api.get('/api-keys'),
    create: (data) => api.post('/api-keys', data),
    getById: (id) => api.get(`/api-keys/${id}`),
    revoke: (id) => api.delete(`/api-keys/${id}`),
    rotate: (id) => api.post(`/api-keys/${id}/rotate`)
};

// Webhooks
export const webhookApi = {
    getAll: () => api.get('/webhooks'),
    create: (data) => api.post('/webhooks', data),
    getById: (id) => api.get(`/webhooks/${id}`),
    update: (id, data) => api.put(`/webhooks/${id}`, data),
    delete: (id) => api.delete(`/webhooks/${id}`),
    test: (id) => api.post(`/webhooks/${id}/test`),
    getDeliveries: (id, params) => api.get(`/webhooks/${id}/deliveries`, { params }),
    getEvents: () => api.get('/webhooks/events')
};

// Notifications
export const notificationApi = {
    getAll: (params) => api.get('/notifications', { params }),
    getById: (id) => api.get(`/notifications/${id}`),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
    clearAll: () => api.delete('/notifications/clear-all'),
    getSettings: () => api.get('/notifications/settings'),
    updateSettings: (settings) => api.put('/notifications/settings', settings),
    getUnreadCount: () => api.get('/notifications/unread-count')
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
    cancelScan: (scanId) => api.post(`/scans/${scanId}/cancel`),
    getRunningScans: () => api.get('/scans/running'),
    getDashboardStats: () => api.get('/scans/stats/dashboard'),
    getUserStats: () => api.get('/scans/user/stats'),
    // Scheduled scans
    getSchedules: () => api.get('/scans/schedules'),
    createSchedule: (data) => api.post('/scans/schedules', data),
    updateSchedule: (id, data) => api.put(`/scans/schedules/${id}`, data),
    deleteSchedule: (id) => api.delete(`/scans/schedules/${id}`),
    // Scan templates
    getTemplates: () => api.get('/scans/templates'),
    createTemplate: (data) => api.post('/scans/templates', data),
    updateTemplate: (id, data) => api.put(`/scans/templates/${id}`, data),
    deleteTemplate: (id) => api.delete(`/scans/templates/${id}`),
    applyTemplate: (id, targetUrl) => api.post(`/scans/templates/${id}/apply`, { targetUrl }),
    // Scan control
    retryScan: (scanId) => api.post(`/scans/${scanId}/retry`),
    pauseScan: (scanId) => api.post(`/scans/${scanId}/pause`),
    resumeScan: (scanId) => api.post(`/scans/${scanId}/resume`),
    // Bulk scanning
    bulkScan: (targets, options) => api.post('/scans/bulk', { targets, ...options })
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

// Enterprise API
export const enterpriseApi = {
    // NIST CSF
    getCompliance: () => api.get('/enterprise/nist/compliance'),
    getIdentify: () => api.get('/enterprise/nist/identify'),
    getProtect: () => api.get('/enterprise/nist/protect'),
    getDetect: (params) => api.get('/enterprise/nist/detect', { params }),
    getRiskRegister: () => api.get('/enterprise/nist/risk-register'),

    // Incidents
    getIncidents: (params) => api.get('/enterprise/incidents', { params }),
    createIncident: (data) => api.post('/enterprise/incidents', data),
    escalateIncident: (ticketId, data) => api.put(`/enterprise/incidents/${ticketId}/escalate`, data),

    // Audit
    getAuditLogs: (params) => api.get('/enterprise/audit/logs', { params }),
    searchAuditLogs: (params) => api.get('/enterprise/audit/search', { params }),
    getSecurityEvents: (params) => api.get('/enterprise/audit/security-events', { params }),
    getAnomalies: () => api.get('/enterprise/audit/anomalies'),
    getComplianceReport: (params) => api.get('/enterprise/audit/compliance-report', { params }),

    // MFA
    setupMFA: (method) => api.post('/enterprise/mfa/setup', { method }),
    verifyMFA: (code) => api.post('/enterprise/mfa/verify', { code }),
    getMFAStatus: () => api.get('/enterprise/mfa/status'),
    disableMFA: (code) => api.post('/enterprise/mfa/disable', { code }),

    // RBAC
    getPermissions: () => api.get('/enterprise/rbac/permissions'),
    getRoles: () => api.get('/enterprise/rbac/roles'),
    assignRole: (userId, role) => api.put(`/enterprise/rbac/users/${userId}/role`, { role }),
    getRoleAudit: (params) => api.get('/enterprise/rbac/audit', { params }),

    // Privacy
    getConsents: () => api.get('/enterprise/privacy/consents'),
    createConsent: (data) => api.post('/enterprise/privacy/consent', data),
    withdrawConsent: (type) => api.delete(`/enterprise/privacy/consent/${type}`),
    exportData: () => api.post('/enterprise/privacy/export'),
    deleteData: (data) => api.post('/enterprise/privacy/delete', data),

    // Zero Trust
    calculateSessionTrust: (data) => api.post('/enterprise/zero-trust/session-trust', data),
    registerDevice: (data) => api.post('/enterprise/zero-trust/device', data),

    // AI Governance
    validatePrompt: (prompt) => api.post('/enterprise/ai/validate', { prompt }),
    calculateTrustScore: (data) => api.post('/enterprise/ai/trust-score', data),
    getAIAnalytics: (range) => api.get('/enterprise/ai/usage-analytics', { params: { range } }),

    // Stats
    getStats: () => api.get('/enterprise/stats'),
    getAlerts: () => api.get('/enterprise/alerts')
};

// Enterprise Dashboard API
export const enterpriseDashboardApi = {
    getOverview: () => api.get('/enterprise/stats'),
    getNISTCompliance: () => api.get('/enterprise/nist/compliance'),
    getAlerts: () => api.get('/enterprise/alerts'),
    getIncidents: (params) => api.get('/enterprise/incidents', { params }),
    getAuditLogs: (params) => api.get('/enterprise/audit/logs', { params }),
    getSecurityEvents: () => api.get('/enterprise/audit/security-events'),
    getAnomalies: () => api.get('/enterprise/audit/anomalies')
};

// Scan Modules API (OWASP, GHDB, API, Cloud, CI/CD, Mobile, LLM, Container)
export const scanModulesApi = {
    getModules: () => api.get('/scan-modules/modules'),
    getOWASPCategories: () => api.get('/scan-modules/modules/owasp/categories'),
    getGHDBPatterns: () => api.get('/scan-modules/modules/ghdb/categories'),
    getAPICategories: () => api.get('/scan-modules/modules/api/categories'),
    getCloudCategories: () => api.get('/scan-modules/modules/cloud/categories'),
    getCICDSCategories: () => api.get('/scan-modules/modules/cicd/categories'),
    getMobileCategories: () => api.get('/scan-modules/modules/mobile/categories'),
    getLLMCategories: () => api.get('/scan-modules/modules/llm/categories'),
    getContainerCategories: () => api.get('/scan-modules/modules/container/categories'),
    runScan: (url, module) => api.post('/scan-modules/modules/scan', { url, module }),
    runOWASPScan: (url) => api.post('/scan-modules/modules/owasp/scan', { url }),
    runGHDBPScan: (url) => api.post('/scan-modules/modules/ghdb/scan', { url }),
    runAPIScan: (url) => api.post('/scan-modules/modules/api/scan', { url }),
    runCloudScan: (url) => api.post('/scan-modules/modules/cloud/scan', { url }),
    runCICDPScan: (url) => api.post('/scan-modules/modules/cicd/scan', { url }),
    runMobileScan: (data) => api.post('/scan-modules/modules/mobile/scan', data),
    runLLMScan: (data) => api.post('/scan-modules/modules/llm/scan', data),
    runLLMValidate: (data) => api.post('/scan-modules/modules/llm/validate', data),
    runContainerScan: (data) => api.post('/scan-modules/modules/container/scan', data),
    runMultiScan: (url, modules) => api.post('/scan-modules/modules/multi-scan', { url, modules }),
    getScans: (params) => api.get('/scan-modules/modules/scans', { params }),
    getScanById: (scanId) => api.get(`/scan-modules/modules/scan/${scanId}`)
};

export default api;