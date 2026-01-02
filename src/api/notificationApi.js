import axiosInstance from './axios';

export const notificationApi = {
    // Get all notifications
    getNotifications: async (params = {}) => {
        const response = await axiosInstance.get('/notifications/', { params });
        return response.data;
    },

    // Get unread notifications
    getUnreadNotifications: async () => {
        const response = await axiosInstance.get('/notifications/unread/');
        return response.data;
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        const response = await axiosInstance.post(`/notifications/${notificationId}/mark-read/`);
        return response.data;
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await axiosInstance.post('/notifications/mark-all-read/');
        return response.data;
    },
};

export default notificationApi;
