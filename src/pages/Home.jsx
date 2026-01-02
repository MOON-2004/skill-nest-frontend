import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { formatPrice } from '../utils/helpers';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedCourses();
    }, []);

    const fetchFeaturedCourses = async () => {
        try {
            const data = await courseApi.getFeaturedCourses();
            setFeaturedCourses(data.slice(0, 6));
        } catch (error) {
            console.error('Failed to fetch featured courses:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Unlock Your Potential with
                        <span className="gradient-text"> SkillNest</span>
                    </h1>
                    <p className="hero-subtitle">
                        Learn from industry experts. Master new skills. Advance your career.
                    </p>
                    <div className="hero-cta">
                        <button onClick={() => navigate('/courses')} className="btn btn-primary btn-large">
                            Explore Courses
                        </button>
                        <button onClick={() => navigate('/register')} className="btn btn-outline btn-large">
                            Get Started Free
                        </button>
                    </div>
                </div>
                <div className="hero-illustration">
                    <div className="floating-card card-1">📚</div>
                    <div className="floating-card card-2">🎓</div>
                    <div className="floating-card card-3">💡</div>
                    <div className="floating-card card-4">🚀</div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stat-item">
                    <div className="stat-number">10,000+</div>
                    <div className="stat-label">Students</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Courses</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">100+</div>
                    <div className="stat-label">Instructors</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">4.8★</div>
                    <div className="stat-label">Average Rating</div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Featured Courses</h2>
                    <p>Handpicked courses to accelerate your learning</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading courses...</p>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {featuredCourses.map((course) => (
                            <Link key={course.id} to={`/courses/${course.slug}`} className="course-card">
                                <div className="course-thumbnail">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} />
                                    ) : (
                                        <div className="thumbnail-placeholder">📚</div>
                                    )}
                                </div>
                                <div className="course-content">
                                    <h3>{course.title}</h3>
                                    <p className="course-instructor">👤 {course.instructor_name}</p>
                                    <div className="course-footer">
                                        <span className="course-rating">⭐ {course.average_rating || 'New'}</span>
                                        <span className="course-price">{formatPrice(course.price)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="section-cta">
                    <button onClick={() => navigate('/courses')} className="btn btn-primary">
                        View All Courses
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Why Choose SkillNest?</h2>
                    <p>Everything you need to succeed in your learning journey</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Expert Instructors</h3>
                        <p>Learn from industry professionals with years of experience</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Learn Anywhere</h3>
                        <p>Access courses on any device, anytime, anywhere</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🏆</div>
                        <h3>Certificates</h3>
                        <p>Earn certificates to showcase your achievements</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💬</div>
                        <h3>Community Support</h3>
                        <p>Connect with peers and instructors in discussions</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Self-Paced Learning</h3>
                        <p>Learn at your own pace with lifetime access</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Track Progress</h3>
                        <p>Monitor your learning journey with detailed analytics</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Start Learning?</h2>
                <p>Join thousands of students already learning on SkillNest</p>
                <button onClick={() => navigate('/register')} className="btn btn-primary btn-large">
                    Sign Up Now
                </button>
            </section>
        </div>
    );
};

export default Home;

