import React, { useState } from "react";

const PestIdentification = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!image) return alert("Please select an image.");
    // Implement API upload logic here
    setResponse(
      "This leaf shows signs of fungal infection. Recommend treatment with a fungicide."
    );
    setRecommendations(
      "Use Mancozeb or Carbendazim. Apply twice a week until symptoms subside."
    );
  };

  return (
    <div className="container my-4">
      <h4 className="mb-3">Upload Image</h4>
      <div className="mb-3 col-3">
        <input
          className="form-control"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {previewUrl && (
        <div className="mb-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="img-thumbnail"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}

      <button
        className="btn btn-success rounded-pill"
        onClick={handleUpload}
        disabled={!image}
      >
        Upload
      </button>
      <div className="mb-3">
        <span className="badge bg-secondary mb-1">RESPONSE:</span>
        <div className="bg-dark text-white p-3 rounded">
          <p className="mb-0">{response || "No response yet."}</p>
        </div>
      </div>

      <div>
        <span className="badge bg-secondary mb-1">
          PESTICIDE RECOMMENDATIONS:
        </span>
        <div className="bg-dark text-white p-3 rounded">
          <p className="mb-0">{recommendations || "No recommendations yet."}</p>
        </div>
      </div>
    </div>
  );
};

export default PestIdentification;
