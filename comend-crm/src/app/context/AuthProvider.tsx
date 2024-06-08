// context/AuthContext.js
"use client";
import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext({
    user: null,
    login: () => { },
    logout: () => { }
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData: React.SetStateAction<null>) => {
        setUser(userData);
        // Cookies.set('user', JSON.stringify(userData), { expires: 1 }); // 1 day expiration
    };

    const logout = () => {
        setUser(null);
        // Cookies.remove('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
