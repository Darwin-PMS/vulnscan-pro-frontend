import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert, Crown } from 'lucide-react';

const SuperAdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    const isSuperAdmin = user?.role === 'super_admin' || localStorage.getItem('isSuperAdmin') === 'true';

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '16px',
                background: '#0f172a'
            }}>
                <Loader2 style={{ 
                    width: '48px', 
                    height: '48px', 
                    animation: 'spin 1s linear infinite',
                    color: '#6366f1'
                }} />
                <p style={{ color: '#94a3b8' }}>Verifying super admin access...</p>
            </div>
        );
    }

    if (!isAuthenticated && !localStorage.getItem('superAdminToken')) {
        return <Navigate to="/super-admin" state={{ from: location }} replace />;
    }

    if (!isSuperAdmin) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#0f172a',
                padding: '20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '450px',
                    padding: '40px',
                    background: 'rgba(30, 41, 59, 0.9)',
                    borderRadius: '16px',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.1)',
                        margin: '0 auto 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShieldAlert size={40} style={{ color: '#ef4444' }} />
                    </div>
                    <h2 style={{ 
                        color: '#f1f5f9', 
                        marginBottom: '12px',
                        fontSize: '24px',
                        fontWeight: '700'
                    }}>
                        Access Denied
                    </h2>
                    <p style={{ 
                        color: '#94a3b8', 
                        marginBottom: '24px',
                        fontSize: '14px',
                        lineHeight: '1.6'
                    }}>
                        Super Admin privileges are required to access this section. 
                        Please log in with a super admin account.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            style={{
                                padding: '12px 24px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: '#818cf8',
                                border: '1px solid rgba(99, 102, 241, 0.3)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            User Dashboard
                        </button>
                        <button
                            onClick={() => window.location.href = '/super-admin'}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            <Crown size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Super Admin Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default SuperAdminProtectedRoute;
