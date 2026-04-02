import React, { useState } from 'react';
import { 
    Book, Code, Key, Shield, Zap, Database, 
    Globe, Smartphone, Lock, AlertTriangle, CheckCircle,
    ChevronRight, Copy, Search, Filter, Terminal
} from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import './ApiDocs.css';

const ApiDocs = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [copiedEndpoint, setCopiedEndpoint] = useState(null);

    const copyToClipboard = (text, endpoint) => {
        navigator.clipboard.writeText(text);
        setCopiedEndpoint(endpoint);
        setTimeout(() => setCopiedEndpoint(null), 2000);
    };

    const sections = [
        { id: 'overview', label: 'Overview', icon: Book },
        { id: 'authentication', label: 'Authentication', icon: Lock },
        { id: 'scans', label: 'Scans', icon: Search },
        { id: 'mfa', label: 'MFA', icon: Shield },
        { id: 'api-keys', label: 'API Keys', icon: Key },
        { id: 'webhooks', label: 'Webhooks', icon: Zap },
        { id: 'errors', label: 'Error Handling', icon: AlertTriangle },
    ];

    const endpoints = {
        authentication: [
            {
                method: 'POST',
                path: '/api/auth/register',
                description: 'Register a new user account',
                body: { username: 'string', email: 'string', password: 'string', fullName: 'string?' }
            },
            {
                method: 'POST',
                path: '/api/auth/login',
                description: 'Authenticate and get JWT token',
                body: { username: 'string', password: 'string' }
            },
            {
                method: 'POST',
                path: '/api/auth/logout',
                description: 'Invalidate current session'
            },
            {
                method: 'GET',
                path: '/api/auth/me',
                description: 'Get current user info'
            },
            {
                method: 'PUT',
                path: '/api/auth/profile',
                description: 'Update user profile',
                body: { fullName: 'string?', email: 'string?', currentPassword: 'string?', newPassword: 'string?' }
            },
            {
                method: 'POST',
                path: '/api/auth/forgot-password',
                description: 'Request password reset email',
                body: { email: 'string' }
            },
            {
                method: 'POST',
                path: '/api/auth/reset-password',
                description: 'Reset password with token',
                body: { token: 'string', userId: 'string', newPassword: 'string' }
            }
        ],
        scans: [
            {
                method: 'POST',
                path: '/api/scans/start',
                description: 'Start a new vulnerability scan',
                body: { url: 'string' }
            },
            {
                method: 'GET',
                path: '/api/scans',
                description: 'Get all scans (paginated)',
                query: { limit: 'number?', page: 'number?', status: 'string?' }
            },
            {
                method: 'GET',
                path: '/api/scans/:scanId/status',
                description: 'Get scan status and progress'
            },
            {
                method: 'GET',
                path: '/api/scans/:scanId/results',
                description: 'Get scan vulnerability results',
                query: { severity: 'string?', limit: 'number?', offset: 'number?' }
            },
            {
                method: 'POST',
                path: '/api/scans/:scanId/cancel',
                description: 'Cancel a running scan'
            },
            {
                method: 'DELETE',
                path: '/api/scans/:scanId',
                description: 'Delete a scan (soft delete)'
            },
            {
                method: 'GET',
                path: '/api/scans/stats/dashboard',
                description: 'Get dashboard statistics'
            }
        ],
        mfa: [
            {
                method: 'GET',
                path: '/api/mfa/status',
                description: 'Get MFA enrollment status'
            },
            {
                method: 'POST',
                path: '/api/mfa/setup',
                description: 'Initialize MFA setup',
                body: { method: '"totp" | "email"' }
            },
            {
                method: 'POST',
                path: '/api/mfa/verify',
                description: 'Verify MFA code and enable',
                body: { code: 'string' }
            },
            {
                method: 'POST',
                path: '/api/mfa/disable',
                description: 'Disable MFA',
                body: { code: 'string' }
            },
            {
                method: 'POST',
                path: '/api/mfa/verify-backup',
                description: 'Verify backup code',
                body: { code: 'string' }
            }
        ],
        'api-keys': [
            {
                method: 'GET',
                path: '/api/api-keys',
                description: 'List all API keys'
            },
            {
                method: 'POST',
                path: '/api/api-keys',
                description: 'Create new API key',
                body: { name: 'string', scopes: 'string[]', expiresIn: 'number?' }
            },
            {
                method: 'GET',
                path: '/api/api-keys/:id',
                description: 'Get API key details'
            },
            {
                method: 'DELETE',
                path: '/api/api-keys/:id',
                description: 'Revoke API key'
            },
            {
                method: 'POST',
                path: '/api/api-keys/:id/rotate',
                description: 'Rotate API key'
            }
        ],
        webhooks: [
            {
                method: 'GET',
                path: '/api/webhooks',
                description: 'List all webhooks'
            },
            {
                method: 'POST',
                path: '/api/webhooks',
                description: 'Create new webhook',
                body: { name: 'string', url: 'string', events: 'string[]' }
            },
            {
                method: 'POST',
                path: '/api/webhooks/:id/test',
                description: 'Send test webhook'
            },
            {
                method: 'DELETE',
                path: '/api/webhooks/:id',
                description: 'Delete webhook'
            },
            {
                method: 'GET',
                path: '/api/webhooks/events',
                description: 'Get available webhook events'
            }
        ]
    };

    const getMethodColor = (method) => {
        switch (method) {
            case 'GET': return 'method-get';
            case 'POST': return 'method-post';
            case 'PUT': return 'method-put';
            case 'DELETE': return 'method-delete';
            default: return '';
        }
    };

    const renderEndpoint = (endpoint, index) => (
        <div key={index} className="endpoint-item">
            <div className="endpoint-header">
                <div className="endpoint-method-path">
                    <span className={`endpoint-method ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                    </span>
                    <code className="endpoint-path">{endpoint.path}</code>
                    <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(endpoint.path, endpoint.path)}
                        title="Copy path"
                    >
                        <Copy size={14} />
                        {copiedEndpoint === endpoint.path && <span className="copied-text">Copied!</span>}
                    </button>
                </div>
                <p className="endpoint-description">{endpoint.description}</p>
            </div>

            {(endpoint.body || endpoint.query) && (
                <div className="endpoint-params">
                    {endpoint.body && (
                        <div className="param-group">
                            <h5>Body</h5>
                            <pre>{JSON.stringify(endpoint.body, null, 2)}</pre>
                        </div>
                    )}
                    {endpoint.query && (
                        <div className="param-group">
                            <h5>Query Parameters</h5>
                            <pre>{JSON.stringify(endpoint.query, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <PageContainer title="API Documentation" subtitle="Integrate with VulnScan Pro programmatically">
            <div className="api-docs-page">
                <div className="api-docs-sidebar">
                    <div className="sidebar-section">
                        <h3>Contents</h3>
                        <nav className="sidebar-nav">
                            {sections.map(section => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        className={`sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <Icon size={16} />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="sidebar-section">
                        <h3>Base URL</h3>
                        <code className="base-url">http://localhost:5004</code>
                    </div>

                    <div className="sidebar-section">
                        <h3>Authentication</h3>
                        <p className="sidebar-text">All endpoints (except auth) require Bearer token:</p>
                        <pre className="auth-example">
{`Authorization: Bearer <token>`}
                        </pre>
                    </div>
                </div>

                <div className="api-docs-content">
                    {activeSection === 'overview' && (
                        <div className="docs-section">
                            <h2>API Overview</h2>
                            <p className="section-intro">
                                VulnScan Pro provides a RESTful API for programmatic access to vulnerability scanning,
                                user management, and integration capabilities.
                            </p>

                            <Card className="info-card">
                                <h3><Terminal size={18} /> Rate Limits</h3>
                                <ul>
                                    <li><strong>Free tier:</strong> 100 requests/minute</li>
                                    <li><strong>Pro tier:</strong> 1000 requests/minute</li>
                                    <li><strong>Enterprise:</strong> Custom limits</li>
                                </ul>
                            </Card>

                            <Card className="info-card">
                                <h3><CheckCircle size={18} /> Response Format</h3>
                                <p>All responses are JSON with these common fields:</p>
                                <pre>{`{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}`}</pre>
                            </Card>

                            <Card className="info-card">
                                <h3><AlertTriangle size={18} /> Error Format</h3>
                                <pre>{`{
  "error": "Error message",
  "code": "ERROR_CODE"
}`}</pre>
                            </Card>
                        </div>
                    )}

                    {activeSection === 'authentication' && (
                        <div className="docs-section">
                            <h2>Authentication</h2>
                            <p className="section-intro">
                                Handle user registration, login, and password management.
                            </p>
                            {endpoints.authentication.map((ep, i) => renderEndpoint(ep, i))}
                        </div>
                    )}

                    {activeSection === 'scans' && (
                        <div className="docs-section">
                            <h2>Scans</h2>
                            <p className="section-intro">
                                Start, monitor, and manage vulnerability scans.
                            </p>
                            {endpoints.scans.map((ep, i) => renderEndpoint(ep, i))}
                        </div>
                    )}

                    {activeSection === 'mfa' && (
                        <div className="docs-section">
                            <h2>Multi-Factor Authentication</h2>
                            <p className="section-intro">
                                Configure and manage MFA for enhanced account security.
                            </p>
                            {endpoints.mfa.map((ep, i) => renderEndpoint(ep, i))}
                        </div>
                    )}

                    {activeSection === 'api-keys' && (
                        <div className="docs-section">
                            <h2>API Keys</h2>
                            <p className="section-intro">
                                Create and manage API keys for programmatic access.
                            </p>
                            {endpoints['api-keys'].map((ep, i) => renderEndpoint(ep, i))}

                            <Card className="example-card">
                                <h3>Example: Create Scan with API Key</h3>
                                <pre>{`curl -X POST https://api.vulnscan.pro/api/scans/start \\
  -H "X-API-Key: vk_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}</pre>
                            </Card>
                        </div>
                    )}

                    {activeSection === 'webhooks' && (
                        <div className="docs-section">
                            <h2>Webhooks</h2>
                            <p className="section-intro">
                                Receive real-time notifications when events occur.
                            </p>
                            {endpoints.webhooks.map((ep, i) => renderEndpoint(ep, i))}

                            <Card className="example-card">
                                <h3>Available Events</h3>
                                <ul className="events-list">
                                    <li><code>scan.complete</code> - Scan finished</li>
                                    <li><code>vulnerability.found</code> - New vulnerability detected</li>
                                    <li><code>scan.started</code> - Scan initiated</li>
                                    <li><code>user.login</code> - User logged in</li>
                                    <li><code>critical.alert</code> - Critical vulnerability found</li>
                                </ul>
                            </Card>

                            <Card className="example-card">
                                <h3>Webhook Payload Example</h3>
                                <pre>{`{
  "event": "scan.complete",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "scanId": "abc-123",
    "url": "https://example.com",
    "status": "completed",
    "vulnerabilities": {
      "critical": 2,
      "high": 5,
      "medium": 10
    }
  }
}`}</pre>
                            </Card>
                        </div>
                    )}

                    {activeSection === 'errors' && (
                        <div className="docs-section">
                            <h2>Error Handling</h2>
                            <p className="section-intro">
                                Standard HTTP status codes and error response format.
                            </p>

                            <Card className="error-card">
                                <h3><AlertTriangle size={18} /> 400 Bad Request</h3>
                                <p>Invalid input or missing required fields</p>
                                <pre>{`{
  "error": "Validation failed",
  "details": ["username is required"]
}`}</pre>
                            </Card>

                            <Card className="error-card">
                                <h3><Lock size={18} /> 401 Unauthorized</h3>
                                <p>Invalid or expired authentication token</p>
                                <pre>{`{
  "error": "Invalid authentication token"
}`}</pre>
                            </Card>

                            <Card className="error-card">
                                <h3><Shield size={18} /> 403 Forbidden</h3>
                                <p>Insufficient permissions for this action</p>
                                <pre>{`{
  "error": "Admin access required"
}`}</pre>
                            </Card>

                            <Card className="error-card">
                                <h3><Search size={18} /> 404 Not Found</h3>
                                <p>Requested resource does not exist</p>
                                <pre>{`{
  "error": "Scan not found"
}`}</pre>
                            </Card>

                            <Card className="error-card">
                                <h3><Zap size={18} /> 429 Too Many Requests</h3>
                                <p>Rate limit exceeded</p>
                                <pre>{`{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}`}</pre>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default ApiDocs;
