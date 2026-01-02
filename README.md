# SkillNest - Online Learning Platform

> A modern, full-stack online learning platform built with React and Django REST Framework

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Features](#-features)
- [Components Documentation](#-components-documentation)
- [API Integration](#-api-integration)
- [Setup Instructions](#-setup-instructions)
- [Usage Guide](#-usage-guide)
- [Security Features](#-security-features)
- [Development Guidelines](#-development-guidelines)

---

## 🎯 Project Overview

**SkillNest** is a comprehensive online learning platform that enables students to browse, enroll in, and complete courses, while instructors can create and manage educational content. The platform features role-based access control, real-time progress tracking, and a modern, responsive user interface.

### 🌟 Key Highlights

- **Production-Ready Architecture** with layered design pattern
- **Modern Tech Stack** using React 18, Vite, and Django REST Framework
- **Secure Authentication** with JWT token management and auto-refresh
- **Role-Based Access Control** for Students, Instructors, and Admins
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Real-time Updates** for course progress and notifications
- **Premium UI/UX** with smooth animations and glassmorphism effects

### 👥 User Roles

1. **Student** - Browse courses, enroll, track progress, complete lessons and quizzes
2. **Instructor** - Create courses, manage lessons, track student progress
3. **Admin** - Manage users, approve courses, system-wide administration

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.0 | UI library for building component-based interfaces |
| **Vite** | 7.2.5 | Lightning-fast build tool and dev server |
| **React Router DOM** | 7.11.0 | Client-side routing and navigation |
| **Axios** | 1.13.2 | HTTP client with interceptors for API calls |
| **Context API** | Built-in | Global state management for auth |
| **Vanilla CSS** | - | Custom styling with full design control |
| **JavaScript ES6+** | - | Modern JavaScript without TypeScript |

### Backend (Django)
| Technology | Purpose |
|-----------|---------|
| **Django** | Web framework |
| **Django REST Framework** | RESTful API development |
| **MySQL / MariaDB** | Database |
| **JWT** | Token-based authentication |

### Development Tools
- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package management

---

## 🏗 Project Architecture

### Architecture Pattern

SkillNest follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Pages, Components, Layouts)         │
├─────────────────────────────────────────┤
│         Application Layer               │
│   (Routing, Context, Custom Hooks)      │
├─────────────────────────────────────────┤
│          Service Layer                  │
│    (API Services, Axios Instance)       │
├─────────────────────────────────────────┤
│          Utility Layer                  │
│  (Helpers, Formatters, Validators)      │
└─────────────────────────────────────────┘
```

### Directory Structure

```
skillnest-frontend/
├── public/                     # Static assets
├── src/
│   ├── api/                    # API service layer
│   │   ├── axios.js           # Axios instance with interceptors
│   │   ├── authApi.js         # Authentication endpoints
│   │   ├── courseApi.js       # Course-related endpoints
│   │   ├── learningApi.js     # Lessons & quizzes
│   │   ├── instructorApi.js   # Instructor & admin endpoints
│   │   └── notificationApi.js # Notifications
│   │
│   ├── components/            # Reusable UI components
│   │   └── (currently empty - components in pages)
│   │
│   ├── context/               # React Context providers
│   │   └── AuthContext.jsx   # Authentication state management
│   │
│   ├── hooks/                 # Custom React hooks
│   │   └── useApi.js         # useApi, usePagination, useForm, useDebounce
│   │
│   ├── layouts/               # Layout components
│   │   ├── MainLayout.jsx    # Main app layout with navbar/footer
│   │   └── MainLayout.css    # Layout styles
│   │
│   ├── pages/                 # Page components
│   │   ├── auth/             # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Auth.css
│   │   │
│   │   ├── courses/          # Course-related pages
│   │   │   ├── CourseList.jsx
│   │   │   ├── CourseList.css
│   │   │   ├── CourseDetail.jsx
│   │   │   └── CourseDetail.css
│   │   │
│   │   ├── instructor/       # Instructor pages
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── CourseForm.jsx
│   │   │   ├── LessonForm.jsx
│   │   │   ├── CourseLessonsManager.jsx
│   │   │   └── InstructorProgressDashboard.jsx
│   │   │
│   │   ├── admin/            # Admin pages
│   │   │   └── AdminDashboard.jsx
│   │   │
│   │   ├── Home.jsx          # Landing page
│   │   ├── Home.css
│   │   ├── Dashboard.jsx     # User dashboard
│   │   ├── Dashboard.css
│   │   ├── Enrollments.jsx   # Student enrollments
│   │   ├── Lessons.jsx       # Course lessons
│   │   ├── LessonDetail.jsx  # Individual lesson
│   │   ├── Quizzes.jsx       # Quizzes page
│   │   ├── Reviews.jsx       # Course reviews
│   │   ├── Discussions.jsx   # Course discussions
│   │   ├── Notifications.jsx # User notifications
│   │   ├── Profile.jsx       # User profile
│   │   ├── ChangePassword.jsx
│   │   ├── MediaUpload.jsx   # Media upload utility
│   │   ├── AdminStats.jsx    # Admin statistics
│   │   └── InstructorStats.jsx
│   │
│   ├── routes/                # Route configuration
│   │   └── ProtectedRoute.jsx # Protected & public routes
│   │
│   ├── utils/                 # Utility functions
│   │   └── helpers.js        # Date, price, error handling helpers
│   │
│   ├── App.jsx                # Main app with routing
│   ├── App.css
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
│
├── .env                       # Environment variables
├── .gitignore
├── package.json               # Dependencies
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint configuration
└── index.html                # HTML template
```

---

## ✨ Features

### ✅ Implemented Features

#### Authentication & Authorization
- ✅ User registration with email validation
- ✅ User login with JWT tokens
- ✅ Automatic token refresh on expiry
- ✅ Secure logout with token invalidation
- ✅ Role-based access control (Student, Instructor, Admin)
- ✅ Protected routes with authentication guards
- ✅ Auto-redirect on unauthorized access

#### Course Management (Student)
- ✅ Browse all available courses
- ✅ Search courses by name, description, or category
- ✅ Filter by difficulty level and price
- ✅ Sort by popularity, rating, date, and price
- ✅ View detailed course information
- ✅ Enroll in courses
- ✅ Track enrollment progress
- ✅ View course lessons and content
- ✅ Complete lessons and mark progress
- ✅ Take quizzes and view results

#### Instructor Features
- ✅ Create new courses with rich details
- ✅ Manage course content (add/edit/delete)
- ✅ Create lessons with video/document uploads
- ✅ Create quizzes with multiple questions
- ✅ Track student progress across courses
- ✅ View course analytics and statistics

#### Admin Features
- ✅ Manage all users (view, edit, delete)
- ✅ Approve/reject course submissions
- ✅ View platform-wide statistics
- ✅ Monitor system activity

#### UI/UX Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern gradient-based color scheme
- ✅ Smooth animations and transitions
- ✅ Loading states with spinners
- ✅ Error handling with user-friendly messages
- ✅ Empty states for better UX
- ✅ Form validation with real-time feedback
- ✅ Pagination for large datasets
- ✅ Debounced search for better performance
- ✅ Custom scrollbar styling

### 🚧 Future Enhancements
- [ ] Real-time notifications with WebSocket
- [ ] Course review and rating system
- [ ] Discussion forums for courses
- [ ] Certificate generation on completion
- [ ] Payment integration for paid courses
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Wishlist functionality
- [ ] Course recommendations based on interests

---

## 📦 Components Documentation

### Core Components

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)
**Purpose:** Global authentication state management

**State Properties:**
```javascript
{
  user: {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  },
  accessToken: string,
  refreshToken: string,
  isAuthenticated: boolean,
  loading: boolean,
  role: string
}
```

**Methods:**
- `login(credentials)` - Authenticate user
- `register(userData)` - Register new user
- `logout()` - Clear auth state and tokens
- `refreshToken()` - Refresh access token

---

#### 2. **ProtectedRoute** (`src/routes/ProtectedRoute.jsx`)
**Purpose:** Protect routes requiring authentication/authorization

**Props:**
- `allowedRoles` (array) - Roles permitted to access route
- `children` (component) - Component to render if authorized

**Usage:**
```javascript
<ProtectedRoute allowedRoles={['STUDENT']}>
  <Dashboard />
</ProtectedRoute>
```

**Flow:**
1. Check authentication status
2. Verify user role against allowed roles
3. Redirect to `/login` if not authenticated
4. Redirect to `/unauthorized` if wrong role
5. Render children if authorized

---

#### 3. **MainLayout** (`src/layouts/MainLayout.jsx`)
**Purpose:** Main application layout with navigation

**Features:**
- Responsive navigation bar
- User dropdown menu
- Role-based navigation items
- Footer with site links
- Mobile-friendly hamburger menu

**Sections:**
- Header with logo and navigation
- Main content area (renders children)
- Footer with copyright and links

---

### Page Components

#### 4. **Home** (`src/pages/Home.jsx`)
**Purpose:** Landing page for visitors

**Sections:**
- Hero section with CTA
- Platform statistics
- Featured courses carousel
- Key features showcase
- Call-to-action sections

**Key Features:**
- Fetches featured courses from API
- Displays real-time statistics
- Responsive grid layout
- Smooth scroll animations

---

#### 5. **Login** (`src/pages/auth/Login.jsx`)
**Purpose:** User authentication page

**Features:**
- Email and password fields
- Form validation
- Error handling
- Remember me functionality
- Link to registration

**Validation:**
- Email format validation
- Password minimum length
- Required field checks

**Flow:**
1. User enters credentials
2. Client-side validation
3. API call to `/api/auth/login/`
4. Store tokens in localStorage
5. Update AuthContext
6. Redirect to dashboard

---

#### 6. **Register** (`src/pages/auth/Register.jsx`)
**Purpose:** New user registration

**Form Fields:**
- First name
- Last name
- Email
- Password
- Confirm password
- Role selection (Student/Instructor)

**Validation:**
- Email uniqueness
- Password strength
- Password match
- Required fields

---

#### 7. **CourseList** (`src/pages/courses/CourseList.jsx`)
**Purpose:** Browse and search courses

**Features:**
- Search functionality
- Filter by difficulty and price
- Sort by various criteria
- Pagination (20 items per page)
- Responsive grid layout

**Filters:**
- Difficulty: Beginner, Intermediate, Advanced
- Price: Free, Paid
- Category: Multiple categories

**Sorting Options:**
- Most Popular
- Highest Rated
- Newest First
- Lowest Price

---

#### 8. **CourseDetail** (`src/pages/courses/CourseDetail.jsx`)
**Purpose:** Display detailed course information

**Sections:**
- Course header with title and instructor
- Course image/thumbnail
- Description and learning outcomes
- Curriculum (lessons list)
- Prerequisites
- Enrollment button (for students)
- Course statistics

**Features:**
- Check enrollment status
- Enroll in course (students)
- View course progress (enrolled students)
- Responsive layout

---

#### 9. **Dashboard** (`src/pages/Dashboard.jsx`)
**Purpose:** Role-based user dashboard

**Student View:**
- Enrolled courses
- Learning progress
- Upcoming lessons
- Achievement badges

**Instructor View:**
- Created courses
- Student statistics
- Recent activity
- Course performance

**Admin View:**
- Platform statistics
- User management
- Course approval queue
- System health

---

#### 10. **InstructorDashboard** (`src/pages/instructor/InstructorDashboard.jsx`)
**Purpose:** Instructor control panel

**Features:**
- Course management table
- Create new course button
- Edit/delete courses
- View student enrollments
- Course analytics

**Actions:**
- Create Course → Opens CourseForm
- Edit Course → Pre-filled CourseForm
- Delete Course → Confirmation dialog
- View Students → Student list

---

#### 11. **CourseForm** (`src/pages/instructor/CourseForm.jsx`)
**Purpose:** Create/edit course

**Form Fields:**
- Title
- Description
- Category
- Difficulty level
- Price
- Thumbnail image upload
- Prerequisites
- Learning outcomes

**Features:**
- Media upload for thumbnails
- Rich text editor for description
- Form validation
- Draft save functionality

---

#### 12. **CourseLessonsManager** (`src/pages/instructor/CourseLessonsManager.jsx`)
**Purpose:** Manage lessons within a course

**Features:**
- Add new lessons
- Edit existing lessons
- Reorder lessons (drag & drop)
- Delete lessons
- Preview lessons

**Actions:**
- Add Lesson → Opens LessonForm
- Edit Lesson → Pre-filled LessonForm
- Delete Lesson → Confirmation
- Reorder → Updates lesson order

---

#### 13. **LessonForm** (`src/pages/instructor/LessonForm.jsx`)
**Purpose:** Create/edit lesson

**Form Fields:**
- Lesson title
- Content type (Video, Document, Text)
- Video URL or file upload
- Text content (rich text editor)
- Duration
- Order/Position

**Features:**
- Multi-format content support
- Video preview
- Document upload
- Auto-save drafts

---

#### 14. **Lessons** (`src/pages/Lessons.jsx`)
**Purpose:** Student view of course lessons

**Features:**
- Lesson list with status
- Mark lessons as complete
- Navigate between lessons
- Track progress
- Access lesson materials

**States:**
- Not Started
- In Progress
- Completed
- Locked (prerequisites not met)

---

#### 15. **LessonDetail** (`src/pages/LessonDetail.jsx`)
**Purpose:** Individual lesson content viewer

**Features:**
- Video player for video lessons
- Document viewer
- Text content display
- Next/Previous navigation
- Completion checkbox
- Comments section (future)

---

#### 16. **Quizzes** (`src/pages/Quizzes.jsx`)
**Purpose:** Quiz taking interface

**Features:**
- Multiple choice questions
- Timer (if applicable)
- Submit answers
- View results
- Retry functionality

**Flow:**
1. Display quiz intro
2. Present questions one by one
3. Collect answers
4. Submit to backend
5. Display score and feedback

---

#### 17. **AdminDashboard** (`src/pages/admin/AdminDashboard.jsx`)
**Purpose:** Admin control panel

**Features:**
- User management (CRUD)
- Course approval queue
- System statistics
- Activity logs

**Sections:**
- Users table with actions
- Pending courses list
- Platform metrics
- Recent activity feed

---

### Custom Hooks

#### 18. **useApi** (`src/hooks/useApi.js`)
**Purpose:** Manage API calls with loading and error states

**Returns:**
```javascript
{
  data: any,           // API response data
  loading: boolean,    // Request in progress
  error: object,       // Error information
  execute: function    // Function to trigger API call
}
```

**Usage:**
```javascript
const { data, loading, error, execute } = useApi(courseApi.getCourses);

useEffect(() => {
  execute({ search: 'python' });
}, []);
```

---

#### 19. **usePagination** (`src/hooks/useApi.js`)
**Purpose:** Handle pagination logic

**Returns:**
```javascript
{
  currentPage: number,
  totalPages: number,
  hasNext: boolean,
  hasPrevious: boolean,
  nextPage: function,
  previousPage: function,
  goToPage: function,
  updatePaginationData: function
}
```

**Usage:**
```javascript
const pagination = usePagination(1, 20);

// After API call
pagination.updatePaginationData(response);
```

---

#### 20. **useForm** (`src/hooks/useApi.js`)
**Purpose:** Form state management and validation

**Parameters:**
- `initialValues` (object) - Initial form values
- `onSubmit` (function) - Submit handler
- `validate` (function) - Validation function

**Returns:**
```javascript
{
  values: object,      // Current form values
  errors: object,      // Validation errors
  handleChange: function,
  handleSubmit: function,
  resetForm: function
}
```

---

#### 21. **useDebounce** (`src/hooks/useApi.js`)
**Purpose:** Debounce rapidly changing values

**Parameters:**
- `value` - Value to debounce
- `delay` - Delay in milliseconds

**Usage:**
```javascript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  // API call with debouncedSearch
}, [debouncedSearch]);
```

---

### API Services

#### 22. **authApi** (`src/api/authApi.js`)
**Endpoints:**
- `register(userData)` - POST `/api/auth/register/`
- `login(credentials)` - POST `/api/auth/login/`
- `logout()` - POST `/api/auth/logout/`
- `getCurrentUser()` - GET `/api/auth/me/`
- `refreshToken(refresh)` - POST `/api/auth/token/refresh/`

---

#### 23. **courseApi** (`src/api/courseApi.js`)
**Endpoints:**
- `getCourses(params)` - GET `/api/courses/`
- `getCourseBySlug(slug)` - GET `/api/courses/:slug/`
- `getFeaturedCourses()` - GET `/api/courses/featured/`
- `enrollInCourse(id)` - POST `/api/courses/:id/enroll/`
- `getMyEnrollments()` - GET `/api/my-enrollments/`

---

#### 24. **learningApi** (`src/api/learningApi.js`)
**Endpoints:**
- `getLessons(courseId)` - GET `/api/courses/:id/lessons/`
- `getLessonDetail(id)` - GET `/api/lessons/:id/`
- `markLessonComplete(id)` - POST `/api/lessons/:id/complete/`
- `getQuizzes(courseId)` - GET `/api/courses/:id/quizzes/`
- `submitQuiz(id, answers)` - POST `/api/quizzes/:id/submit/`

---

#### 25. **instructorApi** (`src/api/instructorApi.js`)
**Endpoints:**
- `createCourse(data)` - POST `/api/instructor/courses/`
- `updateCourse(id, data)` - PUT `/api/instructor/courses/:id/`
- `deleteCourse(id)` - DELETE `/api/instructor/courses/:id/`
- `createLesson(data)` - POST `/api/instructor/lessons/`
- `updateLesson(id, data)` - PUT `/api/instructor/lessons/:id/`
- `getStudentProgress(courseId)` - GET `/api/instructor/courses/:id/progress/`

---

#### 26. **notificationApi** (`src/api/notificationApi.js`)
**Endpoints:**
- `getNotifications()` - GET `/api/notifications/`
- `markAsRead(id)` - POST `/api/notifications/:id/read/`
- `markAllAsRead()` - POST `/api/notifications/read-all/`

---

### Utility Functions

#### 27. **helpers.js** (`src/utils/helpers.js`)

**Date Formatting:**
- `formatDate(date)` - Format to "Jan 15, 2024"
- `formatDateTime(date)` - Format with time
- `formatDuration(minutes)` - "2h 30m" format

**Display Formatting:**
- `formatPrice(amount)` - "$99.99" format
- `getDifficultyColor(difficulty)` - Badge color
- `truncateText(text, length)` - Truncate with ellipsis
- `calculateProgress(completed, total)` - Percentage

**Helpers:**
- `debounce(func, delay)` - Debounce function
- `handleApiError(error)` - Parse API errors

---

## 🔌 API Integration

### Axios Configuration

The application uses a centralized Axios instance with interceptors for token management.

#### Request Interceptor
```javascript
// Automatically attaches JWT token to all requests
config.headers.Authorization = `Bearer ${accessToken}`;
```

#### Response Interceptor
```javascript
// Automatically refreshes token on 401 errors
if (error.response?.status === 401) {
  // Attempt token refresh
  // Retry original request
  // Logout if refresh fails
}
```

### API Base URL
```
Development: http://localhost:8000/api/
Production: https://api.skillnest.com/api/
```

### Authentication Flow

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │ POST /api/auth/login/
       │ {email, password}
       ↓
┌─────────────────────────┐
│   Backend Validates     │
└──────────┬──────────────┘
           │ Returns {user, tokens}
           ↓
┌──────────────────────────┐
│  Store in localStorage   │
│  Update AuthContext      │
└──────────┬───────────────┘
           │
           ↓
┌──────────────────────────┐
│  All API calls include   │
│  Authorization header    │
└──────────────────────────┘
```

### Error Handling

All API errors are caught and formatted using `handleApiError()`:

```javascript
try {
  const data = await courseApi.getCourses();
} catch (error) {
  const errorInfo = handleApiError(error);
  console.error(errorInfo.message);
  // errorInfo = {
  //   message: "User-friendly message",
  //   status: 404,
  //   details: {...}
  // }
}
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Django Backend** (running on port 8000)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillnest-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 📖 Usage Guide

### For Students

1. **Register** - Create a student account
2. **Browse Courses** - Explore available courses
3. **Enroll** - Click enroll on course detail page
4. **Learn** - Access lessons, complete content
5. **Quizzes** - Take quizzes to test knowledge
6. **Track Progress** - View progress in dashboard

### For Instructors

1. **Register** - Create an instructor account
2. **Create Course** - Go to instructor dashboard
3. **Add Lessons** - Add lessons to your course
4. **Create Quizzes** - Add assessments
5. **Manage** - Edit, delete, or publish courses
6. **Monitor** - Track student progress

### For Admins

1. **Access Admin Panel** - Navigate to `/admin`
2. **Manage Users** - View, edit, or delete users
3. **Approve Courses** - Review and approve submissions
4. **View Analytics** - Platform-wide statistics

---

## 🔒 Security Features

### Implemented Security Measures

1. **JWT Authentication**
   - Secure token-based authentication
   - Tokens stored in localStorage
   - Automatic token refresh
   - Auto-logout on token expiry

2. **Protected Routes**
   - Authentication required for sensitive pages
   - Role-based access control
   - Automatic redirects for unauthorized access

3. **Input Validation**
   - Client-side form validation
   - Email format validation
   - Password strength requirements
   - XSS protection (React escapes by default)

4. **Error Handling**
   - Secure error messages (no sensitive data)
   - Graceful error recovery
   - User-friendly error displays

### Production Recommendations

- [ ] Use httpOnly cookies for tokens (instead of localStorage)
- [ ] Implement CSRF protection
- [ ] Add rate limiting on API calls
- [ ] Use Content Security Policy (CSP)
- [ ] Implement proper CORS configuration
- [ ] Use HTTPS in production
- [ ] Sanitize all user inputs on backend
- [ ] Implement session management
- [ ] Add two-factor authentication (2FA)

---

## 💻 Development Guidelines

### Code Style

- **Components:** Use functional components with Hooks
- **Naming:** PascalCase for components, camelCase for functions
- **File Structure:** Co-locate CSS with components
- **Imports:** Organize by external → internal → styles

### Best Practices

1. **Component Design**
   - Keep components small and focused
   - Use custom hooks for reusable logic
   - Separate presentation from business logic

2. **State Management**
   - Use local state when possible
   - Use Context for global auth state
   - Avoid prop drilling

3. **API Calls**
   - Always use API service functions
   - Never make direct axios calls in components
   - Handle loading and error states

4. **Performance**
   - Debounce search inputs
   - Implement pagination for large lists
   - Use lazy loading for routes

5. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels where needed
   - Ensure keyboard navigation

### Adding New Features

1. **New Page:**
   - Create component in `src/pages/`
   - Add CSS file for styles
   - Add route in `App.jsx`
   - Add navigation link (if needed)

2. **New API Endpoint:**
   - Add function to appropriate API service
   - Use existing axios instance
   - Follow error handling pattern

3. **New Component:**
   - Create in `src/components/`
   - Make it reusable and configurable
   - Document props with comments

---

## 🎨 Design System

### Color Palette
```css
/* Primary Gradient */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Background Colors */
--bg-light: #f7fafc;
--bg-white: #ffffff;

/* Text Colors */
--text-primary: #1a202c;
--text-secondary: #718096;
--text-light: #a0aec0;

/* Semantic Colors */
--success: #48bb78;
--error: #f56565;
--warning: #ed8936;
--info: #4299e1;
```

### Typography
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Weights */
--fw-normal: 400;
--fw-medium: 500;
--fw-semibold: 600;
--fw-bold: 700;
--fw-extrabold: 800;

/* Font Sizes */
--fs-xs: 0.75rem;   /* 12px */
--fs-sm: 0.875rem;  /* 14px */
--fs-base: 1rem;    /* 16px */
--fs-lg: 1.125rem;  /* 18px */
--fs-xl: 1.25rem;   /* 20px */
--fs-2xl: 1.5rem;   /* 24px */
--fs-3xl: 1.875rem; /* 30px */
--fs-4xl: 2.25rem;  /* 36px */
```

### Spacing
```css
/* Spacing Scale (rem) */
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
```

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1400px) { /* Large Desktop */ }
```

---

## 📊 Project Statistics

- **Total Files:** 30+
- **Lines of Code:** 3000+
- **Components:** 25+
- **API Services:** 6
- **Custom Hooks:** 4
- **Utility Functions:** 10+
- **Pages:** 20+

---

## 🎓 Learning Outcomes

This project demonstrates:

✅ **Modern React Development** - Functional components, Hooks, Context API  
✅ **RESTful API Integration** - Axios, interceptors, error handling  
✅ **Authentication & Authorization** - JWT, token refresh, protected routes  
✅ **State Management** - Context API, custom hooks  
✅ **Responsive Design** - Mobile-first, media queries  
✅ **Code Organization** - Layered architecture, separation of concerns  
✅ **Best Practices** - Clean code, reusability, maintainability  
✅ **User Experience** - Loading states, error handling, animations  

---

## 📞 Support & Contribution

### Getting Help

- Check existing documentation in `/docs` (if available)
- Review code comments for complex logic
- Use browser DevTools for debugging
- Check console for error messages

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is created for educational purposes as part of Full Stack Development coursework.

---

## 🏆 Acknowledgments

- **Frontend Framework:** React Team
- **Build Tool:** Vite Team
- **UI Design:** Inspired by modern learning platforms
- **Icons & Assets:** Open source resources

---

**Built with ❤️ for SkillNest Learning Platform**  
**Version:** 1.0.0  
**Last Updated:** January 2026
