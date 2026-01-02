import React, { useState } from "react";
import authApi from "../api/authApi";

const MediaUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("profile_picture", file);
    try {
      await authApi.uploadProfilePicture(formData);
      setSuccess("Upload successful.");
    } catch (err) {
      setError("Upload failed.");
    }
    setLoading(false);
  };

  return (
    <div className="media-upload-page">
      <h2>Upload Profile Picture</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default MediaUpload;
