import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import "./InstructorProgressDashboard.css";

const InstructorProgressDashboard = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [lessonProgress, setLessonProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch course details with students
        const courseData = await instructorApi.getCourse(courseId);
        setCourse(courseData);

        // Try to fetch progress data from backend
        try {
          const progressData = await instructorApi.getCourseProgress(courseId);
          console.log("Progress data:", progressData);
          
          // Extract unique students and their progress
          const studentsMap = new Map();
          const progressMap = {};

          if (Array.isArray(progressData)) {
            progressData.forEach((item) => {
              if (!studentsMap.has(item.student_id)) {
                studentsMap.set(item.student_id, {
                  id: item.student_id,
                  name: item.student_name || "Unknown",
                  email: item.student_email || "No email",
                });
              }
              if (!progressMap[item.student_id]) {
                progressMap[item.student_id] = [];
              }
              progressMap[item.student_id].push({
                lessonId: item.lesson_id,
                lessonTitle: item.lesson_title,
                isCompleted: item.is_completed,
              });
            });

            setStudents(Array.from(studentsMap.values()));
            setLessonProgress(progressMap);
          } else if (progressData.results) {
            progressData.results.forEach((item) => {
              if (!studentsMap.has(item.student_id)) {
                studentsMap.set(item.student_id, {
                  id: item.student_id,
                  name: item.student_name || "Unknown",
                  email: item.student_email || "No email",
                });
              }
              if (!progressMap[item.student_id]) {
                progressMap[item.student_id] = [];
              }
              progressMap[item.student_id].push({
                lessonId: item.lesson_id,
                lessonTitle: item.lesson_title,
                isCompleted: item.is_completed,
              });
            });

            setStudents(Array.from(studentsMap.values()));
            setLessonProgress(progressMap);
          }
        } catch (progressErr) {
          console.warn(
            "Progress endpoint not available. Showing enrollments without progress data.",
            progressErr
          );
          // Fallback: show enrollments without progress
          if (courseData.enrollments) {
            setStudents(
              courseData.enrollments.map((e) => ({
                id: e.student?.id || e.id,
                name: e.student?.name || "Unknown",
                email: e.student?.email || "No email",
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
        setError("Failed to load course progress data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchProgress();
  }, [courseId]);

  const getStudentProgress = (studentId) => {
    const studentLessons = lessonProgress[studentId] || [];
    const completed = studentLessons.filter((l) => l.isCompleted).length;
    const total = studentLessons.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="instructor-progress-page">
        <div className="loading">Loading progress data...</div>
      </div>
    );
  }

  return (
    <div className="instructor-progress-page">
      <div className="progress-header">
        <h1>Student Progress</h1>
        {course && <p className="course-name">Course: {course.title}</p>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="progress-container">
        {students.length === 0 ? (
          <div className="no-students">
            <p>No students enrolled in this course yet.</p>
          </div>
        ) : (
          <div className="progress-table">
            <div className="table-header">
              <div className="header-cell student-name">Student Name</div>
              <div className="header-cell email">Email</div>
              <div className="header-cell progress">Overall Progress</div>
              <div className="header-cell lessons">Lesson Details</div>
            </div>

            <div className="table-body">
              {students.map((student) => {
                const progressPercent = getStudentProgress(student.id);
                const studentLessons = lessonProgress[student.id] || [];

                return (
                  <div key={student.id} className="table-row">
                    <div className="cell student-name">
                      <strong>{student.name}</strong>
                    </div>
                    <div className="cell email">
                      <span>{student.email}</span>
                    </div>
                    <div className="cell progress">
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor:
                              progressPercent === 100 ? "#27ae60" : "#3498db",
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{progressPercent}%</span>
                    </div>
                    <div className="cell lessons">
                      {studentLessons.length === 0 ? (
                        <span className="no-lessons">No progress yet</span>
                      ) : (
                        <div className="lesson-list">
                          {studentLessons.map((lesson, idx) => (
                            <div key={idx} className="lesson-item">
                              <span
                                className={`lesson-status ${
                                  lesson.isCompleted ? "completed" : "pending"
                                }`}
                              >
                                {lesson.isCompleted ? "✓" : "○"}
                              </span>
                              <span className="lesson-name">
                                {lesson.lessonTitle}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="progress-summary">
        <h3>Summary</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Total Students:</span>
            <span className="stat-value">{students.length}</span>
          </div>
          {course && (
            <div className="stat">
              <span className="stat-label">Total Lessons:</span>
              <span className="stat-value">
                {course.lessons?.length || 0}
              </span>
            </div>
          )}
          {students.length > 0 && (
            <div className="stat">
              <span className="stat-label">Average Progress:</span>
              <span className="stat-value">
                {Math.round(
                  students.reduce((sum, s) => sum + getStudentProgress(s.id), 0) /
                    students.length
                )}
                %
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorProgressDashboard;
