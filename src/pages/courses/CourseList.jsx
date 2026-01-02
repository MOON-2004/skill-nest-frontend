import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { useDebounce, usePagination } from '../../hooks/useApi';
import { formatPrice, getDifficultyColor, truncateText } from '../../utils/helpers';
import './CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [isFree, setIsFree] = useState('');
    const [ordering, setOrdering] = useState('-enrollment_count');

    const debouncedSearch = useDebounce(searchQuery, 500);
    const pagination = usePagination(1, 12);

    useEffect(() => {
        fetchCourses();
    }, [debouncedSearch, difficulty, isFree, ordering, pagination.page]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: pagination.page,
                page_size: pagination.pageSize,
                ordering,
            };

            if (debouncedSearch) params.search = debouncedSearch;
            if (difficulty) params.difficulty = difficulty;
            if (isFree !== '') params.is_free = isFree;

            const data = await courseApi.getCourses(params);
            setCourses(data.results);
            pagination.updatePaginationData(data);
        } catch (err) {
            setError('Failed to load courses');
            console.error(err);
            console.error('Error details:', err.response?.data);

            // Check for 500 error (backend issue)
            if (err.response?.status === 500) {
                console.warn('⚠️ Backend error when fetching courses. This might be due to category field removal.');
            }

            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setDifficulty('');
        setIsFree('');
        setOrdering('-enrollment_count');
        pagination.setPage(1);
    };

    return (
        <div className="course-list-page">
            <div className="page-header">
                <h1>Explore Courses</h1>
                <p>Discover your next learning adventure</p>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Levels</option>
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                    </select>

                    <select
                        value={isFree}
                        onChange={(e) => setIsFree(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Courses</option>
                        <option value="true">Free Only</option>
                        <option value="false">Paid Only</option>
                    </select>

                    <select
                        value={ordering}
                        onChange={(e) => setOrdering(e.target.value)}
                        className="filter-select"
                    >
                        <option value="-enrollment_count">Most Popular</option>
                        <option value="-average_rating">Highest Rated</option>
                        <option value="-created_at">Newest</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                    </select>

                    <button onClick={handleResetFilters} className="btn-reset">
                        Reset
                    </button>
                </div>
            </div>

            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading courses...</p>
                </div>
            )}

            {error && (
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchCourses} className="btn btn-primary">
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && courses.length === 0 && (
                <div className="empty-state">
                    <h3>No courses found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            )}

            {!loading && !error && courses.length > 0 && (
                <>
                    <div className="courses-grid">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={pagination.previousPage}
                                disabled={!pagination.hasPrevious}
                                className="btn-pagination"
                            >
                                Previous
                            </button>

                            <span className="pagination-info">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>

                            <button
                                onClick={pagination.nextPage}
                                disabled={!pagination.hasNext}
                                className="btn-pagination"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const CourseCard = ({ course }) => {
    return (
        <Link to={`/courses/${course.slug}`} className="course-card">
            <div className="course-thumbnail">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} />
                ) : (
                    <div className="thumbnail-placeholder">
                        <span>📚</span>
                    </div>
                )}
                {course.is_featured && <span className="badge-featured">Featured</span>}
            </div>

            <div className="course-content">
                <div className="course-meta">
                    <span className={`badge-difficulty ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                    </span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">
                    {truncateText(course.short_description, 100)}
                </p>

                <div className="course-instructor">
                    <span>👤 {course.instructor_name}</span>
                </div>

                <div className="course-stats">
                    <span>⭐ {course.average_rating || 'New'}</span>
                    <span>👥 {course.enrollment_count} students</span>
                    <span>📖 {course.lesson_count} lessons</span>
                </div>

                <div className="course-footer">
                    <span className="course-price">{formatPrice(course.price)}</span>
                    <span className="course-duration">{course.duration_hours}h</span>
                </div>
            </div>
        </Link>
    );
};

export default CourseList;

