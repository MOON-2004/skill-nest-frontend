import React, { useEffect, useState } from "react";
import learningApi from "../api/learningApi";

const Quizzes = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const data = await learningApi.getCourseQuizzes(courseId);
        setQuizzes(data.results || data || []);
      } catch (err) {
        setError("Failed to load quizzes.");
      }
      setLoading(false);
    };
    if (courseId) fetchQuizzes();
  }, [courseId]);

  return (
    <div className="quizzes-page">
      <h2>Course Quizzes</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : quizzes.length === 0 ? (
        <div>No quizzes found.</div>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <strong>{quiz.title}</strong> - Attempts: {quiz.max_attempts || "Unlimited"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Quizzes;
