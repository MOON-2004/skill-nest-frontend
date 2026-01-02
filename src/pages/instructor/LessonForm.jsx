import { useState, useEffect } from 'react';
import { instructorApi } from '../../api/instructorApi';
import './LessonForm.css';

const LessonForm = ({ courseId, lesson, onSaved, onCancel, existingLessons = [] }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEditMode = !!lesson?.id;

    // Calculate next available order
    const getNextOrder = () => {
        if (!existingLessons || existingLessons.length === 0) return 1;
        const maxOrder = Math.max(...existingLessons.map(l => l.order || 0));
        return maxOrder + 1;
    };

    const initialValues = {
        title: '',
        description: '',
        content_type: 'VIDEO',
        video_url: '',
        content_text: '',
        file_attachment: null,
        duration_minutes: 10,
        is_preview: false,
        order: isEditMode ? (lesson?.order || 1) : getNextOrder()
    };

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        if (isEditMode && lesson) {
            console.log('Loading lesson:', lesson);
            setValues({
                title: lesson.title || '',
                description: lesson.description || '',
                content_type: lesson.content_type || 'VIDEO',
                video_url: lesson.video_url || '',
                content_text: lesson.content_text || '',
                file_attachment: lesson.file_attachment || null,
                duration_minutes: lesson.duration_minutes || 10,
                is_preview: lesson.is_preview || false,
                order: lesson.order || 1
            });
            if (lesson.file_attachment) {
                setFilePreview(lesson.file_attachment);
            }
        } else {
            // For new lessons, recalculate order based on existing lessons
            const nextOrder = getNextOrder();
            setValues(prev => ({
                ...prev,
                order: nextOrder
            }));
        }
    }, [lesson, isEditMode, existingLessons]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed', 
                                    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                
                if (!allowedTypes.includes(file.type)) {
                    setErrors(prev => ({ 
                        ...prev, 
                        file_attachment: 'Only PDF, ZIP, PowerPoint, Word, and Excel files are allowed' 
                    }));
                    return;
                }
                
                // Validate file size (max 50MB)
                if (file.size > 50 * 1024 * 1024) {
                    setErrors(prev => ({ 
                        ...prev, 
                        file_attachment: 'File size must be less than 50MB' 
                    }));
                    return;
                }
                
                setValues(prev => ({
                    ...prev,
                    file_attachment: file
                }));
                setFilePreview(file.name);
                
                // Clear error for this field
                if (errors.file_attachment) {
                    setErrors(prev => ({ ...prev, file_attachment: '' }));
                }
            }
        } else {
            const newValue = type === 'checkbox' ? checked : value;
            setValues(prev => ({
                ...prev,
                [name]: newValue
            }));

            // Clear error for this field
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!values.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!values.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (values.content_type === 'VIDEO' && !values.video_url.trim()) {
            newErrors.video_url = 'Video URL is required for video content';
        }

        if (values.content_type === 'TEXT' && !values.content_text.trim()) {
            newErrors.content_text = 'Lesson content is required for text content';
        }

        if (values.duration_minutes < 1) {
            newErrors.duration_minutes = 'Duration must be at least 1 minute';
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

            // Use FormData to support file uploads
            const formData = new FormData();
            formData.append('course', parseInt(courseId));
            formData.append('title', values.title.trim());
            formData.append('description', values.description.trim());
            formData.append('content_type', values.content_type);
            formData.append('video_url', values.video_url.trim() || '');
            formData.append('content_text', values.content_text.trim() || '');
            formData.append('duration_minutes', parseInt(values.duration_minutes));
            formData.append('is_preview', values.is_preview);
            formData.append('is_published', true);
            formData.append('order', parseInt(values.order));
            
            // Add file if present
            if (values.file_attachment && values.file_attachment instanceof File) {
                formData.append('file_attachment', values.file_attachment);
            }
            
            // Debug: Log what we're sending
            console.log('FormData being sent:', {
                course: parseInt(courseId),
                title: values.title.trim(),
                description: values.description.trim(),
                content_type: values.content_type,
                video_url: values.video_url.trim() || '',
                content_text: values.content_text.trim() || '',
                duration_minutes: parseInt(values.duration_minutes),
                is_preview: values.is_preview,
                order: parseInt(values.order),
                hasFile: values.file_attachment instanceof File
            });

            if (isEditMode) {
                // For update, use PATCH with lesson ID
                await instructorApi.updateLesson(lesson.id, formData);
                alert('Lesson updated successfully!');
            } else {
                await instructorApi.createLesson(formData);
                alert('Lesson created successfully!');
            }

            onSaved();
        } catch (err) {
            console.error('Failed to save lesson:', err);
            console.error('Response data:', err.response?.data);
            console.error('Response status:', err.response?.status);
            
            // Log the actual non_field_errors if present
            if (err.response?.data?.non_field_errors) {
                console.error('Non-field errors:', err.response.data.non_field_errors);
            }
            
            // Build error message
            let errorMessage = 'Failed to save lesson. ';
            if (err.response?.data) {
                // Check for non_field_errors first
                if (err.response.data.non_field_errors && Array.isArray(err.response.data.non_field_errors)) {
                    errorMessage = err.response.data.non_field_errors[0];
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else {
                    // Show all errors as a summary
                    const errorKeys = Object.keys(err.response.data);
                    if (errorKeys.length > 0) {
                        errorMessage += 'Issues: ' + errorKeys.join(', ');
                    } else {
                        errorMessage += 'Please check all fields.';
                    }
                }
            } else {
                errorMessage += 'Network or server error.';
            }
            
            setError(errorMessage);

            // Show field-specific errors if available
            if (err.response?.data) {
                const apiErrors = {};
                Object.keys(err.response.data).forEach(key => {
                    if (key !== 'non_field_errors') { // Skip non_field_errors in field-level errors
                        if (Array.isArray(err.response.data[key])) {
                            apiErrors[key] = err.response.data[key][0];
                        } else if (typeof err.response.data[key] === 'string') {
                            apiErrors[key] = err.response.data[key];
                        }
                    }
                });
                setErrors(apiErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lesson-form-container">
            <div className="form-header">
                <h2>{isEditMode ? 'Edit Lesson' : 'Create New Lesson'}</h2>
                <button onClick={onCancel} className="btn btn-outline">
                    Cancel
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="lesson-form">
                {/* Basic Information */}
                <fieldset className="form-section">
                    <legend>Basic Information</legend>

                    <div className="form-group">
                        <label htmlFor="title">Lesson Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            placeholder="e.g., Introduction to React Hooks"
                            className={errors.title ? 'error' : ''}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            placeholder="Describe what students will learn in this lesson"
                            rows="4"
                            className={errors.description ? 'error' : ''}
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="duration_minutes">Duration (minutes) *</label>
                            <input
                                type="number"
                                id="duration_minutes"
                                name="duration_minutes"
                                value={values.duration_minutes}
                                onChange={handleChange}
                                min="1"
                                className={errors.duration_minutes ? 'error' : ''}
                            />
                            {errors.duration_minutes && <span className="error-message">{errors.duration_minutes}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="order">Lesson Order</label>
                            <input
                                type="number"
                                id="order"
                                name="order"
                                value={values.order}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Content Type */}
                <fieldset className="form-section">
                    <legend>Content Type</legend>

                    <div className="form-group">
                        <label htmlFor="content_type">Content Type *</label>
                        <select
                            id="content_type"
                            name="content_type"
                            value={values.content_type}
                            onChange={handleChange}
                        >
                            <option value="VIDEO">Video</option>
                            <option value="TEXT">Text</option>
                            <option value="QUIZ">Quiz</option>
                            <option value="ASSIGNMENT">Assignment</option>
                            <option value="ARTICLE">Article</option>
                        </select>
                    </div>

                    {values.content_type === 'VIDEO' && (
                        <div className="form-group">
                            <label htmlFor="video_url">Video URL *</label>
                            <input
                                type="url"
                                id="video_url"
                                name="video_url"
                                value={values.video_url}
                                onChange={handleChange}
                                placeholder="https://www.youtube.com/embed/..."
                                className={errors.video_url ? 'error' : ''}
                            />
                            {errors.video_url && <span className="error-message">{errors.video_url}</span>}
                            <small>Supports YouTube, Vimeo, and direct video URLs</small>
                        </div>
                    )}

                    {values.content_type === 'TEXT' && (
                        <div className="form-group">
                            <label htmlFor="content_text">Lesson Content *</label>
                            <textarea
                                id="content_text"
                                name="content_text"
                                value={values.content_text}
                                onChange={handleChange}
                                placeholder="Enter your lesson content here (supports markdown)"
                                rows="8"
                                className={errors.content_text ? 'error' : ''}
                            />
                            {errors.content_text && <span className="error-message">{errors.content_text}</span>}
                        </div>
                    )}

                    {/* File Upload Section (Available for all content types) */}
                    <div className="form-group">
                        <label htmlFor="file_attachment">📎 Attachment (ZIP, PDF, PowerPoint, Word, Excel)</label>
                        <div className="file-upload-container">
                            <input
                                type="file"
                                id="file_attachment"
                                name="file_attachment"
                                onChange={handleChange}
                                accept=".pdf,.zip,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                                className={errors.file_attachment ? 'error' : ''}
                            />
                            {filePreview && (
                                <div className="file-preview">
                                    <span className="file-name">✓ {filePreview}</span>
                                </div>
                            )}
                            {errors.file_attachment && <span className="error-message">{errors.file_attachment}</span>}
                            <small>Max file size: 50MB. Supported: PDF, ZIP, PowerPoint, Word, Excel</small>
                        </div>
                    </div>
                </fieldset>

                {/* Lesson Settings */}
                <fieldset className="form-section">
                    <legend>Lesson Settings</legend>

                    <div className="form-group checkbox">
                        <label htmlFor="is_preview">
                            <input
                                type="checkbox"
                                id="is_preview"
                                name="is_preview"
                                checked={values.is_preview}
                                onChange={handleChange}
                            />
                            <span>Allow preview (students can see this lesson without enrolling)</span>
                        </label>
                    </div>
                </fieldset>

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-large"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Lesson' : 'Create Lesson')}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-outline btn-large"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LessonForm;
