import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import { Button, Card, Input } from '../../components/ui';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="auth-page">
                <Card className="auth-card">
                    <div className="auth-header">
                        <div className="success-icon">
                            <CheckCircle size={48} />
                        </div>
                        <h1>Check Your Email</h1>
                        <p>
                            If an account exists with <strong>{email}</strong>, we've sent 
                            password reset instructions to that email address.
                        </p>
                        <p className="note">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                    </div>

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
                        <Mail size={32} />
                    </div>
                    <h1>Forgot Password?</h1>
                    <p>
                        No worries! Enter your email address and we'll send you 
                        instructions to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        type="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />

                    <Button 
                        type="submit" 
                        className="auth-submit" 
                        loading={loading}
                        disabled={!email}
                    >
                        Send Reset Link
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

export default ForgotPassword;
