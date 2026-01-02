import React, { useEffect, useState } from "react";
import courseApi from "../api/courseApi";

const Reviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await courseApi.getCourseReviews(courseId);
        setReviews(data.results || data || []);
      } catch (err) {
        setError("Failed to load reviews.");
      }
      setLoading(false);
    };
    if (courseId) fetchReviews();
  }, [courseId]);

  return (
    <div className="reviews-page">
      <h2>Course Reviews</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : reviews.length === 0 ? (
        <div>No reviews found.</div>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>{review.title}</strong> - {review.rating}/5
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;
