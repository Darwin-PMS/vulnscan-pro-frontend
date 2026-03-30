import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scan, AlertCircle, Globe, Shield, Lock, Zap, Crown } from 'lucide-react';
import { scanApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const NewScan = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [usage, setUsage] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsage();
        }
    }, [isAuthenticated]);

    const fetchUsage = async () => {
        try {
            const res = await api.get('/subscriptions/usage');
            setUsage(res.data);
        } catch (err) {
            console.error('Error fetching usage:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setError('Please login first to start a scan');
            return;
        }

        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        let targetUrl = url.trim();
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await scanApi.startScan(targetUrl);

            if (response.data.success) {
                navigate(`/scan/${response.data.scanId}`);
            }
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.error?.includes('limit')) {
                setError('You\'ve reached your monthly scan limit. Upgrade for more scans.');
            } else {
                setError(err.response?.data?.error || 'Failed to start scan');
            }
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="container page-header">
                <h1>New Vulnerability Scan</h1>
                <p>Enter a URL to scan for security vulnerabilities and loopholes</p>
            </div>

            <div className="container">
                {/* Info Cards */}
                <div className="grid grid-3" style={{ marginBottom: '40px' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Globe size={40} style={{ margin: '0 auto 16px', color: 'var(--primary-color)' }} />
                        <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>URL Analysis</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Scans the target URL for exposed endpoints and sensitive files
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <AlertCircle size={40} style={{ margin: '0 auto 16px', color: 'var(--warning-color)' }} />
                        <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>GHDB Patterns</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Uses Google Hacking Database patterns to find vulnerabilities
                        </p>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <Shield size={40} style={{ margin: '0 auto 16px', color: 'var(--secondary-color)' }} />
                        <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Security Headers</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            Checks for missing security headers and SSL/TLS issues
                        </p>
                    </div>
                </div>

                {/* Scan Form */}
                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label
                                htmlFor="url"
                                style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: '500',
                                    fontSize: '14px'
                                }}
                            >
                                Target URL
                            </label>
                            <div className="input-group" style={{ marginBottom: '0' }}>
                                <input
                                    id="url"
                                    type="text"
                                    className="input"
                                    placeholder="https://example.com or example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <p style={{
                                marginTop: '8px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)'
                            }}>
                                Enter the full URL or just the domain name. We'll automatically detect the protocol.
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px 16px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                color: '#fca5a5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {/* Login Required Banner */}
                        {!isAuthenticated && (
                            <div style={{
                                padding: '16px',
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid var(--warning-color)',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <Lock size={24} style={{ color: 'var(--warning-color)', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: 500 }}>
                                        Login Required
                                    </p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        Please login first to access the vulnerability scanner and start scans.
                                    </p>
                                </div>
                                <Link to="/login" className="btn btn-primary" style={{ flexShrink: 0 }}>
                                    Sign In
                                </Link>
                            </div>
                        )}

                        {/* Usage Info */}
                        {isAuthenticated && usage && (
                            <div style={{
                                padding: '16px',
                                background: usage.percentageUsed > 80 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                border: `1px solid ${usage.percentageUsed > 80 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                                borderRadius: '8px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {usage.tier === 'Free' ? <Zap size={24} style={{ color: usage.percentageUsed > 80 ? '#fca5a5' : '#93c5fd' }} /> : <Crown size={24} style={{ color: '#fbbf24' }} />}
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 500 }}>
                                            {usage.tier} Plan - {usage.isUnlimited ? 'Unlimited scans' : `${usage.scansUsed} of ${usage.scanLimit} scans used`}
                                        </p>
                                        {!usage.isUnlimited && (
                                            <div style={{ marginTop: '8px', width: '200px' }}>
                                                <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
                                                    <div style={{
                                                        width: `${usage.percentageUsed}%`,
                                                        background: usage.percentageUsed > 80 ? '#ef4444' : '#3b82f6',
                                                        height: '100%',
                                                        borderRadius: '4px'
                                                    }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Link
                                    to="/pricing"
                                    className="btn btn-primary"
                                    style={{ flexShrink: 0, background: usage.percentageUsed > 80 ? '#ef4444' : 'var(--primary-color)' }}
                                >
                                    {usage.tier === 'Free' ? 'Upgrade Now' : 'Manage Plan'}
                                </Link>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || !isAuthenticated}
                                style={{
                                    minWidth: '180px',
                                    opacity: !isAuthenticated ? 0.5 : 1,
                                    cursor: !isAuthenticated ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
                                        Starting Scan...
                                    </>
                                ) : !isAuthenticated ? (
                                    <>
                                        <Lock size={18} />
                                        Login Required
                                    </>
                                ) : (
                                    <>
                                        <Scan size={18} />
                                        Start Scan
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Disclaimer */}
                <div style={{
                    maxWidth: '800px',
                    margin: '32px auto 0',
                    padding: '16px 20px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '13px', color: '#fcd34d' }}>
                        <strong>Disclaimer:</strong> Only scan websites you own or have explicit permission to test.
                        Unauthorized scanning of websites is illegal and unethical.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NewScan;