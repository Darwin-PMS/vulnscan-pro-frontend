import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, Terminal, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Input } from '../components/ui';
import './Auth.css';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(username, password);

            if (result.success) {
                // Redirect based on user role
                const user = result.user;
                let redirectPath = from;
                
                if (user?.role === 'admin') {
                    redirectPath = '/admin';
                } else if (user?.role === 'enterprise') {
                    redirectPath = '/enterprise';
                } else {
                    redirectPath = '/dashboard';
                }
                
                navigate(redirectPath, { replace: true });
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
        <div className={`auth-page ${isDark ? 'auth-dark' : 'auth-light'}`}>
            <button
                className="auth-theme-toggle"
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Shield className="auth-logo-icon" />
                    </div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to access the security dashboard</p>
                </div>

                <div className="auth-info-banner">
                    <Terminal size={20} className="auth-info-icon" />
                    <div className="auth-info-text">
                        <strong>Limited Access Mode</strong>
                        <p>Without login, you can only try 2 commands in the terminal. Sign in for unlimited access to all labs and exercises.</p>
                    </div>
                </div>

                {error && (
                    <div className="auth-error" role="alert">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        leftIcon={<User size={18} />}
                        required
                        autoComplete="username"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        leftIcon={<Lock size={18} />}
                        required
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        size="lg"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>

            <div className="auth-decoration">
                <div className="auth-decoration-circle auth-decoration-circle-1"></div>
                <div className="auth-decoration-circle auth-decoration-circle-2"></div>
                <div className="auth-decoration-circle auth-decoration-circle-3"></div>
            </div>
        </div>
    );
};

export default Login;
