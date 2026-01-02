import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Enrollments from './pages/Enrollments';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Quizzes from './pages/Quizzes';
import Reviews from './pages/Reviews';
import Discussions from './pages/Discussions';
import Notifications from './pages/Notifications';
import InstructorStats from './pages/InstructorStats';
import AdminStats from './pages/AdminStats';
import MediaUpload from './pages/MediaUpload';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CourseForm from './pages/instructor/CourseForm';
import CourseLessonsManager from './pages/instructor/CourseLessonsManager';
import InstructorProgressDashboard from './pages/instructor/InstructorProgressDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

function App() {
  return (
    <MainLayout>
      <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />

            {/* Auth Routes - Redirect if already logged in */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes - Require Authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/create"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <CourseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/edit"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <CourseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/lessons"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <CourseLessonsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/progress"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <InstructorProgressDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* User Profile Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enrollments"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Enrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lessons/:courseId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Lessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/:courseId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Quizzes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/:courseId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Reviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discussions/:courseId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Discussions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/media-upload"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'INSTRUCTOR', 'ADMIN']}>
                  <MediaUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor-stats"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                  <InstructorStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-stats"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminStats />
                </ProtectedRoute>
              }
            />

            {/* Student Learning Routes */}
            <Route
              path="/learn/:courseId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <Lessons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:courseId/lesson/:lessonId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <LessonDetail />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized */}
            <Route
              path="/unauthorized"
              element={
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                  <h1>403 - Unauthorized</h1>
                  <p>You don't have permission to access this page.</p>
                </div>
              }
            />

            {/* 404 Not Found */}
            <Route
              path="*"
              element={
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              }
            />
          </Routes>
        </MainLayout>
  );
}

export default App;
