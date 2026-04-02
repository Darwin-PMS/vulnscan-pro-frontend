import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authApi } from '../../services/api';
import { Button, Card, Input } from '../../components/ui';
import './ResetPassword.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState([]);

    useEffect(() => {
        if (token && userId) {
            verifyToken();
        } else {
            setVerifying(false);
            setError('Invalid reset link. Please request a new one.');
        }
    }, [token, userId]);

    const verifyToken = async () => {
        try {
            const response = await authApi.verifyResetToken(token, userId);
            setIsValid(response.data.valid);
            if (!response.data.valid) {
                setError('This password reset link has expired or is invalid. Please request a new one.');
            }
        } catch (err) {
            setIsValid(false);
            setError('This password reset link has expired or is invalid. Please request a new one.');
        } finally {
            setVerifying(false);
        }
    };

    const validatePassword = (pwd) => {
        const errors = [];
        if (pwd.length < 12) errors.push('at least 12 characters');
        if (!/[A-Z]/.test(pwd)) errors.push('one uppercase letter');
        if (!/[a-z]/.test(pwd)) errors.push('one lowercase letter');
        if (!/[0-9]/.test(pwd)) errors.push('one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('one special character');
        return errors;
    };

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);
        setPasswordErrors(validatePassword(pwd));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwordErrors.length > 0) {
            setError('Please meet all password requirements');
            return;
        }

        setLoading(true);

        try {
            await authApi.resetPassword(token, userId, password);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="auth-page">
                <Card className="auth-card">
                    <div className="auth-header">
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                        <p>Verifying your reset link...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="auth-page">
                <Card className="auth-card">
                    <div className="auth-header">
                        <div className="success-icon">
                            <CheckCircle size={48} />
                        </div>
                        <h1>Password Reset!</h1>
                        <p>
                            Your password has been successfully reset. 
                            You can now log in with your new password.
                        </p>
                    </div>

                    <Button 
                        className="auth-submit" 
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </Button>

                    <div className="auth-footer">
                        <Link to="/login" className="back-link">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    if (!isValid) {
        return (
            <div className="auth-page">
                <Card className="auth-card">
                    <div className="auth-header">
                        <div className="error-icon">
                            <AlertCircle size={48} />
                        </div>
                        <h1>Invalid Link</h1>
                        <p>{error}</p>
                    </div>

                    <Link to="/forgot-password" className="forgot-link">
                        Request New Reset Link
                    </Link>

                    <div className="auth-footer">
                        <Link to="/login" className="back-link">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <Card className="auth-card">
                <div className="auth-header">
                    <div className="icon-wrapper">
                        <Lock size={32} />
                    </div>
                    <h1>Set New Password</h1>
                    <p>
                        Create a strong password for your account.
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="password-input-wrapper">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={handlePasswordChange}
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

                    {password.length > 0 && (
                        <div className="password-requirements">
                            <p className="requirements-title">Password must contain:</p>
                            <ul>
                                <li className={password.length >= 12 ? 'valid' : ''}>
                                    At least 12 characters
                                </li>
                                <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                                    One uppercase letter
                                </li>
                                <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                                    One lowercase letter
                                </li>
                                <li className={/[0-9]/.test(password) ? 'valid' : ''}>
                                    One number
                                </li>
                                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : ''}>
                                    One special character
                                </li>
                            </ul>
                        </div>
                    )}

                    <Input
                        type={showPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button 
                        type="submit" 
                        className="auth-submit" 
                        loading={loading}
                        disabled={!password || !confirmPassword || passwordErrors.length > 0}
                    >
                        Reset Password
                    </Button>
                </form>

                <div className="auth-footer">
                    <Link to="/login" className="back-link">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default ResetPassword;
