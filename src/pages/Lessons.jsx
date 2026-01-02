import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonApi } from "../api/learningApi";
import "./Lessons.css";

const Lessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseLessons = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching lessons for course:", courseId);
        
        // Fetch lessons filtered by course ID
        const data = await lessonApi.getCourseLessons(courseId);
        console.log("Lessons data:", data);
        
        // Handle both paginated and direct response formats
        const lessonsList = data.results || data || [];
        setLessons(lessonsList);
        
        if (lessonsList.length === 0) {
          setError("No lessons available for this course yet.");
        }
      } catch (err) {
        console.error("Failed to load lessons:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        setError(`Failed to load lessons: ${err.response?.status || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) fetchCourseLessons();
  }, [courseId]);

  if (loading) {
    return (
      <div className="lessons-page">
        <h2>Course Lessons</h2>
        <div className="loading">Loading lessons...</div>
      </div>
    );
  }

  if (error && lessons.length === 0) {
    return (
      <div className="lessons-page">
        <h2>Course Lessons</h2>
        <div className="error" style={{ color: "red", padding: "20px" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-page" style={{ padding: "20px" }}>
      <h2>Lessons</h2>
      
      {lessons.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>No lessons found for this course.</p>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {lessons.map((lesson) => (
              <li key={lesson.id} style={{ 
                padding: "15px", 
                marginBottom: "10px", 
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>
                      {lesson.is_completed && '✓ '}{lesson.title}
                    </h3>
                    <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                      {lesson.description}
                    </p>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      <span style={{ marginRight: "15px" }}>
                        Type: <strong>{lesson.content_type}</strong>
                      </span>
                      <span style={{ marginRight: "15px" }}>
                        Duration: <strong>{lesson.duration_minutes} min</strong>
                      </span>
                      {lesson.is_completed && (
                        <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/learn/${courseId}/lesson/${lesson.id}`)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginLeft: "20px",
                      whiteSpace: "nowrap"
                    }}>
                    View Lesson
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Lessons;
