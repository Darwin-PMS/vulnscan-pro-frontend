import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Clock, AlertTriangle, Check, X, Info } from 'lucide-react';
import './MFAEnforcement.css';

const MFAEnforcement = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        enforce_mfa: false,
        enforce_mfa_roles: ['super_admin', 'admin', 'security_supervisor'],
        grace_period_days: 7,
        message: 'MFA is required for your account.',
        allowed_methods: ['totp', 'email']
    });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const availableRoles = [
        { id: 'super_admin', label: 'Super Admin', description: 'Full system access' },
        { id: 'admin', label: 'Admin', description: 'Tenant administration' },
        { id: 'security_supervisor', label: 'Security Supervisor', description: 'Scan and team management' },
        { id: 'analyst', label: 'Analyst', description: 'Scan execution and triage' },
        { id: 'member', label: 'Team Member', description: 'Basic access' }
    ];

    const availableMethods = [
        { id: 'totp', label: 'Authenticator App (TOTP)', description: 'Google Authenticator, Authy, etc.' },
        { id: 'email', label: 'Email OTP', description: 'One-time code via email' }
    ];

    useEffect(() => {
        fetchSettings();
        fetchStats();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('/api/tenant/mfa-enforcement');
            setSettings(response.data);
        } catch (err) {
            console.error('Failed to fetch MFA settings:', err);
            setError('Failed to load MFA settings');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/mfa-enforcement/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch MFA stats:', err);
        }
    };

    const handleToggle = (field) => {
        setSettings(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleRoleToggle = (roleId) => {
        setSettings(prev => {
            const roles = prev.enforce_mfa_roles.includes(roleId)
                ? prev.enforce_mfa_roles.filter(r => r !== roleId)
                : [...prev.enforce_mfa_roles, roleId];
            return { ...prev, enforce_mfa_roles: roles };
        });
    };

    const handleMethodToggle = (methodId) => {
        setSettings(prev => {
            const methods = prev.allowed_methods.includes(methodId)
                ? prev.allowed_methods.filter(m => m !== methodId)
                : [...prev.allowed_methods, methodId];
            return { ...prev, allowed_methods: methods };
        });
    };

    const handleInputChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await axios.put('/api/tenant/mfa-enforcement', settings);
            setSuccess('MFA enforcement settings saved successfully');
            fetchStats();
        } catch (err) {
            console.error('Failed to save MFA settings:', err);
            setError(err.response?.data?.error || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mfa-enforcement-loading">
                <div className="spinner"></div>
                <p>Loading MFA settings...</p>
            </div>
        );
    }

    return (
        <div className="mfa-enforcement-page">
            <div className="page-header">
                <div className="header-content">
                    <h1><Shield /> MFA Enforcement</h1>
                    <p>Configure mandatory multi-factor authentication for your organization</p>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <AlertTriangle /> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <Check /> {success}
                </div>
            )}

            {stats?.enabled && (
                <div className="stats-card">
                    <h3>Current Status</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">{stats.stats?.total_users || 0}</span>
                            <span className="stat-label">Total Enforced Users</span>
                        </div>
                        <div className="stat-item success">
                            <span className="stat-value">{stats.stats?.mfa_enabled_count || 0}</span>
                            <span className="stat-label">MFA Enabled</span>
                        </div>
                        <div className="stat-item warning">
                            <span className="stat-value">{stats.stats?.mfa_disabled_count || 0}</span>
                            <span className="stat-label">MFA Not Enabled</span>
                        </div>
                        <div className="stat-item info">
                            <span className="stat-value">{stats.stats?.in_grace_period || 0}</span>
                            <span className="stat-label">In Grace Period</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="settings-section">
                <div className="section-card">
                    <div className="section-header">
                        <h2><Shield /> Enable MFA Enforcement</h2>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.enforce_mfa}
                                onChange={() => handleToggle('enforce_mfa')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <p className="section-description">
                        When enabled, selected users must set up multi-factor authentication 
                        to access the platform. Users without MFA will be restricted until they complete setup.
                    </p>

                    {settings.enforce_mfa && (
                        <div className="grace-period-setting">
                            <label>
                                <Clock /> Grace Period (days)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="30"
                                value={settings.grace_period_days}
                                onChange={(e) => handleInputChange('grace_period_days', parseInt(e.target.value))}
                            />
                            <span className="help-text">
                                Time given to users to set up MFA after enforcement is enabled
                            </span>
                        </div>
                    )}
                </div>

                {settings.enforce_mfa && (
                    <>
                        <div className="section-card">
                            <h2><Users /> Enforced Roles</h2>
                            <p className="section-description">
                                Select which roles require MFA. Users in these roles will need to set up MFA.
                            </p>
                            <div className="roles-list">
                                {availableRoles.map(role => (
                                    <div
                                        key={role.id}
                                        className={`role-item ${settings.enforce_mfa_roles.includes(role.id) ? 'selected' : ''}`}
                                        onClick={() => handleRoleToggle(role.id)}
                                    >
                                        <div className="role-checkbox">
                                            {settings.enforce_mfa_roles.includes(role.id) ? (
                                                <Check className="checked" />
                                            ) : (
                                                <X className="unchecked" />
                                            )}
                                        </div>
                                        <div className="role-info">
                                            <span className="role-name">{role.label}</span>
                                            <span className="role-desc">{role.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section-card">
                            <h2><Info /> Allowed MFA Methods</h2>
                            <p className="section-description">
                                Choose which MFA methods users can use to authenticate.
                            </p>
                            <div className="methods-list">
                                {availableMethods.map(method => (
                                    <div
                                        key={method.id}
                                        className={`method-item ${settings.allowed_methods.includes(method.id) ? 'selected' : ''}`}
                                        onClick={() => handleMethodToggle(method.id)}
                                    >
                                        <div className="method-checkbox">
                                            {settings.allowed_methods.includes(method.id) ? (
                                                <Check className="checked" />
                                            ) : (
                                                <X className="unchecked" />
                                            )}
                                        </div>
                                        <div className="method-info">
                                            <span className="method-name">{method.label}</span>
                                            <span className="method-desc">{method.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="section-card">
                            <h2>Custom Message</h2>
                            <p className="section-description">
                                Message shown to users when MFA is required.
                            </p>
                            <textarea
                                value={settings.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                placeholder="Enter a custom message for users..."
                                rows={3}
                            />
                        </div>

                        <div className="section-card warning-card">
                            <AlertTriangle />
                            <div>
                                <h3>Important Notice</h3>
                                <p>
                                    Once MFA enforcement is enabled, users in the selected roles who haven't 
                                    set up MFA will be locked out after the grace period expires. Make sure 
                                    to communicate this change to your team before enabling.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="action-buttons">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/security')}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving || (settings.enforce_mfa && settings.enforce_mfa_roles.length === 0)}
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default MFAEnforcement;
