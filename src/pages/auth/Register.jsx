import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useApi';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [apiError, setApiError] = useState('');

    const validate = (values) => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Email is invalid';
        }

        if (!values.first_name) {
            errors.first_name = 'First name is required';
        }

        if (!values.last_name) {
            errors.last_name = 'Last name is required';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        } else if (values.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (!values.password_confirm) {
            errors.password_confirm = 'Please confirm your password';
        } else if (values.password !== values.password_confirm) {
            errors.password_confirm = 'Passwords do not match';
        }

        if (!values.role) {
            errors.role = 'Please select a role';
        }

        return errors;
    };

    const handleRegister = async (values) => {
        setApiError('');
        const result = await register(values);

        if (result.success) {
            navigate('/dashboard');
        } else {
            // Handle validation errors from backend
            if (result.error && typeof result.error === 'object') {
                const errorMessages = Object.entries(result.error)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n');
                setApiError(errorMessages);
            } else {
                setApiError(result.error?.message || 'Registration failed');
            }
        }
    };

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
        {
            email: '',
            password: '',
            password_confirm: '',
            first_name: '',
            last_name: '',
            role: 'STUDENT',
            phone_number: '',
        },
        handleRegister,
        validate
    );

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join SkillNest and start learning today</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {apiError && (
                        <div className="alert alert-error">
                            <pre>{apiError}</pre>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={values.first_name}
                                onChange={handleChange}
                                className={errors.first_name ? 'error' : ''}
                                placeholder="John"
                            />
                            {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={values.last_name}
                                onChange={handleChange}
                                className={errors.last_name ? 'error' : ''}
                                placeholder="Doe"
                            />
                            {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="john.doe@example.com"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={values.phone_number}
                            onChange={handleChange}
                            placeholder="+1234567890"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">I want to</label>
                        <select
                            id="role"
                            name="role"
                            value={values.role}
                            onChange={handleChange}
                            className={errors.role ? 'error' : ''}
                        >
                            <option value="STUDENT">Learn (Student)</option>
                            <option value="INSTRUCTOR">Teach (Instructor)</option>
                        </select>
                        {errors.role && <span className="error-text">{errors.role}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="At least 8 characters"
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirm">Confirm Password</label>
                        <input
                            type="password"
                            id="password_confirm"
                            name="password_confirm"
                            value={values.password_confirm}
                            onChange={handleChange}
                            className={errors.password_confirm ? 'error' : ''}
                            placeholder="Re-enter your password"
                        />
                        {errors.password_confirm && (
                            <span className="error-text">{errors.password_confirm}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

