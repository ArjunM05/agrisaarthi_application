import React, { useState } from "react";

const ContactPageContent: React.FC = () => {
  // Feedback state
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [contactSuccess, setContactSuccess] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [contactError, setContactError] = useState("");

  // Contact form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackSubmit = async () => {
    const user_id = localStorage.getItem("user_id");
    setFeedbackSuccess("");
    setFeedbackError("");
    if (!user_id || rating === 0) {
      setFeedbackError("Please select a rating.");
      return;
    }
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, rating, comments: comment }),
      });
      if (response.ok) {
        setFeedbackSuccess("Feedback submitted. Thank you!");
        setRating(0);
        setComment("");
      } else {
        setFeedbackError("Failed to submit feedback. Please try again.");
      }
    } catch {
      setFeedbackError("Failed to submit feedback. Please try again.");
    }
  };

  const handleContactSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      setContactError("Please fill in both fields.");
      return;
    }
    setContactSuccess("");
    setContactError("");
    // Get user info from localStorage
    const user_name = localStorage.getItem("user_name") || "Unknown User";
    const user_email = localStorage.getItem("user_email") || "Unknown Email";
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          user_name,
          user_email,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setContactSuccess("Message submitted.");
        setTitle("");
        setMessage("");
      } else {
        setContactError(data.error || "Failed to send message.");
      }
    } catch (error) {
      setContactError("Failed to send message. Please try again.");
    }
  };

  const team = [
    {
      name: "Sushmetha S R",
      email: "sush7niaa@gmail.com",
      linkedin: "https://www.linkedin.com/in/sushmetha-sr/",
    },
    {
      name: "Abhinav Chaitanya R",
      email: "abhinavchaitanya6@gmail.com",
      linkedin: "https://www.linkedin.com/in/abhinav-chaitanya-r-799397286/",
    },
    {
      name: "Arjun M",
      email: "arjunm.0510@gmail.com",
      linkedin: "www.linkedin.com/in/arjun-m-803677250",
    },
    {
      name: "Kiranchandran H",
      email: "kiranchandranh@gmail.com",
      linkedin: "https://www.linkedin.com/in/kiranchandran-h-b701aa251/",
    },
    {
      name: "Harshavardhan S",
      email: "harsak7@gmail.com",
      linkedin: "https://www.linkedin.com/in/harshavardhan-s-b14220221/",
    },
  ];

  return (
    <div className="container mt-0">
      <div className="row g-4">
        {/* Feedback Form */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4 h-100">
            <h4 className="mb-2">Feedback</h4>
            <div className="mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: "2rem",
                    cursor: "pointer",
                    color: rating >= star ? "gold" : "lightgray",
                  }}
                  onClick={() => setRating(rating === star ? 0 : star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="form-control mb-3"
              placeholder="Any comments? (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            ></textarea>
            {feedbackSuccess && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {feedbackSuccess}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setFeedbackSuccess("")}
                ></button>
              </div>
            )}
            {feedbackError && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {feedbackError}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setFeedbackError("")}
                ></button>
              </div>
            )}
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success w-100"
                style={{ maxWidth: 220 }}
                onClick={handleFeedbackSubmit}
                disabled={rating === 0}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4 h-100">
            <h4 className="mb-3">Contact Us</h4>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Message Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-3"
              placeholder="Your Message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            {contactSuccess && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {contactSuccess}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setContactSuccess("")}
                ></button>
              </div>
            )}
            {contactError && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {contactError}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setContactError("")}
                ></button>
              </div>
            )}
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success w-100"
                style={{ maxWidth: 220 }}
                onClick={handleContactSubmit}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <h4 className="mb-4">Meet the Team</h4>
            <div className="row mb-3">
              <div
                className="col-md-6 offset-md-3 text-center border p-3 rounded"
                style={{ cursor: "pointer" }}
                onClick={() => window.open(team[0].linkedin, "_blank")}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <h5>{team[0].name}</h5>
                <p className="mb-0">{team[0].email}</p>
              </div>
            </div>
            <div className="row mb-3">
              {team.slice(1, 3).map((member, idx) => (
                <div
                  className="col-md-6 text-center border p-3 rounded"
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => window.open(member.linkedin, "_blank")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <h5>{member.name}</h5>
                  <p className="mb-0">{member.email}</p>
                </div>
              ))}
            </div>
            <div className="row">
              {team.slice(3).map((member, idx) => (
                <div
                  className="col-md-6 text-center border p-3 rounded"
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => window.open(member.linkedin, "_blank")}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9fa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <h5>{member.name}</h5>
                  <p className="mb-0">{member.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPageContent;
