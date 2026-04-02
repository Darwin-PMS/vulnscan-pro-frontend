import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, AlertCircle, Shield, UserPlus, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const theme = isDark ? {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        bgCard: 'rgba(255,255,255,0.05)',
        border: 'rgba(255,255,255,0.1)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        inputBg: 'rgba(255,255,255,0.05)',
    } : {
        bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        bgCard: '#ffffff',
        border: 'rgba(0,0,0,0.08)',
        text: '#0f172a',
        textSecondary: '#475569',
        inputBg: '#f1f5f9',
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const result = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName || undefined
            });

            if (result.success) {
                // Redirect based on user role (new users default to user dashboard)
                navigate('/dashboard');
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: theme.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: '20px',
                padding: '40px'
            }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        display: 'flex'
                    }}
                >
                    {isDark ? <Sun size={20} style={{ color: '#fbbf24' }} /> : <Moon size={20} style={{ color: '#6366f1' }} />}
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 24px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)'
                    }}>
                        <UserPlus size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px', color: theme.text }}>Create Account</h1>
                    <p style={{ color: theme.textSecondary }}>Join VulnScan Pro to access all features</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#ef4444'
                    }}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: theme.text
                        }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: theme.textSecondary
                            }} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    background: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                                placeholder="Choose a username"
                                required
                                minLength={3}
                                maxLength={50}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: theme.text
                        }}>
                            Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: theme.textSecondary
                            }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    background: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: theme.text
                        }}>
                            Full Name (Optional)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: theme.textSecondary
                            }} />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    background: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: theme.text
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: theme.textSecondary
                            }} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    background: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                                placeholder="Create a password (min 6 characters)"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: theme.text
                        }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: theme.textSecondary
                            }} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    background: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                                placeholder="Confirm your password"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: theme.textSecondary
                }}>
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#6366f1', fontWeight: 500, textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
