import React, { useState } from "react";
import authApi from "../api/authApi";

const ChangePassword = () => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (form.new_password !== form.new_password_confirm) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      await authApi.changePassword(form);
      setSuccess("Password changed successfully.");
      setForm({ old_password: "", new_password: "", new_password_confirm: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Change failed.");
    }
    setLoading(false);
  };

  return (
    <div className="change-password-page">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="old_password"
          value={form.old_password}
          onChange={handleChange}
          placeholder="Current Password"
        />
        <input
          type="password"
          name="new_password"
          value={form.new_password}
          onChange={handleChange}
          placeholder="New Password"
        />
        <input
          type="password"
          name="new_password_confirm"
          value={form.new_password_confirm}
          onChange={handleChange}
          placeholder="Confirm New Password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default ChangePassword;
