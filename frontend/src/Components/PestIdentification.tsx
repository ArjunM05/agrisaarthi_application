import React, { useState } from "react";
import axios from "axios";
// import SupplierCard from "./SupplierCard"; // Optional: use if you want to reuse it

const PestIdentification: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");
    setLoading(true);
    setDetections([]);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      const result = response.data.detections;
      setDetections(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Error while processing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Upload Pest Image</h3>
      <div className="mb-3 col-md-4">
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImageChange}
          id="pestImage"
          name="pestImage"
          autoComplete="off"
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
        disabled={!image || loading}
      >
        {loading ? "Processing..." : "Upload & Identify"}
      </button>

      {detections.length > 0 && (
        <div className="mt-4">
          <h5>Detected Pests:</h5>
          {detections.map((det, idx) => (
            <div key={idx} className="mb-3">
              <div className="bg-dark text-white p-3 rounded">
                <strong>Pest:</strong> {det.class_name} <br />
                <strong>Confidence:</strong> {(det.confidence * 100).toFixed(2)}
                % <br />
                <strong>Pesticide Recommendations:</strong> {det.pesticide}
              </div>

              <div className="mt-3">
                <h6>Suppliers near you:</h6>
                <div className="row">
                  {[1, 2, 3].map((i) => (
                    <div className="col-md-4" key={i}>
                      <div className="card shadow-sm mb-3">
                        <div className="card-body">
                          <h5 className="card-title">Supplier {i}</h5>
                          <p className="card-text">
                            Price: ₹{100 + i * 50} <br />
                            Distance: {i * 2} km
                          </p>
                          <a
                            href="tel:+1234567890"
                            className="btn btn-outline-success btn-sm"
                          >
                            📞 Call Supplier
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PestIdentification;
