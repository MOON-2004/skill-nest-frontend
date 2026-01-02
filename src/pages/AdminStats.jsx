import React, { useEffect, useState } from "react";
import instructorApi from "../api/instructorApi";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await instructorApi.getAdminStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load admin stats.");
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-stats-page">
      <h2>Admin Statistics</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : stats ? (
        <ul>
          <li>Total Users: {stats.total_users}</li>
          <li>Active Users: {stats.active_users}</li>
          <li>Verified Users: {stats.verified_users}</li>
          <li>Users by Role: {JSON.stringify(stats.users_by_role)}</li>
        </ul>
      ) : (
        <div>No stats available.</div>
      )}
    </div>
  );
};

export default AdminStats;
