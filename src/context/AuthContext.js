import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../services/storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        try {
            const storedUser = await storage.getUser();
            const token = await storage.getToken();

            if (storedUser && token) {
                setUser(storedUser);
                // Optional: Verify token with backend /auth/me
                try {
                    const response = await api.get('/auth/me');
                    if (response.data.success) {
                        setUser(response.data.data);
                        await storage.setUser(response.data.data);
                    }
                } catch (error) {
                    console.log('Token verification failed, logging out');
                    await logout();
                }
            }
        } catch (error) {
            console.error('Failed to load auth data', error);
        } finally {
            setLoading(false);
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                const { token, user } = response.data.data;
                await storage.setToken(token);
                await storage.setUser(user);
                setUser(user);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const register = async (name, username, email, password) => {
        try {
            const response = await api.post('/auth/register', { full_name: name, username, email, password });
            if (response.data.success) {
                const { token, user } = response.data.data;
                await storage.setToken(token);
                await storage.setUser(user);
                setUser(user);
                return { success: true };
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        await storage.clearAuth();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
