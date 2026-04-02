import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Mail, Key, CheckCircle, XCircle, Copy, ChevronLeft } from 'lucide-react';
import { authApi } from '../../services/api';
import { Button, Card, Input } from '../../components/ui';
import { PageContainer } from '../../components/layout';
import './MFASetup.css';

const MFASetup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('select'); // select | setup-totp | verify | email-otp | backup | success
    const [method, setMethod] = useState('totp');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [mfaStatus, setMfaStatus] = useState(null);

    useEffect(() => {
        checkMFAStatus();
    }, []);

    const checkMFAStatus = async () => {
        try {
            const response = await authApi.getMFAStatus();
            setMfaStatus(response.data);
            if (response.data?.enabled) {
                setStep('success');
            }
        } catch (err) {
            console.error('Failed to check MFA status:', err);
        }
    };

    const handleMethodSelect = async (selectedMethod) => {
        setMethod(selectedMethod);
        setError('');
        setLoading(true);

        try {
            if (selectedMethod === 'totp') {
                const response = await authApi.setupMFA('totp');
                setQrCode(response.data.qrCode);
                setSecret(response.data.manualEntryKey);
                setStep('setup-totp');
            } else {
                const response = await authApi.setupMFA('email');
                setStep('email-otp');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to setup MFA');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyTotp = async () => {
        if (code.length !== 6) {
            setError('Please enter a 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authApi.verifyMFA(code);
            if (response.data.backupCodes) {
                setBackupCodes(response.data.backupCodes);
                setStep('backup');
            } else {
                setStep('success');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmailOtp = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authApi.setupMFA('email', { email });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP');
            setLoading(false);
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (code.length !== 6) {
            setError('Please enter the 6-digit code from your email');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authApi.verifyEmailOTP(code);
            if (response.data.backupCodes) {
                setBackupCodes(response.data.backupCodes);
                setStep('backup');
            } else {
                setStep('success');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handleDone = () => {
        navigate('/dashboard');
    };

    const renderSelectMethod = () => (
        <div className="mfa-methods">
            <h2>Choose Your Verification Method</h2>
            <p className="mfa-description">
                Add an extra layer of security to your account by requiring a verification code in addition to your password.
            </p>

            {error && (
                <div className="mfa-error">
                    <XCircle size={16} />
                    {error}
                </div>
            )}

            <div className="method-cards">
                <Card 
                    className={`method-card ${method === 'totp' ? 'selected' : ''}`}
                    hoverable
                    onClick={() => !loading && handleMethodSelect('totp')}
                >
                    <div className="method-icon">
                        <Smartphone size={32} />
                    </div>
                    <h3>Authenticator App</h3>
                    <p>Use an app like Google Authenticator or Authy to generate verification codes.</p>
                    <ul className="method-features">
                        <li><CheckCircle size={14} /> Most secure option</li>
                        <li><CheckCircle size={14} /> Works offline</li>
                        <li><CheckCircle size={14} /> No phone service needed</li>
                    </ul>
                    {loading && method === 'totp' && <div className="loading-spinner">Setting up...</div>}
                </Card>

                <Card 
                    className={`method-card ${method === 'email' ? 'selected' : ''}`}
                    hoverable
                    onClick={() => !loading && handleMethodSelect('email')}
                >
                    <div className="method-icon">
                        <Mail size={32} />
                    </div>
                    <h3>Email Verification</h3>
                    <p>Receive a verification code via email each time you sign in.</p>
                    <ul className="method-features">
                        <li><CheckCircle size={14} /> Easy to setup</li>
                        <li><CheckCircle size={14} /> No additional apps</li>
                        <li><XCircle size={14} /> Requires email access</li>
                    </ul>
                    {loading && method === 'email' && <div className="loading-spinner">Sending...</div>}
                </Card>
            </div>
        </div>
    );

    const renderSetupTotp = () => (
        <div className="mfa-setup-totp">
            <button className="back-button" onClick={() => setStep('select')}>
                <ChevronLeft size={20} /> Back
            </button>

            <div className="qr-section">
                <h2>Scan QR Code</h2>
                <p>Open your authenticator app and scan this QR code:</p>

                {qrCode && (
                    <div className="qr-code">
                        <img src={qrCode} alt="QR Code" />
                    </div>
                )}

                <div className="manual-entry">
                    <p>Or enter this code manually:</p>
                    <div className="secret-display">
                        <code>{secret}</code>
                        <button onClick={() => copyToClipboard(secret)} className="copy-btn">
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="verify-section">
                <h3>Enter Verification Code</h3>
                <p>Enter the 6-digit code from your authenticator app:</p>

                <Input
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="code-input"
                    autoFocus
                />

                {error && (
                    <div className="mfa-error">
                        <XCircle size={16} />
                        {error}
                    </div>
                )}

                <Button 
                    onClick={handleVerifyTotp} 
                    loading={loading}
                    disabled={code.length !== 6}
                    className="verify-btn"
                >
                    Verify & Enable
                </Button>
            </div>
        </div>
    );

    const renderEmailOtp = () => (
        <div className="mfa-setup-email">
            <button className="back-button" onClick={() => setStep('select')}>
                <ChevronLeft size={20} /> Back
            </button>

            <div className="email-section">
                <Mail size={48} className="email-icon" />
                <h2>Check Your Email</h2>
                <p>We've sent a verification code to your registered email address.</p>

                <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="code-input"
                    autoFocus
                />

                {error && (
                    <div className="mfa-error">
                        <XCircle size={16} />
                        {error}
                    </div>
                )}

                <Button 
                    onClick={handleVerifyEmailOtp} 
                    loading={loading}
                    disabled={code.length !== 6}
                    className="verify-btn"
                >
                    Verify Code
                </Button>
            </div>
        </div>
    );

    const renderBackupCodes = () => (
        <div className="mfa-backup-codes">
            <div className="success-icon">
                <CheckCircle size={64} />
            </div>

            <h2>Save Your Backup Codes</h2>
            <p className="warning-text">
                Store these codes securely. You can use any of them to sign in if you lose access to your authenticator app.
            </p>

            <div className="backup-codes-grid">
                {backupCodes.map((code, index) => (
                    <div key={index} className="backup-code">
                        <span className="code-number">{index + 1}.</span>
                        <code>{code}</code>
                        <button onClick={() => copyToClipboard(code)} className="copy-btn">
                            <Copy size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <Button onClick={handleDone} className="done-btn">
                I've Saved My Codes - Done
            </Button>
        </div>
    );

    const renderSuccess = () => (
        <div className="mfa-success">
            <div className="success-icon">
                <Shield size={64} />
            </div>

            <h2>Two-Factor Authentication Enabled</h2>
            <p>Your account is now more secure. You'll need to enter a verification code each time you sign in.</p>

            <div className="mfa-status-info">
                <div className="status-item">
                    <CheckCircle size={20} className="status-icon" />
                    <span>Method: {mfaStatus?.type === 'totp' ? 'Authenticator App' : 'Email'}</span>
                </div>
                <div className="status-item">
                    <CheckCircle size={20} className="status-icon" />
                    <span>Status: Active</span>
                </div>
            </div>

            <div className="success-actions">
                <Button onClick={handleDone}>
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );

    return (
        <PageContainer showNavbar={false}>
            <div className="mfa-setup-page">
                <Card className="mfa-card">
                    <div className="mfa-header">
                        <Shield size={32} />
                        <h1>Two-Factor Authentication</h1>
                    </div>

                    {step === 'select' && renderSelectMethod()}
                    {step === 'setup-totp' && renderSetupTotp()}
                    {step === 'email-otp' && renderEmailOtp()}
                    {step === 'backup' && renderBackupCodes()}
                    {step === 'success' && renderSuccess()}
                </Card>
            </div>
        </PageContainer>
    );
};

export default MFASetup;
