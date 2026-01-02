import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { instructorApi } from '../../api/instructorApi';
import { useAuth } from '../../context/AuthContext';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        publishedCourses: 0,
        draftCourses: 0,
        totalStudents: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstructorData();
    }, []);

    const fetchInstructorData = async () => {
        try {
            const coursesData = await instructorApi.getMyCourses();
            const courses = coursesData.results || coursesData || [];
            setCourses(courses);

            // Calculate stats
            const published = courses.filter(c => c.is_published).length;
            const draft = courses.filter(c => !c.is_published).length;
            const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);

            setStats({
                totalCourses: courses.length,
                publishedCourses: published,
                draftCourses: draft,
                totalStudents: totalEnrollments
            });
        } catch (error) {
            console.error('Failed to fetch instructor data:', error);
            console.error('Error details:', error.response?.data);

            // Check for 405 Method Not Allowed
            if (error.response?.status === 405) {
                alert('⚠️ Backend Error: The instructor/courses endpoint does not support this HTTP method. Please check your Django backend configuration.');
            }

            // Set empty data on error
            setCourses([]);
            setStats({
                totalCourses: 0,
                publishedCourses: 0,
                draftCourses: 0,
                totalStudents: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await instructorApi.deleteCourse(courseId);
            fetchInstructorData();
        } catch (error) {
            console.error('Failed to delete course:', error);
            alert('Failed to delete course');
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
        <div className="instructor-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Instructor Dashboard</h1>
                    <p className="subtitle">Manage your courses and track student progress</p>
                </div>
                <button onClick={() => navigate('/instructor/courses/create')} className="btn btn-primary">
                    + Create New Course
                </button>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.totalCourses}</div>
                        <div className="stat-label">Total Courses</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.publishedCourses}</div>
                        <div className="stat-label">Published</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.draftCourses}</div>
                        <div className="stat-label">Drafts</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.totalStudents}</div>
                        <div className="stat-label">Total Students</div>
                    </div>
                </div>
            </div>

            {/* Courses List */}
            <div className="courses-section">
                <h2>My Courses</h2>
                {courses.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't created any courses yet.</p>
                        <button onClick={() => navigate('/instructor/courses/create')} className="btn btn-primary">
                            Create Your First Course
                        </button>
                    </div>
                ) : (
                    <div className="courses-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Title</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="course-title-cell">
                                                <strong>{course.title}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${course.is_published ? 'published' : 'draft'}`}>
                                                {course.is_published ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>{course.enrollment_count || 0}</td>
                                        <td>${course.price === "0.00" ? 'Free' : course.price}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)} 
                                                    className="btn-icon lessons" 
                                                    title="Manage Lessons"
                                                >
                                                    📚
                                                </button>
                                                <button onClick={() => handleDeleteCourse(course.id)} className="btn-icon danger" title="Delete">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorDashboard;
