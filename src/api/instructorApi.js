import axiosInstance from './axios';

export const instructorApi = {
    // Get instructor's courses
    getMyCourses: async (params = {}) => {
        const response = await axiosInstance.get('/instructor/courses/', { params });
        return response.data;
    },

    // Get single course
    getCourse: async (courseId) => {
        const response = await axiosInstance.get(`/instructor/courses/${courseId}/`);
        return response.data;
    },

    // Create new course
    createCourse: async (courseData) => {
        const response = await axiosInstance.post('/instructor/courses/', courseData);
        return response.data;
    },

    // Update course
    updateCourse: async (courseId, courseData) => {
        const response = await axiosInstance.patch(`/instructor/courses/${courseId}/`, courseData);
        return response.data;
    },

    // Delete course
    deleteCourse: async (courseId) => {
        const response = await axiosInstance.delete(`/instructor/courses/${courseId}/`);
        return response.data;
    },

    // Create lesson
    createLesson: async (lessonData) => {
        const response = await axiosInstance.post('/instructor/lessons/', lessonData);
        return response.data;
    },

    // Update lesson
    updateLesson: async (lessonId, lessonData) => {
        const response = await axiosInstance.patch(`/instructor/lessons/${lessonId}/`, lessonData);
        return response.data;
    },

    // Delete lesson
    deleteLesson: async (lessonId) => {
        const response = await axiosInstance.delete(`/instructor/lessons/${lessonId}/`);
        return response.data;
    },

    // Create quiz
    createQuiz: async (quizData) => {
        const response = await axiosInstance.post('/instructor/quizzes/', quizData);
        return response.data;
    },

    // Add quiz question
    addQuizQuestion: async (questionData) => {
        const response = await axiosInstance.post('/instructor/questions/', questionData);
        return response.data;
    },

    // Get quiz attempts (for instructor)
    getQuizAttempts: async (quizId, params = {}) => {
        const response = await axiosInstance.get(`/instructor/quizzes/${quizId}/attempts/`, { params });
        return response.data;
    },

    // Admin functions (for instructors with admin access)
    getUsers: async (params = {}) => {
        const response = await axiosInstance.get('/admin/users/', { params });
        return response.data;
    },

    getUserById: async (userId) => {
        const response = await axiosInstance.get(`/admin/users/${userId}/`);
        return response.data;
    },

    updateUser: async (userId, userData) => {
        const response = await axiosInstance.patch(`/admin/users/${userId}/`, userData);
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await axiosInstance.delete(`/admin/users/${userId}/`);
        return response.data;
    },

    toggleUserStatus: async (userId) => {
        const response = await axiosInstance.post(`/admin/users/${userId}/toggle-status/`);
        return response.data;
    },

    getCourses: async (params = {}) => {
        const response = await axiosInstance.get('/admin/courses/', { params });
        return response.data;
    },

    approveCourse: async (courseId) => {
        const response = await axiosInstance.post(`/admin/courses/${courseId}/approve/`);
        return response.data;
    },

    rejectCourse: async (courseId, reason) => {
        const response = await axiosInstance.post(`/admin/courses/${courseId}/reject/`, { reason });
        return response.data;
    },

    // Get course progress (student completion tracking)
    getCourseProgress: async (courseId) => {
        const response = await axiosInstance.get(`/instructor/courses/${courseId}/progress/`);
        return response.data;
    },
};

export const adminApi = {
    // Get all users
    getUsers: async (params = {}) => {
        const response = await axiosInstance.get('/admin/users/', { params });
        return response.data;
    },

    // Get user by ID
    getUserById: async (userId) => {
        const response = await axiosInstance.get(`/admin/users/${userId}/`);
        return response.data;
    },

    // Update user
    updateUser: async (userId, userData) => {
        const response = await axiosInstance.patch(`/admin/users/${userId}/`, userData);
        return response.data;
    },

    // Delete user
    deleteUser: async (userId) => {
        const response = await axiosInstance.delete(`/admin/users/${userId}/`);
        return response.data;
    },

    // Get all courses
    getCourses: async (params = {}) => {
        const response = await axiosInstance.get('/admin/courses/', { params });
        return response.data;
    },

    // Approve course
    approveCourse: async (courseId) => {
        const response = await axiosInstance.post(`/admin/courses/${courseId}/approve/`);
        return response.data;
    },

    // Reject course
    rejectCourse: async (courseId, reason) => {
        const response = await axiosInstance.post(`/admin/courses/${courseId}/reject/`, { reason });
        return response.data;
    },
};

export default instructorApi;
