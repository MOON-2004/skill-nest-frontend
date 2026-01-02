import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="main-layout">
            <header className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🎓</span>
                        <span className="logo-text">SkillNest</span>
                    </Link>

                    <nav className="nav-links">
                        <Link to="/courses" className="nav-link">
                            Courses
                        </Link>
                        {isAuthenticated && user?.role === 'INSTRUCTOR' && (
                            <Link to="/instructor/courses" className="nav-link">
                                Teach
                            </Link>
                        )}
                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link to="/admin/users" className="nav-link">
                                Admin
                            </Link>
                        )}
                    </nav>

                    <div className="nav-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="nav-link">
                                    Dashboard
                                </Link>
                                <div className="user-menu">
                                    <button className="user-button">
                                        <span className="user-avatar">
                                            {user?.profile_picture ? (
                                                <img src={user.profile_picture} alt={user.full_name} />
                                            ) : (
                                                <span>👤</span>
                                            )}
                                        </span>
                                        <span className="user-name">{user?.first_name}</span>
                                    </button>
                                    <div className="dropdown-menu">
                                        <Link to="/profile" className="dropdown-item">
                                            Profile
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="main-content">{children}</main>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>SkillNest</h3>
                        <p>Empowering learners worldwide with quality education.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Learn</h4>
                        <Link to="/courses">Browse Courses</Link>
                        <Link to="/categories">Categories</Link>
                    </div>
                    <div className="footer-section">
                        <h4>Company</h4>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                    <div className="footer-section">
                        <h4>Support</h4>
                        <Link to="/help">Help Center</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 SkillNest. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

