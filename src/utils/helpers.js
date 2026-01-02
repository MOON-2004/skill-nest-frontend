// ...existing code...
/**
 * Paginate an array
 */
export function paginate(array, page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    return array.slice(start, start + pageSize);
}
// ...existing code...
/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format duration in minutes to hours and minutes
 */
export const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
};

/**
 * Format price
 */
export const formatPrice = (price) => {
    if (!price || price === '0.00') return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
};

/**
 * Get difficulty badge color
 */
export const getDifficultyColor = (difficulty) => {
    const colors = {
        BEGINNER: 'green',
        INTERMEDIATE: 'orange',
        ADVANCED: 'red',
    };
    return colors[difficulty] || 'gray';
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (completed, total) => {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Handle API errors
 */
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        const { data, status } = error.response;

        if (status === 400) {
            // Validation errors
            return {
                message: 'Validation error',
                errors: data,
            };
        } else if (status === 401) {
            return {
                message: 'Unauthorized. Please login again.',
            };
        } else if (status === 403) {
            return {
                message: 'You do not have permission to perform this action.',
            };
        } else if (status === 404) {
            return {
                message: 'Resource not found.',
            };
        } else if (status === 429) {
            return {
                message: 'Too many requests. Please try again later.',
            };
        } else if (status >= 500) {
            return {
                message: 'Server error. Please try again later.',
            };
        }

        return {
            message: data.detail || data.message || 'An error occurred',
            errors: data,
        };
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'Network error. Please check your connection.',
        };
    } else {
        // Something else happened
        return {
            message: error.message || 'An unexpected error occurred',
        };
    }
};
