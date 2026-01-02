import axiosInstance from './axios';

export const lessonApi = {
    // Get lessons for a course (student view)
    getCourseLessons: async (courseId) => {
        const response = await axiosInstance.get(`/lessons/`, {
            params: { course: courseId }
        });
        return response.data;
    },

    // Get lesson details
    getLessonById: async (lessonId) => {
        const response = await axiosInstance.get(`/lessons/${lessonId}/`);
        return response.data;
    },

    // Mark lesson as completed
    markLessonComplete: async (lessonId, data) => {
        const response = await axiosInstance.post(`/lessons/${lessonId}/complete/`, data);
        return response.data;
    },
};

export const quizApi = {
    // Get quiz details
    getQuizById: async (quizId) => {
        const response = await axiosInstance.get(`/quizzes/${quizId}/`);
        return response.data;
    },

    // Start quiz attempt
    startQuizAttempt: async (quizId) => {
        const response = await axiosInstance.post(`/quizzes/${quizId}/start/`);
        return response.data;
    },

    // Submit quiz
    submitQuiz: async (attemptId, answers) => {
        const response = await axiosInstance.post(`/attempts/${attemptId}/submit/`, { answers });
        return response.data;
    },

    // Get my quiz attempts
    getMyQuizAttempts: async (params = {}) => {
        const response = await axiosInstance.get('/my-quiz-attempts/', { params });
        return response.data;
    },
};

export default { lessonApi, quizApi };
