import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, canUseTerminal } = useAuth();
    const location = useLocation();
    const terminalAccess = canUseTerminal();

    // If on terminal page and no attempts left, redirect to login
    if (location.pathname === '/terminal' && !terminalAccess.allowed && !isAuthenticated) {
        return (
            <div className="container" style={{ maxWidth: '600px', marginTop: '60px' }}>
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 24px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Lock size={40} style={{ color: 'var(--danger-color)' }} />
                    </div>

                    <h2 style={{ marginBottom: '16px' }}>Access Limit Reached</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        You have used all 2 free terminal attempts.
                        Sign in to get unlimited access to the terminal and all learning labs.
                    </p>

                    <Navigate
                        to="/login"
                        state={{ from: location }}
                        replace
                    />
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
