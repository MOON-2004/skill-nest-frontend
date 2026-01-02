import React, { useEffect, useState } from "react";
import courseApi from "../api/courseApi";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const data = await courseApi.getMyEnrollments();
        setEnrollments(data.results || data || []);
      } catch (err) {
        setError("Failed to load enrollments.");
      }
      setLoading(false);
    };
    fetchEnrollments();
  }, []);

  return (
    <div className="enrollments-page">
      <h2>My Enrollments</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : enrollments.length === 0 ? (
        <div>No enrollments found.</div>
      ) : (
        <ul>
          {enrollments.map((enrollment) => (
            <li key={enrollment.id}>
              <strong>{enrollment.course_title}</strong> - Progress: {enrollment.progress_percentage}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Enrollments;
