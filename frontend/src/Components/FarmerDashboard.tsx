// src/Components/FarmerDashboard.tsx
import { useEffect, useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import {
  FaCloudSun,
  FaThermometerHalf,
  FaWind,
  FaTint,
  FaPhone,
  FaCompass,
  FaSun,
  FaWater,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import pest1 from "../assets/pest1.jpg";
import pest2 from "../assets/pest2.jpg";
import pest3 from "../assets/pest3.jpg";
import pest4 from "../assets/pest4.jpg";

const FarmerDashboard = () => {
  const user_name = localStorage.getItem("user_name");
  const user_id = localStorage.getItem("user_id");
  const user_district = localStorage.getItem("user_district");
  const [weather, setWeather] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState<any>(null);
  const [schemes, setSchemes] = useState<string[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true&daily=precipitation_sum,windspeed_10m_max&timezone=auto"
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));

    // Fetch contacted suppliers
    if (user_id) {
      fetch(`http://localhost:5001/last_contacted_suppliers/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.contacts && data.contacts.length > 0) {
            setSuppliers(data.contacts);
          }
        })
        .catch((error) => {
          console.error("Error fetching suppliers:", error);
        });
    }

    // Fetch schemes for user's district
    if (user_district) {
      fetch(
        `http://localhost:5001/schemes/${encodeURIComponent(user_district)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.schemes) {
            // Parse schemes if it's a string, or use as is if it's already an array
            const schemesList =
              typeof data.schemes === "string"
                ? data.schemes
                    .split("\n")
                    .filter((scheme: string) => scheme.trim())
                : Array.isArray(data.schemes)
                ? data.schemes
                : [];
            setSchemes(schemesList);
          }
        })
        .catch((error) => {
          console.error("Error fetching schemes:", error);
          // Fallback to default schemes if API fails
          setSchemes([
            "Get 50% subsidy on organic pesticides.",
            "Register for PM-Kisan before 31st July.",
            "Apply for crop insurance scheme for better protection.",
          ]);
        })
        .finally(() => {
          setSchemesLoading(false);
        });
    } else {
      setSchemesLoading(false);
    }
  }, [user_id, user_district]);

  const recentPests = [
    { img: pest1, pest: "Flea Beetle", pesticide: "Imidacloprid" },
    { img: pest2, pest: "Aphid", pesticide: "Malathion" },
    { img: pest3, pest: "Leaf Miner", pesticide: "Spinosad" },
    { img: pest4, pest: "Whitefly", pesticide: "Thiamethoxam" },
  ];

  const toggleExpanded = () => setExpanded(!expanded);

  const handleSupplierClick = async (supplier: any) => {
    setSelectedSupplier(supplier);

    // Fetch supplier details
    try {
      const response = await fetch("http://localhost:5001/supplier_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pesticide_name: supplier.pesticide,
        }),
      });

      const data = await response.json();
      if (data.suppliers && data.suppliers.length > 0) {
        // Find the specific supplier
        const supplierDetail = data.suppliers.find(
          (s: any) => s.supplier_id === supplier.supplier_id
        );
        if (supplierDetail) {
          setSupplierDetails(supplierDetail);
        }
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
    }

    setShowModal(true);
  };

  const handleCallSupplier = async (supplierId: number) => {
    try {
      const response = await fetch("http://localhost:5001/call_supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplier_id: supplierId,
        }),
      });

      const data = await response.json();
      if (data.supplier_phone) {
        window.open(`tel:${data.supplier_phone}`, "_blank");
      }
    } catch (error) {
      console.error("Error getting supplier phone:", error);
    }
  };

  const handleViewHistory = () => {
    navigate("/farmer/supplier-history");
  };

  return (
    <>
      <h3 className="mb-4">Welcome, {user_name} 👋</h3>

      <div className="row mb-4">
        {expanded ? (
          <>
            <div className="col-12 mb-4">
              <Card
                className="p-3 shadow-sm"
                onClick={toggleExpanded}
                style={{ cursor: "pointer" }}
              >
                <Card.Title>
                  <FaCloudSun className="me-2" /> Current Weather
                </Card.Title>
                {weather ? (
                  <Card.Body>
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <FaThermometerHalf className="me-2" /> Temperature:{" "}
                          {weather.current_weather.temperature}°C
                        </p>
                        <p>
                          <FaWind className="me-2" /> Wind:{" "}
                          {weather.current_weather.windspeed} km/h
                        </p>
                        <p>
                          <FaTint className="me-2" /> Rain:{" "}
                          {weather.daily.precipitation_sum[0]} mm
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <FaCompass className="me-2" /> Wind Direction:{" "}
                          {weather.current_weather.temperature}°
                        </p>
                        <p>
                          <FaSun className="me-2" /> UV Index:{" "}
                          {weather.current_weather.windspeed}
                        </p>
                        <p>
                          <FaWater className="me-2" /> Evapotranspiration:{" "}
                          {weather.daily.precipitation_sum[0]} mm
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h6>3-Day Forecast</h6>
                      <div className="row">
                        {[0, 1, 2].map((i) => (
                          <div className="col-md-4" key={i}>
                            <div className="border rounded p-2 text-center shadow-sm">
                              <strong>Day {i + 1}</strong>
                              <p>Max: {weather.daily.precipitation_sum[0]}°C</p>
                              <p>Min: {weather.daily.precipitation_sum[0]}°C</p>
                              <p>
                                Rain: {weather.daily.precipitation_sum[0]} mm
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <small className="text-muted text-end d-block mt-3">
                      Click to Collapse ↑
                    </small>
                  </Card.Body>
                ) : (
                  <Card.Body>Loading weather...</Card.Body>
                )}
              </Card>
            </div>
            <div className="col-12">
              <Card className="p-3 shadow-sm">
                <Card.Title>Government Schemes</Card.Title>
                <Card.Body>
                  {schemesLoading ? (
                    <p>Loading schemes...</p>
                  ) : schemes.length > 0 ? (
                    <ul>
                      {schemes.map((scheme, index) => (
                        <li key={index}>{scheme}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">
                      No schemes available for your district.
                    </p>
                  )}
                </Card.Body>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-6">
              <Card
                className="p-3 shadow-sm h-100"
                onClick={toggleExpanded}
                style={{ cursor: "pointer" }}
              >
                <Card.Title>
                  <FaCloudSun className="me-2" /> Current Weather
                </Card.Title>
                {weather ? (
                  <Card.Body>
                    <p>
                      <FaThermometerHalf className="me-2" /> Temperature:{" "}
                      {weather.current_weather.temperature}°C
                    </p>
                    <p>
                      <FaWind className="me-2" /> Wind:{" "}
                      {weather.current_weather.windspeed} km/h
                    </p>
                    <p>
                      <FaTint className="me-2" /> Rain:{" "}
                      {weather.daily.precipitation_sum[0]} mm
                    </p>
                    <small className="text-muted text-end d-block">
                      Click to expand ↓
                    </small>
                  </Card.Body>
                ) : (
                  <Card.Body>Loading weather...</Card.Body>
                )}
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="p-3 shadow-sm h-100">
                <Card.Title>Government Schemes</Card.Title>
                <Card.Body>
                  {schemesLoading ? (
                    <p>Loading schemes...</p>
                  ) : schemes.length > 0 ? (
                    <ul>
                      {schemes.map((scheme, index) => (
                        <li key={index}>{scheme}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center">
                      No schemes available for your district.
                    </p>
                  )}
                </Card.Body>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Pest and Supplier History Side-by-Side */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Card className="p-3 shadow-sm">
            <Card.Title className="d-flex justify-content-between align-items-center">
              <span>Recent Pest Identifications</span>
              <a href="#" className="text-decoration-none small">
                View history →
              </a>
            </Card.Title>
            <Card.Body>
              <div className="row">
                {recentPests.map((item, i) => (
                  <div key={i} className="col-6 mb-3">
                    <div className="pest-hover-container">
                      <img
                        src={item.img}
                        alt={item.pest}
                        className="pest-hover-image"
                        style={{
                          maxWidth: "270px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="pest-hover-overlay">
                        <div>
                          <strong>Pest: {item.pest}</strong>
                          <br />
                          Pesticide: {item.pesticide}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="p-3 shadow-sm">
            <Card.Title className="d-flex justify-content-between align-items-center">
              <span>Suppliers Contacted Recently</span>
              <a
                href="#"
                className="text-decoration-none small"
                onClick={handleViewHistory}
              >
                View history →
              </a>
            </Card.Title>
            <Card.Body>
              {suppliers.length > 0 ? (
                <div
                  className="border rounded p-3 shadow-sm mb-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSupplierClick(suppliers[0])}
                >
                  <h5>{suppliers[0].supplier_name}</h5>
                  <p>Pesticide: {suppliers[0].pesticide}</p>
                  <p>Contact Time: {suppliers[0].contact_time}</p>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCallSupplier(suppliers[0].supplier_id);
                    }}
                  >
                    <FaPhone className="me-1" /> Call Supplier
                  </button>
                </div>
              ) : (
                <p className="text-center">No suppliers contacted recently</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Supplier Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Supplier Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSupplier && supplierDetails ? (
            <div>
              <h5>{selectedSupplier.supplier_name}</h5>
              <p>
                <strong>Pesticide:</strong> {selectedSupplier.pesticide}
              </p>
              <p>
                <strong>Price:</strong> ₹{supplierDetails.price}
              </p>
              <p>
                <strong>Stock:</strong> {supplierDetails.stock} units
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {supplierDetails.address || "Address not available"}
              </p>
              <p>
                <strong>Contact Time:</strong> {selectedSupplier.contact_time}
              </p>
            </div>
          ) : (
            <p>Loading supplier details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              if (selectedSupplier) {
                handleCallSupplier(selectedSupplier.supplier_id);
              }
              setShowModal(false);
            }}
          >
            <FaPhone className="me-1" /> Call Supplier
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FarmerDashboard;
