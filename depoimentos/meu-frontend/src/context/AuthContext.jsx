import React, { createContext, useState, useContext } from 'react';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    const login = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
    };

    
    const isLoggedIn = !!token; 

    const value = {
        isLoggedIn,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
    return useContext(AuthContext);
}