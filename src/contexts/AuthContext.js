import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [terminalAttempts, setTerminalAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            const savedAttempts = localStorage.getItem('terminalAttempts');

            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            if (savedAttempts) {
                setTerminalAttempts(parseInt(savedAttempts, 10));
            }
            if (savedToken) {
                try {
                    const response = await authApi.getCurrentUser();
                    if (response.data?.user) {
                        setUser(response.data.user);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                    }
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authApi.login({ username, password });
            const { token, user: userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('terminalAttempts');
        }
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
            login,
            register,
            logout,
            terminalAttempts,
            incrementTerminalAttempt,
            resetTerminalAttempts,
            canUseTerminal
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
