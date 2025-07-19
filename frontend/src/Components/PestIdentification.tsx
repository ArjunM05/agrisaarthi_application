import React, { useState } from "react";
import axios from "axios";
import supabase from "../utils/supabase";
import ChatBot from "./ChatBot";

interface Supplier {
  supplier_id: number;
  supplier_name: string;
  shop_name: string;
  address: string;
  price: number;
  stock: number;
  pesticide: string;
}

const PestIdentification: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [pesticideNames, setPesticideNames] = useState<{
    [pestName: string]: string[];
  }>({});
  const [imageError, setImageError] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const fetchPesticidesForPest = async (
    pestName: string
  ): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from("pesticides")
        .select("pesticide")
        .eq("pest", pestName);

      if (error) {
        console.error("Error fetching pesticides:", error);
        return [];
      }

      return data?.map((item) => item.pesticide) || [];
    } catch (error) {
      console.error("Error fetching pesticides:", error);
      return [];
    }
  };

  const fetchSuppliersForPesticides = async (
    pesticides: string[]
  ): Promise<Supplier[]> => {
    const suppliers: Supplier[] = [];

    for (const pesticide of pesticides) {
      try {
        const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/supplier_details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pesticide_name: pesticide,
          }),
        });

        const data = await response.json();
        if (data.suppliers && data.suppliers.length > 0) {
          data.suppliers.forEach((supplier: any) => {
            // Only add suppliers with stock > 0
            if (supplier.stock > 0) {
              suppliers.push({
                supplier_id: supplier.supplier_id,
                supplier_name: supplier.supplier_name,
                shop_name: supplier.shop_name,
                address: supplier.address,
                price: supplier.price,
                stock: supplier.stock,
                pesticide: pesticide,
              });
            }
          });
        }
      } catch (error) {
        console.error(`Error fetching suppliers for ${pesticide}:`, error);
      }
    }

    return suppliers;
  };

  const handleCallSupplier = async (supplierId: number, pesticide: string) => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        alert("Please login to contact suppliers");
        return;
      }

      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/call_supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          farmer_id: user_id,
          pesticide: pesticide,
        }),
      });

      const data = await response.json();
      if (data.supplier_phone) {
        window.open(`tel:${data.supplier_phone}`, "_blank");
      } else {
        alert("Could not get supplier phone number");
      }
    } catch (error) {
      console.error("Error calling supplier:", error);
      alert("Error contacting supplier");
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image.");
    setLoading(true);
    setDetections([]);
    setSuppliers([]);
    setImageError("");

    try {
      // Predict pests from image
      const formData = new FormData();
      formData.append("file", image);
      const response = await axios.post("/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      const result = response.data.detections;
      if (!result || result.length === 0) {
        setDetections([]);
        setImageError("No pests detected.");
        setLoading(false);
        setLoadingSuppliers(false);
        return;
      }

      // Find the pest with the highest confidence
      const topDetection = result.reduce((max: any, det: any) =>
        det.confidence > max.confidence ? det : max
      );
      setDetections([topDetection]);

      // Upload image ONCE to Supabase
      const fileExt = image.name.split(".").pop();
      const fileName = `pest_${
        topDetection.class_name
      }_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("pest-images")
        .upload(filePath, image);
      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        setImageError("Image upload failed.");
        setLoading(false);
        setLoadingSuppliers(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("pest-images")
        .getPublicUrl(filePath);
      const imageUrl = publicUrlData.publicUrl;

      // Fetch pesticides for the top pest
      setLoadingSuppliers(true);
      const pesticides = await fetchPesticidesForPest(topDetection.class_name);
      const pesticideNamesMap: { [pestName: string]: string[] } = {
        [topDetection.class_name]: pesticides,
      };
      setPesticideNames(pesticideNamesMap);

      // Log detection and pesticides directly to Supabase (frontend only)
      const user_id = localStorage.getItem("user_id") || "";
      const pesticideString = pesticides.join(", ");
      await supabase.from("pest_inference_results").insert([
        {
          user_id: user_id,
          pest_name: topDetection.class_name,
          image_url: imageUrl,
          pesticide: pesticideString,
          confidence: topDetection.confidence,
        },
      ]);

      // Fetch suppliers for the recommended pesticides
      let suppliersData: Supplier[] = [];
      if (pesticides.length > 0) {
        suppliersData = await fetchSuppliersForPesticides(pesticides);
      }
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Prediction failed:", error);
      setImageError("Error while processing image.");
    } finally {
      setLoading(false);
      setLoadingSuppliers(false);
    }
  };

  return (
    <div className="container my-4">
      {imageError && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {imageError}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setImageError("")}
          ></button>
        </div>
      )}
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
                <strong>Recommended Pesticides:</strong>{" "}
                {pesticideNames[det.class_name]?.join(", ") ||
                  "No pesticides found"}
              </div>
            </div>
          ))}

          {loadingSuppliers ? (
            <div className="mt-3">
              <div className="text-center">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">
                  Finding suppliers for recommended pesticides...
                </p>
              </div>
            </div>
          ) : suppliers.length > 0 ? (
            <div className="mt-3">
              <h6>Suppliers with Recommended Pesticides:</h6>
              <div className="row">
                {suppliers.map((supplier, idx) => (
                  <div className="col-md-6 col-lg-4 mb-3" key={idx}>
                    <div className="card shadow-sm mb-3 h-100">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{supplier.shop_name}</h5>
                        <p className="card-text">
                          <strong>Supplier:</strong> {supplier.supplier_name}
                          <br />
                          <strong>Address:</strong>{" "}
                          {supplier.address || "Address not available"}
                          <br />
                          <strong>Pesticide:</strong> {supplier.pesticide}
                        </p>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <div>
                            <strong className="text-success">
                              ₹{supplier.price}/litre
                            </strong>
                            <br />
                            <small className="text-muted">
                              Stock: {supplier.stock} units
                            </small>
                          </div>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() =>
                              handleCallSupplier(
                                supplier.supplier_id,
                                supplier.pesticide
                              )
                            }
                          >
                            📞 Call Supplier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <div className="alert alert-info">
                No suppliers found for the recommended pesticides in your area.
              </div>
            </div>
          )}
        </div>
      )}
      <ChatBot />
    </div>
  );
};

export default PestIdentification;
