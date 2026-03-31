import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, Terminal, Shield, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(username, password);

            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
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
                maxWidth: '440px',
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
                        <Shield size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px', color: theme.text }}>Welcome Back</h1>
                    <p style={{ color: theme.textSecondary }}>Sign in to access the terminal lab</p>
                </div>

                {/* Info Banner */}
                <div style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid #6366f1',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                }}>
                    <Terminal size={20} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '14px', color: theme.textSecondary }}>
                        <strong style={{ color: theme.text }}>Limited Access Mode</strong>
                        <p style={{ marginTop: '4px', marginBottom: 0 }}>
                            Without login, you can only try 2 commands in the terminal.
                            Sign in for unlimited access to all labs and exercises.
                        </p>
                    </div>
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
                    <div style={{ marginBottom: '20px' }}>
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    background: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                placeholder="Enter your username"
                                required
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 44px',
                                    background: theme.inputBg,
                                    border: `1px solid ${theme.border}`,
                                    borderRadius: '12px',
                                    color: theme.text,
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                placeholder="Enter your password"
                                required
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
                            gap: '8px',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: theme.textSecondary
                }}>
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#6366f1', fontWeight: 500, textDecoration: 'none' }}>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
