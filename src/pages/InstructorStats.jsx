import React, { useEffect, useState } from "react";
import instructorApi from "../api/instructorApi";

const InstructorStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await instructorApi.getInstructorStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load instructor stats.");
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="instructor-stats-page">
      <h2>Instructor Statistics</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : stats ? (
        <ul>
          <li>Total Courses: {stats.total_courses}</li>
          <li>Total Enrolled Students: {stats.total_students}</li>
          <li>Revenue: ${stats.revenue}</li>
          <li>Average Rating: {stats.average_rating}</li>
        </ul>
      ) : (
        <div>No stats available.</div>
      )}
    </div>
  );
};

export default InstructorStats;
