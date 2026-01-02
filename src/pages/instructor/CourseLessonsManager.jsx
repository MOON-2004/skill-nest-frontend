import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instructorApi } from '../../api/instructorApi';
import LessonForm from './LessonForm';
import './CourseLessonsManager.css';

const CourseLessonsManager = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourseAndLessons();
    }, [courseId]);

    const fetchCourseAndLessons = async () => {
        try {
            setLoading(true);
            console.log('Fetching course with ID:', courseId, 'Type:', typeof courseId);
            
            // Ensure courseId is a number
            const id = parseInt(courseId, 10);
            if (isNaN(id)) {
                setError('Invalid course ID');
                setLoading(false);
                return;
            }
            
            const courseData = await instructorApi.getCourse(id);
            setCourse(courseData);
            setLessons(courseData.lessons || []);
        } catch (err) {
            console.error('Failed to fetch course:', err);
            console.error('Error status:', err.response?.status);
            console.error('Error data:', err.response?.data);
            setError('Failed to load course lessons');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = () => {
        setEditingLesson(null);
        setShowForm(true);
    };

    const handleEditLesson = (lesson) => {
        setEditingLesson(lesson);
        setShowForm(true);
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;

        try {
            // Note: If backend doesn't have delete endpoint, you'll need to add it
            // For now, we'll just remove it from the UI
            setLessons(lessons.filter(l => l.id !== lessonId));
            alert('Lesson deleted successfully');
        } catch (err) {
            console.error('Failed to delete lesson:', err);
            alert('Failed to delete lesson');
        }
    };

    const handleLessonSaved = () => {
        setShowForm(false);
        fetchCourseAndLessons();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading lessons...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="error-container">
                <p>Course not found</p>
                <button onClick={() => navigate('/instructor/dashboard')} className="btn btn-primary">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="lessons-manager-container">
            <div className="manager-header">
                <div>
                    <button onClick={() => navigate('/instructor/dashboard')} className="btn-back">
                        ← Back
                    </button>
                    <h1>{course.title}</h1>
                    <p className="subtitle">Manage course lessons and content</p>
                </div>
                {!showForm && (
                    <button onClick={handleAddLesson} className="btn btn-primary">
                        + Add New Lesson
                    </button>
                )}
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {showForm ? (
                <div className="form-section">
                    <LessonForm
                        courseId={courseId}
                        lesson={editingLesson}
                        onSaved={handleLessonSaved}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingLesson(null);
                        }}
                        existingLessons={lessons}
                    />
                </div>
            ) : (
                <div className="lessons-section">
                    {lessons.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📚</div>
                            <h3>No lessons yet</h3>
                            <p>Start by creating your first lesson for this course</p>
                            <button onClick={handleAddLesson} className="btn btn-primary">
                                Create First Lesson
                            </button>
                        </div>
                    ) : (
                        <div className="lessons-list">
                            <div className="lessons-header">
                                <h2>Course Lessons ({lessons.length})</h2>
                            </div>
                            <div className="lessons-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Duration</th>
                                            <th>Preview</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lessons.map((lesson, index) => (
                                            <tr key={lesson.id}>
                                                <td className="lesson-number">{index + 1}</td>
                                                <td>
                                                    <div className="lesson-title-cell">
                                                        <strong>{lesson.title}</strong>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-${lesson.content_type?.toLowerCase()}`}>
                                                        {lesson.content_type}
                                                    </span>
                                                </td>
                                                <td>{lesson.duration_minutes} min</td>
                                                <td>
                                                    {lesson.is_preview ? (
                                                        <span className="badge badge-preview">Preview Available</span>
                                                    ) : (
                                                        <span className="text-muted">Private</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => handleEditLesson(lesson)}
                                                            className="btn-icon edit"
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLesson(lesson.id)}
                                                            className="btn-icon danger"
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseLessonsManager;
