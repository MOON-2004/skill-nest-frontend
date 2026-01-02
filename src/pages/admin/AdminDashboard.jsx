import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { instructorApi } from '../../api/instructorApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState({
        total_users: 0,
        active_users: 0,
        verified_users: 0,
        role_breakdown: {
            students: 0,
            instructors: 0,
            admins: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: '',
        is_active: '',
        is_verified: '',
        search: '',
        ordering: '-date_joined'
    });
    const [backendNotReady, setBackendNotReady] = useState(false);

    useEffect(() => {
        fetchAdminData();
    }, [filters]);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            // Build clean params (exclude empty values)
            const params = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );

            const response = await instructorApi.getUsers(params);

            setUsers(response.results || response || []);
            setStatistics(response.statistics || statistics);
            setBackendNotReady(false);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);

            // Check if it's a 404 error (backend endpoint not implemented)
            if (error.response?.status === 404) {
                setBackendNotReady(true);
                console.warn('⚠️ Admin endpoints not available in backend yet');
            }

            // Set empty data on error
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const response = await instructorApi.toggleUserStatus(userId);
            alert(response.message || `User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            fetchAdminData();
        } catch (error) {
            console.error('Failed to toggle user status:', error);
            alert('Failed to toggle user status');
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await instructorApi.updateUser(userId, { role: newRole });
            alert('User role updated successfully');
            fetchAdminData();
        } catch (error) {
            console.error('Failed to update user role:', error);
            alert('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await instructorApi.deleteUser(userId);
            alert('User deleted successfully');
            fetchAdminData();
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p className="subtitle">Manage users  and platform settings</p>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <div className="stat-value">{statistics.total_users}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <div className="stat-value">{statistics.active_users}</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <div className="stat-value">{statistics.role_breakdown.students}</div>
                        <div className="stat-label">Students</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-info">
                        <div className="stat-value">{statistics.role_breakdown.instructors}</div>
                        <div className="stat-label">Instructors</div>
                    </div>
                </div>
            </div>

            {/* Backend Not Ready Warning */}
            {backendNotReady && (
                <div className="backend-warning">
                    <div className="warning-icon">⚠️</div>
                    <div className="warning-content">
                        <h3>Admin Endpoints Not Available</h3>
                        <p>
                            The backend doesn't have the admin endpoints implemented yet.
                            To enable full admin functionality, add these endpoints to your Django backend:
                        </p>
                        <div className="endpoint-list">
                            <code>GET /api/admin/users/</code>
                            <code>POST /api/admin/users/:id/toggle-status/</code>
                            <code>PATCH /api/admin/users/:id/</code>
                            <code>DELETE /api/admin/users/:id/</code>
                        </div>
                        <p className="warning-note">
                            <strong>Note:</strong> The admin dashboard UI is ready - just waiting for the backend!
                        </p>
                    </div>
                </div>
            )}

            {/* User Management */}
            <div className="section">
                <div className="section-header">
                    <h2>User Management ({users.length})</h2>
                </div>

                {/* Filters */}
                <div className="filters-container">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="search-input"
                    />
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Roles</option>
                        <option value="STUDENT">Students</option>
                        <option value="INSTRUCTOR">Instructors</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                    <select
                        value={filters.is_active}
                        onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                    <select
                        value={filters.is_verified}
                        onChange={(e) => setFilters({ ...filters, is_verified: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Verification</option>
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                    </select>
                    <select
                        value={filters.ordering}
                        onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
                        className="filter-select"
                    >
                        <option value="-date_joined">Newest First</option>
                        <option value="date_joined">Oldest First</option>
                        <option value="email">Email A-Z</option>
                        <option value="-email">Email Z-A</option>
                        <option value="-last_login">Recently Active</option>
                    </select>
                </div>

                {users.length === 0 ? (
                    <div className="empty-state">
                        <p>No users found matching your filters.</p>
                    </div>
                ) : (
                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Verified</th>
                                    <th>Joined</th>
                                    <th>Last Login</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.full_name || `${user.first_name} ${user.last_name}`}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                className={`role-select ${user.role.toLowerCase()}`}
                                            >
                                                <option value="STUDENT">Student</option>
                                                <option value="INSTRUCTOR">Instructor</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                                {user.is_active ? '✓ Active' : '✗ Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`verify-badge ${user.is_verified ? 'verified' : 'unverified'}`}>
                                                {user.is_verified ? '✓' : '✗'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                        <td>
                                            {user.last_login
                                                ? new Date(user.last_login).toLocaleDateString()
                                                : 'Never'
                                            }
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                    className={`btn-sm ${user.is_active ? 'btn-warning' : 'btn-success'}`}
                                                    title={user.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {user.is_active ? '🔒' : '🔓'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="btn-sm btn-danger"
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
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
