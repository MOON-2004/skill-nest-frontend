import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const storedUser = localStorage.getItem('user');
            const storedAccessToken = localStorage.getItem('accessToken');
            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (storedAccessToken) {
                try {
                    const decoded = jwtDecode(storedAccessToken);
                    setUser({ ...decoded, ...JSON.parse(storedUser || '{}') });
                } catch {
                    setUser(storedUser ? JSON.parse(storedUser) : null);
                }
                setAccessToken(storedAccessToken);
                setRefreshToken(storedRefreshToken);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setAccessToken(null);
                setRefreshToken(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const data = await authApi.login(credentials);

            const { user: userData, tokens } = data;

            // Store in state
            setUser(userData);
            setAccessToken(tokens.access);
            setRefreshToken(tokens.refresh);
            setIsAuthenticated(true);

            // Persist to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('accessToken', tokens.access);
            localStorage.setItem('refreshToken', tokens.refresh);

            return { success: true, data };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data || { message: 'Login failed' },
            };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const data = await authApi.register(userData);

            const { user: newUser, tokens } = data;

            // Store in state
            setUser(newUser);
            setAccessToken(tokens.access);
            setRefreshToken(tokens.refresh);
            setIsAuthenticated(true);

            // Persist to localStorage
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('accessToken', tokens.access);
            localStorage.setItem('refreshToken', tokens.refresh);

            return { success: true, data };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.response?.data || { message: 'Registration failed' },
            };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            if (refreshToken) {
                await authApi.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setIsAuthenticated(false);

            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    // Update user profile
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    // RBAC utility
    const hasRole = (roles) => {
        if (!user || !user.role) return false;
        return roles.includes(user.role);
    };

    const value = {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        loading,
        role: user?.role || null,
        login,
        register,
        logout,
        updateUser,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Legacy export for compatibility
export const AuthProvider = AuthContextProvider;

export default AuthContextProvider;

