import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize the state based on localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('adminToken') ? true : false;
    });

    const login = (username, password) => {
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminToken', 'admin-token-123');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);