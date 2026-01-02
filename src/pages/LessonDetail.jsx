import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonApi } from "../api/learningApi";
import "./LessonDetail.css";

const LessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching lesson:", lessonId);
        const data = await lessonApi.getLessonById(lessonId);
        console.log("Lesson data:", data);
        setLesson(data);
        setIsCompleted(data.is_completed || false);
      } catch (err) {
        console.error("Failed to load lesson:", err);
        setError("Failed to load lesson details");
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      setError("");
      console.log("Marking lesson as complete:", lessonId);
      
      await lessonApi.markLessonComplete(lessonId, {
        completed: true
      });
      
      setIsCompleted(true);
      alert("Lesson marked as completed! Your progress has been saved.");
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
      setError("Failed to save progress. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="lesson-detail-page">
        <div className="loading">Loading lesson...</div>
      </div>
    );
  }

  if (error && !lesson) {
    return (
      <div className="lesson-detail-page">
        <div className="error" style={{ color: "red", padding: "20px" }}>
          {error}
        </div>
        <button onClick={() => navigate(`/learn/${courseId}`)} className="btn btn-primary">
          Back to Lessons
        </button>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-detail-page">
        <div>Lesson not found</div>
        <button onClick={() => navigate(`/learn/${courseId}`)} className="btn btn-primary">
          Back to Lessons
        </button>
      </div>
    );
  }

  return (
    <div className="lesson-detail-page">
      {/* Header */}
      <div className="lesson-header">
        <button 
          onClick={() => navigate(`/learn/${courseId}`)} 
          className="btn-back"
        >
          ← Back to Lessons
        </button>
        <div className="header-content">
          <h1>{lesson.title}</h1>
          <div className="lesson-meta">
            <span className="badge">{lesson.content_type}</span>
            <span className="duration">⏱️ {lesson.duration_minutes} minutes</span>
            {isCompleted && <span className="completed-badge">✓ Completed</span>}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ margin: "20px" }}>
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="lesson-container">
        <div className="lesson-content">
          {/* Description */}
          <div className="content-section">
            <h2>Overview</h2>
            <p className="description">{lesson.description}</p>
          </div>

          {/* Video Content */}
          {lesson.content_type === "VIDEO" && lesson.video_url && (
            <div className="content-section">
              <h2>Video Lesson</h2>
              <div className="video-container">
                <iframe
                  width="100%"
                  height="600"
                  src={lesson.video_url}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Text Content */}
          {lesson.content_type === "TEXT" && lesson.content_text && (
            <div className="content-section">
              <h2>Lesson Content</h2>
              <div className="text-content">
                {lesson.content_text.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Article Content */}
          {lesson.content_type === "ARTICLE" && lesson.content_text && (
            <div className="content-section">
              <h2>Article</h2>
              <div className="article-content">
                {lesson.content_text.split('\n').map((paragraph, idx) => (
                  paragraph.trim() && <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* File Attachment */}
          {lesson.file_attachment && (
            <div className="content-section">
              <h2>📎 Course Materials</h2>
              <div className="attachment-container">
                <div className="attachment-item">
                  <div className="attachment-icon">📄</div>
                  <div className="attachment-info">
                    <p className="attachment-name">
                      {lesson.file_attachment.split('/').pop()}
                    </p>
                    <p className="attachment-hint">Download course materials</p>
                  </div>
                  <a 
                    href={lesson.file_attachment} 
                    download 
                    className="btn btn-primary"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Quiz/Assignment Notice */}
          {lesson.content_type === "QUIZ" && (
            <div className="content-section">
              <h2>📝 Quiz</h2>
              <p>Quiz functionality will be available soon.</p>
            </div>
          )}

          {lesson.content_type === "ASSIGNMENT" && (
            <div className="content-section">
              <h2>📋 Assignment</h2>
              <p>Assignment submission will be available soon.</p>
            </div>
          )}
        </div>

        {/* Sidebar - Actions */}
        <div className="lesson-sidebar">
          <div className="action-card">
            <h3>Lesson Progress</h3>
            
            {isCompleted ? (
              <div className="completion-status completed">
                <div className="status-icon">✓</div>
                <p>You have completed this lesson</p>
              </div>
            ) : (
              <div className="completion-status incomplete">
                <div className="status-icon">◯</div>
                <p>Mark this lesson as complete to track your progress</p>
              </div>
            )}

            <button
              onClick={handleMarkComplete}
              disabled={submitting || isCompleted}
              className={`btn btn-large ${isCompleted ? 'btn-disabled' : 'btn-success'}`}
              style={{ marginTop: "15px" }}
            >
              {submitting ? 'Saving...' : isCompleted ? '✓ Completed' : 'Mark as Complete'}
            </button>
          </div>

          {/* Lesson Info Card */}
          <div className="info-card">
            <h3>Lesson Information</h3>
            <div className="info-item">
              <label>Type:</label>
              <span>{lesson.content_type}</span>
            </div>
            <div className="info-item">
              <label>Duration:</label>
              <span>{lesson.duration_minutes} minutes</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={isCompleted ? 'text-success' : 'text-muted'}>
                {isCompleted ? 'Completed' : 'Not Started'}
              </span>
            </div>
            {lesson.created_at && (
              <div className="info-item">
                <label>Published:</label>
                <span>{new Date(lesson.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
