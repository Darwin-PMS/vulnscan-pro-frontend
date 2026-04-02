import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Key, Check, X, ChevronRight, ChevronLeft, Copy, Link } from 'lucide-react';
import './SSOConfiguration.css';

const SSOConfiguration = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [config, setConfig] = useState({
        provider: 'okta',
        client_id: '',
        client_secret: '',
        issuer_url: '',
        sso_url: '',
        certificate: '',
        enabled: false,
        enforce_sso: false,
        allowed_roles: [],
        auto_provision: true
    });

    const [existingConfig, setExistingConfig] = useState(null);
    const [testResult, setTestResult] = useState(null);

    const providers = [
        { id: 'okta', name: 'Okta', logo: 'O', description: 'Okta Identity Cloud' },
        { id: 'azure_ad', name: 'Azure AD', logo: 'A', description: 'Microsoft Azure Active Directory' },
        { id: 'google', name: 'Google', logo: 'G', description: 'Google Workspace' },
        { id: 'saml', name: 'SAML 2.0', logo: 'S', description: 'Generic SAML Provider' },
        { id: 'oidc', name: 'OIDC', logo: 'O', description: 'OpenID Connect' }
    ];

    const steps = [
        { id: 1, title: 'Provider', description: 'Select SSO provider' },
        { id: 2, title: 'Credentials', description: 'Enter app credentials' },
        { id: 3, title: 'Configure', description: 'SSO settings' },
        { id: 4, title: 'Test', description: 'Test connection' },
        { id: 5, title: 'Activate', description: 'Enable SSO' }
    ];

    useEffect(() => {
        fetchExistingConfig();
    }, []);

    const fetchExistingConfig = async () => {
        try {
            const response = await axios.get('/api/sso/config');
            if (response.data) {
                setExistingConfig(response.data);
                setConfig({
                    provider: response.data.provider,
                    client_id: response.data.client_id || '',
                    client_secret: '',
                    issuer_url: response.data.issuer_url || '',
                    sso_url: response.data.sso_url || '',
                    certificate: response.data.certificate || '',
                    enabled: response.data.enabled || false,
                    enforce_sso: response.data.enforce_sso || false,
                    allowed_roles: response.data.allowed_roles || [],
                    auto_provision: response.data.auto_provision !== false
                });
            }
        } catch (err) {
            console.log('No existing SSO config found');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        
        try {
            await axios.post('/api/sso/config', config);
            setSuccess('SSO configuration saved successfully');
            fetchExistingConfig();
            handleNext();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        setTestResult(null);
        
        try {
            const response = await axios.post('/api/sso/test', config);
            setTestResult({ success: true, message: 'Connection successful!' });
        } catch (err) {
            setTestResult({ 
                success: false, 
                message: err.response?.data?.error || 'Connection failed. Please check your settings.' 
            });
        }
    };

    const handleEnableSSO = async () => {
        setSaving(true);
        
        try {
            await axios.put('/api/sso/config/enable', { enabled: true });
            setSuccess('SSO is now enabled!');
            fetchExistingConfig();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to enable SSO');
        } finally {
            setSaving(false);
        }
    };

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const generateACSUrl = () => {
        return `${window.location.origin}/api/sso/callback`;
    };

    const generateSPMetadata = () => {
        return {
            entityId: `${window.location.origin}/api/sso/metadata`,
            acsUrl: generateACSUrl(),
            sloUrl: `${window.location.origin}/api/sso/logout`,
            nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
        };
    };

    if (loading) {
        return (
            <div className="sso-config-loading">
                <div className="spinner"></div>
                <p>Loading SSO configuration...</p>
            </div>
        );
    }

    return (
        <div className="sso-configuration-page">
            <div className="page-header">
                <h1><Key /> SSO Configuration</h1>
                <p>Set up Single Sign-On for your organization</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    <X /> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <Check /> {success}
                </div>
            )}

            <div className="wizard-progress">
                {steps.map((s, index) => (
                    <div 
                        key={s.id}
                        className={`progress-step ${step >= s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
                        onClick={() => step > s.id && setStep(s.id)}
                    >
                        <div className="step-number">
                            {step > s.id ? <Check /> : s.id}
                        </div>
                        <div className="step-info">
                            <span className="step-title">{s.title}</span>
                            <span className="step-desc">{s.description}</span>
                        </div>
                        {index < steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                ))}
            </div>

            <div className="wizard-content">
                {step === 1 && (
                    <div className="step-content">
                        <h2>Select Identity Provider</h2>
                        <p>Choose the identity provider your organization uses for authentication.</p>
                        
                        <div className="providers-grid">
                            {providers.map(provider => (
                                <div
                                    key={provider.id}
                                    className={`provider-card ${config.provider === provider.id ? 'selected' : ''}`}
                                    onClick={() => handleInputChange('provider', provider.id)}
                                >
                                    <div className="provider-logo">{provider.logo}</div>
                                    <div className="provider-info">
                                        <span className="provider-name">{provider.name}</span>
                                        <span className="provider-desc">{provider.description}</span>
                                    </div>
                                    {config.provider === provider.id && <Check className="selected-check" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h2>Enter Application Credentials</h2>
                        <p>Get these values from your {providers.find(p => p.id === config.provider)?.name} application settings.</p>
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Client ID / Application ID</label>
                                <input
                                    type="text"
                                    value={config.client_id}
                                    onChange={(e) => handleInputChange('client_id', e.target.value)}
                                    placeholder="Enter Client ID"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Client Secret</label>
                                <input
                                    type="password"
                                    value={config.client_secret}
                                    onChange={(e) => handleInputChange('client_secret', e.target.value)}
                                    placeholder={existingConfig ? 'Leave blank to keep existing' : 'Enter Client Secret'}
                                />
                                <span className="help-text">
                                    {existingConfig ? 'Only enter if you want to update' : 'Found in your app settings'}
                                </span>
                            </div>

                            {config.provider === 'okta' || config.provider === 'azure_ad' || config.provider === 'oidc' ? (
                                <div className="form-group full-width">
                                    <label>Issuer URL / Discovery URL</label>
                                    <input
                                        type="url"
                                        value={config.issuer_url}
                                        onChange={(e) => handleInputChange('issuer_url', e.target.value)}
                                        placeholder="https://your-domain.okta.com"
                                    />
                                    <span className="help-text">
                                        Your organization's base URL for {providers.find(p => p.id === config.provider)?.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="form-group full-width">
                                    <label>SSO Login URL</label>
                                    <input
                                        type="url"
                                        value={config.sso_url}
                                        onChange={(e) => handleInputChange('sso_url', e.target.value)}
                                        placeholder="https://your-idp.com/saml/login"
                                    />
                                </div>
                            )}

                            <div className="form-group full-width">
                                <label>Signing Certificate</label>
                                <textarea
                                    value={config.certificate}
                                    onChange={(e) => handleInputChange('certificate', e.target.value)}
                                    placeholder="-----BEGIN CERTIFICATE-----"
                                    rows={5}
                                />
                                <span className="help-text">
                                    PEM-encoded X.509 certificate for signature verification
                                </span>
                            </div>
                        </div>

                        <div className="sp-info">
                            <h4><Link /> Service Provider Information</h4>
                            <p>Use these values when configuring your identity provider:</p>
                            <div className="sp-details">
                                <div className="sp-item">
                                    <span className="sp-label">ACS URL</span>
                                    <div className="sp-value">
                                        <code>{generateACSUrl()}</code>
                                        <button onClick={() => handleCopyToClipboard(generateACSUrl())}>
                                            <Copy />
                                        </button>
                                    </div>
                                </div>
                                <div className="sp-item">
                                    <span className="sp-label">Entity ID</span>
                                    <div className="sp-value">
                                        <code>{generateSPMetadata().entityId}</code>
                                        <button onClick={() => handleCopyToClipboard(generateSPMetadata().entityId)}>
                                            <Copy />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h2>Configure SSO Settings</h2>
                        <p>Customize how SSO behaves for your organization.</p>
                        
                        <div className="settings-list">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Enforce SSO</h4>
                                    <p>Users must use SSO to log in. Password login will be disabled.</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={config.enforce_sso}
                                        onChange={() => handleInputChange('enforce_sso', !config.enforce_sso)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Auto-Provision Users</h4>
                                    <p>Automatically create user accounts when they first log in via SSO.</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={config.auto_provision}
                                        onChange={() => handleInputChange('auto_provision', !config.auto_provision)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="step-content">
                        <h2>Test Connection</h2>
                        <p>Verify your SSO configuration is working correctly.</p>
                        
                        <div className="test-section">
                            <button 
                                className="btn btn-test"
                                onClick={handleTest}
                                disabled={!config.client_id}
                            >
                                <Link /> Test SSO Connection
                            </button>

                            {testResult && (
                                <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                                    {testResult.success ? <Check /> : <X />}
                                    <span>{testResult.message}</span>
                                </div>
                            )}
                        </div>

                        <div className="test-info">
                            <h4>What to test:</h4>
                            <ul>
                                <li>Verify that the IdP can communicate with your SP</li>
                                <li>Check that user attributes are correctly mapped</li>
                                <li>Test login flow in an incognito window</li>
                            </ul>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="step-content">
                        <h2>Activate SSO</h2>
                        
                        <div className="activation-card">
                            <div className="activation-status">
                                <div className={`status-badge ${config.enabled ? 'active' : 'inactive'}`}>
                                    {config.enabled ? <Check /> : <X />}
                                    {config.enabled ? 'SSO Active' : 'SSO Not Active'}
                                </div>
                            </div>

                            {!config.enabled && (
                                <>
                                    <p>
                                        Once activated, users in your organization will be able to log in 
                                        using {providers.find(p => p.id === config.provider)?.name}.
                                    </p>

                                    {config.enforce_sso && (
                                        <div className="warning-box">
                                            <X />
                                            <div>
                                                <strong>Enforce SSO is enabled</strong>
                                                <p>Password login will be disabled. Make sure all users have SSO access before activating.</p>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-activate"
                                        onClick={handleEnableSSO}
                                        disabled={saving}
                                    >
                                        {saving ? 'Activating...' : 'Activate SSO'}
                                    </button>
                                </>
                            )}

                            {config.enabled && (
                                <div className="active-info">
                                    <h4>SSO is now configured!</h4>
                                    <p>Users can log in using the SSO button on the login page.</p>
                                    
                                    <div className="quick-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/admin/security')}
                                        >
                                            Go to Security Settings
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate('/admin/users')}
                                        >
                                            Manage Users
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="wizard-actions">
                {step > 1 && (
                    <button className="btn btn-secondary" onClick={handleBack}>
                        <ChevronLeft /> Back
                    </button>
                )}
                
                <div className="spacer"></div>
                
                {step < 4 && (
                    <button className="btn btn-primary" onClick={handleNext}>
                        Next <ChevronRight />
                    </button>
                )}
                
                {step === 4 && (
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save & Continue'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SSOConfiguration;
