import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instructorApi } from '../../api/instructorApi';
import './CourseForm.css';

const CourseForm = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEditMode = !!courseId;

    const initialValues = {
        title: '',
        slug: '',
        description: '',
        short_description: '',
        difficulty: 'BEGINNER',
        price: '0.00',
        is_free: true,
        duration_hours: 1,
        language: 'English',
        requirements: '',
        what_you_will_learn: '',
        target_audience: ''
    };

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            fetchCourseData();
        }
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const course = await instructorApi.getCourse(courseId);
            setValues({
                title: course.title || '',
                slug: course.slug || '',
                description: course.description || '',
                short_description: course.short_description || '',
                difficulty: course.difficulty || 'BEGINNER',
                price: course.price || '0.00',
                is_free: course.is_free || false,
                duration_hours: course.duration_hours || 1,
                language: course.language || 'English',
                requirements: course.requirements || '',
                what_you_will_learn: course.what_you_will_learn || '',
                target_audience: course.target_audience || ''
            });
        } catch (err) {
            setError('Failed to load course data');
            console.error(err);
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setValues(prev => {
            const updated = { ...prev, [name]: newValue };

            // Auto-generate slug from title
            if (name === 'title' && !isEditMode) {
                updated.slug = generateSlug(value);
            }

            // Auto-set is_free based on price
            if (name === 'price') {
                updated.is_free = parseFloat(value) === 0;
            }

            return updated;
        });

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!values.title || values.title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
        }

        if (!values.slug || values.slug.trim().length < 3) {
            newErrors.slug = 'Slug must be at least 3 characters';
        }

        if (!values.description || values.description.trim().length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
        }

        if (!values.short_description || values.short_description.trim().length < 10) {
            newErrors.short_description = 'Short description must be at least 10 characters';
        }

        if (parseFloat(values.price) < 0) {
            newErrors.price = 'Price cannot be negative';
        }

        if (values.duration_hours < 1) {
            newErrors.duration_hours = 'Duration must be at least 1 hour';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Prepare data for API
            const courseData = {
                title: values.title.trim(),
                slug: values.slug.trim(),
                description: values.description.trim(),
                short_description: values.short_description.trim(),
                difficulty: values.difficulty,
                price: parseFloat(values.price).toFixed(2),
                is_free: values.is_free,
                duration_hours: parseInt(values.duration_hours),
                language: values.language.trim(),
                requirements: values.requirements.trim(),
                what_you_will_learn: values.what_you_will_learn.trim(),
                target_audience: values.target_audience.trim()
            };

            if (isEditMode) {
                await instructorApi.updateCourse(courseId, courseData);
                alert('Course updated successfully!');
            } else {
                await instructorApi.createCourse(courseData);
                alert('Course created successfully!');
            }

            navigate('/instructor/dashboard');
        } catch (err) {
            console.error('Failed to save course:', err);
            setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to save course. Please check all fields.');

            // Show field-specific errors if available
            if (err.response?.data) {
                const apiErrors = {};
                Object.keys(err.response.data).forEach(key => {
                    if (Array.isArray(err.response.data[key])) {
                        apiErrors[key] = err.response.data[key][0];
                    } else {
                        apiErrors[key] = err.response.data[key];
                    }
                });
                setErrors(apiErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="course-form-container">
            <div className="form-header">
                <h1>{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
                <button onClick={() => navigate('/instructor/dashboard')} className="btn btn-outline">
                    Cancel
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="course-form">
                <div className="form-group">
                    <label htmlFor="title">Course Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        placeholder="e.g., Complete Python Programming"
                        className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="slug">URL Slug *</label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={values.slug}
                        onChange={handleChange}
                        placeholder="e.g., complete-python-programming"
                        className={errors.slug ? 'error' : ''}
                    />
                    {errors.slug && <span className="error-message">{errors.slug}</span>}
                    <small>Auto-generated from title, but you can customize it</small>
                </div>

                <div className="form-group">
                    <label htmlFor="short_description">Short Description *</label>
                    <textarea
                        id="short_description"
                        name="short_description"
                        value={values.short_description}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Brief one-line description..."
                        className={errors.short_description ? 'error' : ''}
                    />
                    {errors.short_description && <span className="error-message">{errors.short_description}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Full Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Detailed course description..."
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="difficulty">Difficulty Level *</label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={values.difficulty}
                            onChange={handleChange}
                        >
                            <option value="BEGINNER">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="ADVANCED">Advanced</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration_hours">Duration (hours) *</label>
                        <input
                            type="number"
                            id="duration_hours"
                            name="duration_hours"
                            value={values.duration_hours}
                            onChange={handleChange}
                            min="1"
                            className={errors.duration_hours ? 'error' : ''}
                        />
                        {errors.duration_hours && <span className="error-message">{errors.duration_hours}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">Price ($) *</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={values.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className={errors.price ? 'error' : ''}
                        />
                        {errors.price && <span className="error-message">{errors.price}</span>}
                        <small>Set to 0 for free courses</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="language">Language *</label>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            value={values.language}
                            onChange={handleChange}
                            placeholder="English"
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="is_free"
                                checked={values.is_free}
                                onChange={handleChange}
                            />
                            <span>Free Course</span>
                        </label>
                        <small>Auto-checked when price is 0</small>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="requirements">Requirements (Optional)</label>
                    <textarea
                        id="requirements"
                        name="requirements"
                        value={values.requirements}
                        onChange={handleChange}
                        rows="3"
                        placeholder="What students need to know before taking this course..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="what_you_will_learn">What You Will Learn (Optional)</label>
                    <textarea
                        id="what_you_will_learn"
                        name="what_you_will_learn"
                        value={values.what_you_will_learn}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Key learning outcomes..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="target_audience">Target Audience (Optional)</label>
                    <textarea
                        id="target_audience"
                        name="target_audience"
                        value={values.target_audience}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Who is this course for..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : isEditMode ? 'Update Course' : 'Create Course'}
                    </button>
                    <button type="button" onClick={() => navigate('/instructor/dashboard')} className="btn btn-outline">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
