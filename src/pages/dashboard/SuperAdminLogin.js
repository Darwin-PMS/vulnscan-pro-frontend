import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, AlertCircle, Crown } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useToast } from '../../contexts/ToastContext';
import './SuperAdminLogin.css';

const DEMO_CREDENTIALS = {
    email: 'superadmin@vulnscan.pro',
    password: 'superadmin123'
};

const SuperAdminLogin = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (credentials.email === DEMO_CREDENTIALS.email && credentials.password === DEMO_CREDENTIALS.password) {
            localStorage.setItem('superAdminToken', 'demo-super-admin-token-' + Date.now());
            localStorage.setItem('isSuperAdmin', 'true');
            localStorage.setItem('superAdminEmail', credentials.email);
            toast.success('Super Admin access granted');
            navigate('/super-admin/dashboard');
        } else {
            setError('Invalid credentials. Use demo credentials below.');
        }
        setLoading(false);
    };

    const fillDemoCredentials = () => {
        setCredentials({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
    };

    return (
        <div className="super-admin-login">
            <div className="super-admin-login-container">
                <Card className="super-admin-login-card">
                    <div className="super-admin-badge">
                        <Crown size={20} />
                        <span>Super Admin Access</span>
                    </div>

                    <div className="super-admin-header">
                        <div className="super-admin-icon">
                            <Shield size={48} />
                        </div>
                        <h1>Super Admin Portal</h1>
                        <p>Access restricted to authorized personnel only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="super-admin-form">
                        {error && (
                            <div className="super-admin-error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Admin Email</label>
                            <Input
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                placeholder="admin@vulnscan.pro"
                                icon={<Lock size={18} />}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-input-wrapper">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    placeholder="Enter admin password"
                                    icon={<Lock size={18} />}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="super-admin-submit"
                            loading={loading}
                        >
                            Access Admin Portal
                        </Button>
                        
                        <button
                            type="button"
                            className="demo-login-btn"
                            onClick={fillDemoCredentials}
                        >
                            <Crown size={14} />
                            Use Demo Credentials
                        </button>
                    </form>

                    <div className="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Email: superadmin@vulnscan.pro</p>
                        <p>Password: superadmin123</p>
                    </div>

                    <div className="super-admin-footer">
                        <p>This portal is for system administrators only.</p>
                        <a href="/login">Return to regular login</a>
                    </div>

                    <div className="super-admin-warning">
                        <AlertCircle size={16} />
                        <span>All actions are logged and audited</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SuperAdminLogin;
