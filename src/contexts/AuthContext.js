import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [terminalAttempts, setTerminalAttempts] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('user');
        const savedAttempts = localStorage.getItem('terminalAttempts');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedAttempts) {
            setTerminalAttempts(parseInt(savedAttempts, 10));
        }
        setIsLoading(false);
    }, []);

    const login = (username, password) => {
        // Simple mock authentication
        // In production, this should validate against a backend
        if (username && password) {
            const userData = {
                username,
                id: Date.now().toString(),
                loginTime: new Date().toISOString()
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
    };

    const logout = () => {
        setUser(null);
        setTerminalAttempts(0);
        localStorage.removeItem('user');
        localStorage.removeItem('terminalAttempts');
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
        // If logged in, always allow
        if (user) return { allowed: true, attemptsLeft: Infinity };

        // If not logged in, allow only 2 attempts
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
