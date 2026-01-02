import axiosInstance from './axios';

export const courseApi = {
    // Get all courses with filters and pagination
    getCourses: async (params = {}) => {
        const response = await axiosInstance.get('/courses/', { params });
        return response.data;
    },

    // Get course details by slug
    getCourseBySlug: async (slug) => {
        const response = await axiosInstance.get(`/courses/${slug}/`);
        return response.data;
    },

    // Get featured courses
    getFeaturedCourses: async () => {
        const response = await axiosInstance.get('/courses/featured/');
        return response.data;
    },

    // Enroll in course
    enrollInCourse: async (courseId) => {
        const response = await axiosInstance.post(`/courses/${courseId}/enroll/`);
        return response.data;
    },

    // Unenroll from course
    unenrollFromCourse: async (courseId) => {
        const response = await axiosInstance.post(`/courses/${courseId}/unenroll/`);
        return response.data;
    },

    // Get my enrollments
    getMyEnrollments: async (params = {}) => {
        const response = await axiosInstance.get('/my-enrollments/', { params });
        return response.data;
    },

    // Get course progress
    getCourseProgress: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}/progress/`);
        return response.data;
    },

    // Get course lessons
    getCourseLessons: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}/lessons/`);
        return response.data;
    },

    // Get course quizzes
    getCourseQuizzes: async (courseId) => {
        const response = await axiosInstance.get(`/courses/${courseId}/quizzes/`);
        return response.data;
    },

    // Get course reviews
    getCourseReviews: async (courseId, params = {}) => {
        const response = await axiosInstance.get(`/courses/${courseId}/reviews/`, { params });
        return response.data;
    },

    // Create course review
    createReview: async (courseId, reviewData) => {
        const response = await axiosInstance.post(`/courses/${courseId}/reviews/create/`, reviewData);
        return response.data;
    },

    // Get course discussions
    getCourseDiscussions: async (courseId, params = {}) => {
        const response = await axiosInstance.get(`/courses/${courseId}/discussions/`, { params });
        return response.data;
    },

    // Create discussion thread
    createDiscussion: async (courseId, discussionData) => {
        const response = await axiosInstance.post(`/courses/${courseId}/discussions/create/`, discussionData);
        return response.data;
    },
};

export default courseApi;
