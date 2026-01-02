import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, formatDate, getDifficultyColor } from '../../utils/helpers';
import './CourseDetail.css';

const CourseDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchCourseDetails();
    }, [slug]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const data = await courseApi.getCourseBySlug(slug);
            setCourse(data);
        } catch (err) {
            setError('Failed to load course details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (user?.role !== 'STUDENT') {
            alert('Only students can enroll in courses');
            return;
        }

        try {
            setEnrolling(true);
            await courseApi.enrollInCourse(course.id);
            alert('Successfully enrolled!');
            fetchCourseDetails(); // Refresh to update enrollment status
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to enroll');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading course...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="error-container">
                <h2>{error || 'Course not found'}</h2>
                <button onClick={() => navigate('/courses')} className="btn btn-primary">
                    Back to Courses
                </button>
            </div>
        );
    }

    return (
        <div className="course-detail-page">
            {/* Hero Section */}
            <div className="course-hero">
                <div className="hero-content">
                    <div className="breadcrumb">
                        <span onClick={() => navigate('/courses')} className="breadcrumb-link">
                            Courses
                        </span>
                        <span> / </span>
                        <span>{course?.category?.name || 'Course'}</span>
                    </div>

                    <h1 className="course-title">{course?.title}</h1>
                    <p className="course-short-desc">{course?.short_description}</p>

                    <div className="course-meta-bar">
                        <span className={`badge ${getDifficultyColor(course?.difficulty)}`}>
                            {course?.difficulty}
                        </span>
                        <span>⭐ {course?.average_rating || 'New'} ({course?.review_count} reviews)</span>
                        <span>👥 {course?.enrollment_count} students</span>
                        <span>📅 Updated {formatDate(course?.updated_at)}</span>
                    </div>

                    {course?.instructor && (
                    <div className="instructor-info">
                        <div className="instructor-avatar">
                            {course.instructor.profile_picture ? (
                                <img src={course.instructor.profile_picture} alt={course.instructor.full_name} />
                            ) : (
                                <span>👤</span>
                            )}
                        </div>
                        <div>
                            <p className="instructor-label">Instructor</p>
                            <p className="instructor-name">{course.instructor.full_name}</p>
                        </div>
                    </div>
                    )}
                </div>

                <div className="hero-sidebar">
                    <div className="course-card-sidebar">
                        {course?.thumbnail && (
                            <img src={course.thumbnail} alt={course?.title} className="sidebar-thumbnail" />
                        )}

                        <div className="sidebar-content">
                            <div className="price-section">
                                <span className="price">{formatPrice(course?.price)}</span>
                            </div>

                            {course?.is_enrolled ? (
                                <button
                                    onClick={() => navigate(`/learn/${course.id}`)}
                                    className="btn btn-primary btn-block"
                                >
                                    Continue Learning
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="btn btn-primary btn-block"
                                >
                                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                </button>
                            )}

                            <div className="course-includes">
                                <h4>This course includes:</h4>
                                <ul>
                                    <li>📖 {course?.lessons?.length || 0} lessons</li>
                                    <li>⏱️ {course?.duration_hours} hours of content</li>
                                    <li>🌐 {course?.language}</li>
                                    <li>📱 Access on mobile and desktop</li>
                                    <li>🎓 Certificate of completion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="course-tabs">
                <div className="tabs-header">
                    <button
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab ${activeTab === 'curriculum' ? 'active' : ''}`}
                        onClick={() => setActiveTab('curriculum')}
                    >
                        Curriculum
                    </button>
                    <button
                        className={`tab ${activeTab === 'instructor' ? 'active' : ''}`}
                        onClick={() => setActiveTab('instructor')}
                    >
                        Instructor
                    </button>
                    <button
                        className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'overview' && (
                        <div className="tab-panel">
                            <section className="content-section">
                                <h2>About This Course</h2>
                                <p>{course?.description}</p>
                            </section>

                            <section className="content-section">
                                <h2>What You'll Learn</h2>
                                <p>{course?.what_you_will_learn}</p>
                            </section>

                            <section className="content-section">
                                <h2>Requirements</h2>
                                <p>{course?.requirements}</p>
                            </section>

                            <section className="content-section">
                                <h2>Target Audience</h2>
                                <p>{course?.target_audience}</p>
                            </section>
                        </div>
                    )}

                    {activeTab === 'curriculum' && (
                        <div className="tab-panel">
                            <h2>Course Curriculum</h2>
                            <div className="lessons-list">
                                {course?.lessons && course.lessons.length > 0 ? (
                                    course.lessons.map((lesson, index) => (
                                        <div key={lesson.id} className="lesson-item">
                                            <div className="lesson-number">{index + 1}</div>
                                            <div className="lesson-info">
                                                <h4>{lesson.title}</h4>
                                                <span className="lesson-type">{lesson.content_type}</span>
                                            </div>
                                            <div className="lesson-duration">{lesson.duration_minutes} min</div>
                                            {lesson.is_preview && <span className="badge-preview">Preview</span>}
                                        </div>
                                    ))
                                ) : (
                                    <p>No lessons available yet.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'instructor' && course?.instructor && (
                        <div className="tab-panel">
                            <div className="instructor-detail">
                                <div className="instructor-avatar-large">
                                    {course.instructor.profile_picture ? (
                                        <img src={course.instructor.profile_picture} alt={course.instructor.full_name} />
                                    ) : (
                                        <span>👤</span>
                                    )}
                                </div>
                                <div>
                                    <h2>{course.instructor.full_name}</h2>
                                    <p className="instructor-bio">{course.instructor.bio || 'No bio available'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="tab-panel">
                            <h2>Student Reviews</h2>
                            <p>Reviews will be displayed here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;

