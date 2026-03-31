import React, { createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = React.useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, warning, info, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    const getStyles = (type) => {
        const base = {
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
        };

        switch (type) {
            case 'success':
                return { ...base, background: '#10b981', color: 'white' };
            case 'error':
                return { ...base, background: '#ef4444', color: 'white' };
            case 'warning':
                return { ...base, background: '#f59e0b', color: 'white' };
            default:
                return { ...base, background: '#3b82f6', color: 'white' };
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return '✓';
            case 'error': return '✕';
            case 'warning': return '⚠';
            default: return 'ℹ';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    style={getStyles(toast.type)}
                    onClick={() => removeToast(toast.id)}
                    role="alert"
                    aria-live="polite"
                >
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{getIcon(toast.type)}</span>
                    <span style={{ flex: 1 }}>{toast.message}</span>
                </div>
            ))}
        </div>
    );
};

export default ToastProvider;
