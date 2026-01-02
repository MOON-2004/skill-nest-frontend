import React, { useEffect, useState } from "react";
import notificationApi from "../api/notificationApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await notificationApi.getNotifications();
        setNotifications(data.results || data || []);
      } catch (err) {
        setError("Failed to load notifications.");
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  };

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <button onClick={markAllRead}>Mark All as Read</button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : notifications.length === 0 ? (
        <div>No notifications found.</div>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} style={{ fontWeight: notification.is_read ? "normal" : "bold" }}>
              {notification.title} - {notification.message}
              {!notification.is_read && (
                <button onClick={async () => {
                  await notificationApi.markRead(notification.id);
                  setNotifications((prev) => prev.map((n) => n.id === notification.id ? { ...n, is_read: true } : n));
                }}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
