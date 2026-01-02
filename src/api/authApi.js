
import axiosInstance from './axios';

export const authApi = {
    // Register new user
    register: async (userData) => {
        const response = await axiosInstance.post('/auth/register/', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login/', credentials);
        return response.data;
    },

    // Logout user
    logout: async (refreshToken) => {
        const response = await axiosInstance.post('/auth/logout/', {
            refresh_token: refreshToken,
        });
        return response.data;
    },

    // Get current user profile
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me/');
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await axiosInstance.patch('/auth/profile/', profileData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await axiosInstance.post('/auth/change-password/', passwordData);
        return response.data;
    },

    // Refresh token
    refreshToken: async (refreshToken) => {
        const response = await axiosInstance.post('/auth/token/refresh/', {
            refresh: refreshToken,
        });
        return response.data;
    },
};
export default authApi;
