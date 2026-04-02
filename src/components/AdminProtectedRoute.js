import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    const isEnterprise = user?.role === 'enterprise';

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '16px',
                background: 'var(--dark-bg)'
            }}>
                <Loader2 style={{ 
                    width: '48px', 
                    height: '48px', 
                    animation: 'spin 1s linear infinite',
                    color: 'var(--primary-color)'
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>Verifying admin access...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin && !isEnterprise) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'var(--dark-bg)',
                padding: '20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '450px',
                    padding: '40px',
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)'
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
                        color: 'var(--text-primary)', 
                        marginBottom: '12px',
                        fontSize: '24px',
                        fontWeight: '700'
                    }}>
                        Access Denied
                    </h2>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        marginBottom: '24px',
                        fontSize: '14px',
                        lineHeight: '1.6'
                    }}>
                        Admin or Enterprise privileges are required to access this section.
                    </p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        style={{
                            padding: '12px 24px',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminProtectedRoute;
