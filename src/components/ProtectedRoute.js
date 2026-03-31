import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Lock } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, canUseTerminal } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <Loader2 style={{ 
                    width: '48px', 
                    height: '48px', 
                    animation: 'spin 1s linear infinite',
                    color: 'var(--primary-color)'
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
