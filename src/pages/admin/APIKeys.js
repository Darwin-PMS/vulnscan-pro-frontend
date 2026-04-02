import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Plus, Trash2, Copy, RefreshCw, Check, X, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { apiKeyApi } from '../../services/api';
import { Button, Card, Input, Modal } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import { useToast } from '../../contexts/ToastContext';
import './APIKeys.css';

const APIKeys = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showNewKey, setShowNewKey] = useState(null);
    const [newKeyName, setNewKeyName] = useState('');
    const [selectedScopes, setSelectedScopes] = useState(['scan:read']);
    const [expiresIn, setExpiresIn] = useState(90);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadKeys();
    }, []);

    const loadKeys = async () => {
        try {
            const response = await apiKeyApi.getAll();
            setKeys(response.data);
        } catch (error) {
            console.error('Failed to load API keys:', error);
            toast.error('Failed to load API keys');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newKeyName.trim()) {
            toast.error('Please enter a name for the API key');
            return;
        }

        setCreating(true);
        try {
            const response = await apiKeyApi.create({
                name: newKeyName.trim(),
                scopes: selectedScopes,
                expiresIn
            });
            
            setShowCreate(false);
            setShowNewKey(response.data);
            setNewKeyName('');
            setSelectedScopes(['scan:read']);
            toast.success('API key created successfully');
        } catch (error) {
            console.error('Failed to create API key:', error);
            toast.error(error.response?.data?.error || 'Failed to create API key');
        } finally {
            setCreating(false);
        }
    };

    const handleRevoke = async (keyId, keyName) => {
        if (!window.confirm(`Are you sure you want to revoke "${keyName}"? Applications using this key will stop working.`)) {
            return;
        }

        try {
            await apiKeyApi.revoke(keyId);
            setKeys(keys.filter(k => k.id !== keyId));
            toast.success('API key revoked');
        } catch (error) {
            console.error('Failed to revoke API key:', error);
            toast.error('Failed to revoke API key');
        }
    };

    const handleRotate = async (keyId) => {
        if (!window.confirm('This will invalidate the current key and create a new one. Continue?')) {
            return;
        }

        try {
            const response = await apiKeyApi.rotate(keyId);
            setKeys(keys.map(k => k.id === keyId ? { ...k, name: response.data.name } : k));
            toast.success('API key rotated successfully');
        } catch (error) {
            console.error('Failed to rotate API key:', error);
            toast.error('Failed to rotate API key');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const toggleScope = (scope) => {
        setSelectedScopes(prev => 
            prev.includes(scope) 
                ? prev.filter(s => s !== scope)
                : [...prev, scope]
        );
    };

    const scopes = [
        { id: 'scan:read', name: 'Read Scans', description: 'View scan results and vulnerabilities' },
        { id: 'scan:create', name: 'Create Scans', description: 'Start new vulnerability scans' },
        { id: 'scan:delete', name: 'Delete Scans', description: 'Delete scan results' },
        { id: 'report:read', name: 'Read Reports', description: 'View and download reports' },
        { id: 'report:create', name: 'Create Reports', description: 'Generate new reports' },
        { id: 'vuln:read', name: 'Read Vulnerabilities', description: 'View vulnerability details' },
        { id: 'vuln:update', name: 'Update Vulnerabilities', description: 'Update vulnerability status' }
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <PageContainer
            title="API Keys"
            subtitle="Manage API keys for programmatic access"
        >
            <div className="api-keys-page">
                <Card className="api-keys-header">
                    <div className="header-content">
                        <div>
                            <h2>API Keys</h2>
                            <p>Use API keys to access VulnScan Pro programmatically</p>
                        </div>
                        <Button leftIcon={<Plus size={16} />} onClick={() => setShowCreate(true)}>
                            Create API Key
                        </Button>
                    </div>
                </Card>

                <Card className="api-keys-list-card">
                    {loading ? (
                        <div className="loading-state">
                            <RefreshCw className="animate-spin" size={24} />
                            <p>Loading API keys...</p>
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="empty-state">
                            <Key size={48} />
                            <h3>No API keys yet</h3>
                            <p>Create your first API key to start integrating programmatically</p>
                            <Button onClick={() => setShowCreate(true)}>
                                Create API Key
                            </Button>
                        </div>
                    ) : (
                        <div className="keys-list">
                            {keys.map(key => (
                                <div key={key.id} className="key-item">
                                    <div className="key-info">
                                        <div className="key-name">
                                            <Key size={18} />
                                            <span>{key.name}</span>
                                        </div>
                                        <div className="key-meta">
                                            <span className="key-prefix">{key.key_prefix}_***</span>
                                            <span className="separator">|</span>
                                            <span>Created {formatDate(key.created_at)}</span>
                                            <span className="separator">|</span>
                                            <span>Last used {formatDate(key.last_used_at)}</span>
                                            {key.expires_at && (
                                                <>
                                                    <span className="separator">|</span>
                                                    <span className="expires">Expires {formatDate(key.expires_at)}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="key-scopes">
                                            {JSON.parse(key.scopes || '[]').map(scope => (
                                                <span key={scope} className="scope-badge">{scope}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="key-actions">
                                        <button 
                                            className="action-btn"
                                            onClick={() => handleRotate(key.id)}
                                            title="Rotate key"
                                        >
                                            <RefreshCw size={16} />
                                        </button>
                                        <button 
                                            className="action-btn danger"
                                            onClick={() => handleRevoke(key.id, key.name)}
                                            title="Revoke key"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="api-keys-info">
                    <h3>About API Keys</h3>
                    <ul>
                        <li>API keys provide programmatic access to VulnScan Pro</li>
                        <li>Keys are shown only once after creation - store them securely</li>
                        <li>You can set expiration dates for temporary access</li>
                        <li>Rotate keys regularly for enhanced security</li>
                        <li>Use scopes to limit what each key can access</li>
                    </ul>
                    <div className="code-example">
                        <p>Example API usage:</p>
                        <pre>
{`curl -X POST https://api.vulnscan.pro/api/scans \\
  -H "Authorization: Bearer vsk_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"targetUrl": "https://example.com"}'`}
                        </pre>
                    </div>
                </Card>
            </div>

            <Modal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                title="Create API Key"
            >
                <div className="create-key-form">
                    <Input
                        label="Name"
                        placeholder="My API Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                    />

                    <div className="form-group">
                        <label>Scopes</label>
                        <div className="scopes-list">
                            {scopes.map(scope => (
                                <label key={scope.id} className="scope-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedScopes.includes(scope.id)}
                                        onChange={() => toggleScope(scope.id)}
                                    />
                                    <div>
                                        <strong>{scope.name}</strong>
                                        <span>{scope.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Expires in</label>
                        <select 
                            value={expiresIn} 
                            onChange={(e) => setExpiresIn(parseInt(e.target.value))}
                            className="expires-select"
                        >
                            <option value={30}>30 days</option>
                            <option value={90}>90 days</option>
                            <option value={180}>6 months</option>
                            <option value={365}>1 year</option>
                            <option value={-1}>Never</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <Button variant="secondary" onClick={() => setShowCreate(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} loading={creating}>
                            Create Key
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!showNewKey}
                onClose={() => setShowNewKey(null)}
                title="API Key Created"
            >
                <div className="new-key-display">
                    <div className="warning-banner">
                        <AlertTriangle size={20} />
                        <p>Make sure to copy your API key now. You won't be able to see it again!</p>
                    </div>

                    <div className="key-display">
                        <label>Your API Key</label>
                        <div className="key-value">
                            <code>{showNewKey?.key}</code>
                            <button onClick={() => copyToClipboard(showNewKey?.key)}>
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="key-info-box">
                        <p><strong>Name:</strong> {showNewKey?.name}</p>
                        <p><strong>Key Prefix:</strong> {showNewKey?.keyPrefix}</p>
                        <p><strong>Scopes:</strong> {showNewKey?.scopes?.join(', ')}</p>
                    </div>

                    <Button onClick={() => setShowNewKey(null)} className="done-btn">
                        I've Saved My Key
                    </Button>
                </div>
            </Modal>
        </PageContainer>
    );
};

export default APIKeys;
