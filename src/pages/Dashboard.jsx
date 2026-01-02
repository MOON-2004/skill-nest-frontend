import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseApi } from '../api/courseApi';
import { formatPrice, calculateProgress } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'STUDENT') {
            fetchEnrollments();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchEnrollments = async () => {
        try {
            const data = await courseApi.getMyEnrollments();
            setEnrollments(data.results || data || []);
        } catch (error) {
            console.error('Failed to fetch enrollments:', error);
            console.error('Error details:', error.response?.data);

            // Check for 500 error (backend issue)
            if (error.response?.status === 500) {
                console.warn('⚠️ Backend error when fetching enrollments. This might be due to category field removal.');
            }

            // Set empty enrollments on error
            setEnrollments([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome back, {user?.first_name}! 👋</h1>
                    <p className="dashboard-subtitle">Continue your learning journey</p>
                </div>
                {user?.role === 'STUDENT' && (
                    <button onClick={() => navigate('/courses')} className="btn btn-primary">
                        Browse Courses
                    </button>
                )}
                {user?.role === 'INSTRUCTOR' && (
                    <button onClick={() => navigate('/instructor/courses')} className="btn btn-primary">
                        Manage Courses
                    </button>
                )}
            </div>

            {user?.role === 'STUDENT' && (
                <div className="dashboard-content">
                    <section className="stats-overview">
                        <div className="stat-card">
                            <div className="stat-icon">📚</div>
                            <div className="stat-info">
                                <div className="stat-value">{enrollments.length}</div>
                                <div className="stat-label">Enrolled Courses</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-info">
                                <div className="stat-value">
                                    {enrollments.filter((e) => e.completed_at).length}
                                </div>
                                <div className="stat-label">Completed</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div className="stat-info">
                                <div className="stat-value">
                                    {enrollments.length > 0
                                        ? Math.round(
                                            enrollments.reduce(
                                                (sum, e) => sum + parseFloat(e.progress_percentage || 0),
                                                0
                                            ) / enrollments.length
                                        )
                                        : 0}
                                    %
                                </div>
                                <div className="stat-label">Avg Progress</div>
                            </div>
                        </div>
                    </section>

                    <section className="enrolled-courses">
                        <h2>My Courses</h2>
                        {enrollments.length === 0 ? (
                            <div className="empty-state">
                                <p>You haven't enrolled in any courses yet.</p>
                                <button onClick={() => navigate('/courses')} className="btn btn-primary">
                                    Explore Courses
                                </button>
                            </div>
                        ) : (
                            <div className="courses-list">
                                {enrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="enrollment-card">
                                        <div className="enrollment-thumbnail">
                                            {enrollment.course.thumbnail ? (
                                                <img src={enrollment.course.thumbnail} alt={enrollment.course.title} />
                                            ) : (
                                                <div className="thumbnail-placeholder">📚</div>
                                            )}
                                        </div>
                                        <div className="enrollment-content">
                                            <h3>{enrollment.course.title}</h3>
                                            <p className="enrollment-instructor">
                                                👤 {enrollment.course.instructor_name}
                                            </p>
                                            <div className="progress-section">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${enrollment.progress_percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="progress-text">{enrollment.progress_percentage}% Complete</span>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/learn/${enrollment.course.id}`)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                {enrollment.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {user?.role === 'INSTRUCTOR' && (
                <div className="dashboard-content">
                    <div className="instructor-welcome">
                        <h2>Instructor Dashboard</h2>
                        <p>Manage your courses and track student progress</p>
                        <button onClick={() => navigate('/instructor/dashboard')} className="btn btn-primary">
                            Go to Instructor Dashboard
                        </button>
                    </div>
                </div>
            )}

            {user?.role === 'ADMIN' && (
                <div className="dashboard-content">
                    <div className="admin-welcome">
                        <h2>Admin Dashboard</h2>
                        <p>Manage users, courses, and platform settings</p>
                        <button onClick={() => navigate('/admin/dashboard')} className="btn btn-primary">
                            Go to Admin Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

