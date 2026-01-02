import { useState, useEffect } from 'react';

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = (apiFunc, immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    const execute = async (...params) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunc(...params);
            setData(result);
            return { success: true, data: result };
        } catch (err) {
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, []);

    return { data, loading, error, execute, setData };
};

/**
 * Custom hook for pagination
 */
export const usePagination = (initialPage = 1, initialPageSize = 20) => {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    const totalPages = Math.ceil(totalCount / pageSize);

    const goToPage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const nextPage = () => {
        if (hasNext) {
            setPage((prev) => prev + 1);
        }
    };

    const previousPage = () => {
        if (hasPrevious) {
            setPage((prev) => prev - 1);
        }
    };

    const updatePaginationData = (paginationResponse) => {
        setTotalCount(paginationResponse.count || 0);
        setHasNext(!!paginationResponse.next);
        setHasPrevious(!!paginationResponse.previous);
    };

    return {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNext,
        hasPrevious,
        setPage,
        setPageSize,
        goToPage,
        nextPage,
        previousPage,
        updatePaginationData,
    };
};

/**
 * Custom hook for form handling
 */
export const useForm = (initialValues, onSubmit, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues({
            ...values,
            [name]: type === 'checkbox' ? checked : value,
        });

        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if validation function provided
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setValues,
        setErrors,
        resetForm,
    };
};

/**
 * Custom hook for debounced value
 */
export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};
