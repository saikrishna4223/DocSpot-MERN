// client/src/context/AuthContext.js
import React, { useState, createContext, useEffect } from 'react';

// Context for Authentication
export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role, isApproved, specialty, location }
  const [token, setToken] = useState(null);

  // Access initialAuthToken from the global window object (defined in index.js for local dev)
  const initialAuthToken = window.__initial_auth_token;

  // Simulate initial auth check (e.g., from local storage or __initial_auth_token)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        // --- FIX START ---
        // Ensure storedUser is a non-empty string before parsing
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // If storedUser is null/empty string, treat as logged out
          logout();
        }
        // --- FIX END ---
      } catch (e) {
        console.error("Failed to parse stored user or token:", e);
        logout(); // Logout if parsing fails to ensure clean state
      }
    } else if (initialAuthToken) {
      console.log("Using initial auth token:", initialAuthToken);
    }
  }, [initialAuthToken]); // Added initialAuthToken to dependency array to satisfy React Hook warning

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, isDoctor, isCustomer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};