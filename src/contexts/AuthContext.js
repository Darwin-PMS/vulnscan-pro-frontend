import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

const TOKEN_EXPIRY_NORMAL = 4 * 60 * 60 * 1000; // 4 hours in ms
const TOKEN_EXPIRY_SCANNING = 24 * 60 * 60 * 1000; // 24 hours for scanning

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [terminalAttempts, setTerminalAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStartTime, setScanStartTime] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            const savedTokenExpiry = localStorage.getItem('tokenExpiry');
            const savedAttempts = localStorage.getItem('terminalAttempts');
            const savedScanStartTime = localStorage.getItem('scanStartTime');

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            if (savedAttempts) {
                setTerminalAttempts(parseInt(savedAttempts, 10));
            }
            if (savedToken) {
                // Check token expiry
                if (savedTokenExpiry) {
                    const expiry = parseInt(savedTokenExpiry, 10);
                    if (Date.now() > expiry) {
                        // Token expired
                        localStorage.removeItem('token');
                        localStorage.removeItem('tokenExpiry');
                        localStorage.removeItem('user');
                        setUser(null);
                        setIsLoading(false);
                        return;
                    }
                }

                try {
                    const response = await authApi.getCurrentUser();
                    if (response.data?.user) {
                        setUser(response.data.user);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiry');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            // Restore scanning state
            if (savedScanStartTime) {
                const startTime = parseInt(savedScanStartTime, 10);
                // Check if scan is still active (within 24 hours)
                if (Date.now() - startTime < TOKEN_EXPIRY_SCANNING) {
                    setIsScanning(true);
                    setScanStartTime(startTime);
                } else {
                    localStorage.removeItem('scanStartTime');
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const getTokenExpiry = useCallback(() => {
        return isScanning ? TOKEN_EXPIRY_SCANNING : TOKEN_EXPIRY_NORMAL;
    }, [isScanning]);

    const login = async (username, password) => {
        try {
            const response = await authApi.login({ username, password });
            const { token, user: userData } = response.data;
            
            const expiry = Date.now() + getTokenExpiry();
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiry', expiry.toString());
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authApi.register(userData);
            const { token, user: newUser } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Continue with local logout even if API call fails
        } finally {
            setUser(null);
            setTerminalAttempts(0);
            setIsScanning(false);
            setScanStartTime(null);
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            localStorage.removeItem('terminalAttempts');
            localStorage.removeItem('scanStartTime');
        }
    };

    const startScanMode = () => {
        const startTime = Date.now();
        setIsScanning(true);
        setScanStartTime(startTime);
        localStorage.setItem('scanStartTime', startTime.toString());
        
        // Extend token expiry
        const newExpiry = Date.now() + TOKEN_EXPIRY_SCANNING;
        localStorage.setItem('tokenExpiry', newExpiry.toString());
    };

    const stopScanMode = () => {
        setIsScanning(false);
        setScanStartTime(null);
        localStorage.removeItem('scanStartTime');
        
        // Reset token expiry to normal
        const newExpiry = Date.now() + TOKEN_EXPIRY_NORMAL;
        localStorage.setItem('tokenExpiry', newExpiry.toString());
    };

    const refreshTokenExpiry = () => {
        const newExpiry = Date.now() + (isScanning ? TOKEN_EXPIRY_SCANNING : TOKEN_EXPIRY_NORMAL);
        localStorage.setItem('tokenExpiry', newExpiry.toString());
    };

    const incrementTerminalAttempt = () => {
        const newAttempts = terminalAttempts + 1;
        setTerminalAttempts(newAttempts);
        localStorage.setItem('terminalAttempts', newAttempts.toString());
        return newAttempts;
    };

    const resetTerminalAttempts = () => {
        setTerminalAttempts(0);
        localStorage.removeItem('terminalAttempts');
    };

    const canUseTerminal = () => {
        if (user) return { allowed: true, attemptsLeft: Infinity };

        const attemptsLeft = Math.max(0, 2 - terminalAttempts);
        return {
            allowed: attemptsLeft > 0,
            attemptsLeft,
            totalAttempts: terminalAttempts
        };
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            isScanning,
            login,
            register,
            logout,
            terminalAttempts,
            incrementTerminalAttempt,
            resetTerminalAttempts,
            canUseTerminal,
            startScanMode,
            stopScanMode,
            refreshTokenExpiry
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
