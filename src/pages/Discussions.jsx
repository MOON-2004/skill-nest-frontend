import React, { useEffect, useState } from "react";
import courseApi from "../api/courseApi";

const Discussions = ({ courseId }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const data = await courseApi.getCourseDiscussions(courseId);
        setThreads(data.results || data || []);
      } catch (err) {
        setError("Failed to load discussions.");
      }
      setLoading(false);
    };
    if (courseId) fetchThreads();
  }, [courseId]);

  return (
    <div className="discussions-page">
      <h2>Course Discussions</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : threads.length === 0 ? (
        <div>No discussion threads found.</div>
      ) : (
        <ul>
          {threads.map((thread) => (
            <li key={thread.id}>
              <strong>{thread.title}</strong> - {thread.is_resolved ? "Resolved" : "Open"}
              <p>{thread.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Discussions;
