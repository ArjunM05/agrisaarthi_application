// src/Components/FarmerDashboard.tsx
import { useEffect, useState } from "react";
import { Card, Modal, Button, Alert } from "react-bootstrap";
import {
  FaCloudSun,
  FaThermometerHalf,
  FaWind,
  FaTint,
  FaCompass,
  FaSun,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ChatBot from "./ChatBot";

import {
  getLatLonFromDistrict,
  getWeatherData,
  getAirQuality,
} from "../utils/weather";

type FarmerDetails = {
  farm_size?: number;
  main_crop?: string;
  irrigation_type?: string;
};

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
  const [showAlert, setShowAlert] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<FarmerDetails>({});
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const navigate = useNavigate();
  const [pestHistory, setPestHistory] = useState<any[]>([]);
  const [showPestModal, setShowPestModal] = useState(false);
  const [selectedPest, setSelectedPest] = useState<any>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchWeather() {
      let lat: number | undefined, lon: number | undefined;
      // Try geolocation
      try {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              lat = pos.coords.latitude;
              lon = pos.coords.longitude;
              resolve();
            },
            async () => {
              // If denied, fallback to district geocoding
              try {
                const coords = await getLatLonFromDistrict(
                  user_district || "Chennai"
                );
                lat = coords.lat;
                lon = coords.lon;
                resolve();
              } catch {
                reject();
              }
            }
          );
        });
      } catch {
        // fallback: Delhi
        lat = 28.6139;
        lon = 77.209;
      }

      // Ensure lat/lon are defined
      if (typeof lat !== "number" || typeof lon !== "number") {
        lat = 28.6139;
        lon = 77.209;
      }

      // Fetch weather and air quality
      const weather = await getWeatherData(Number(lat), Number(lon));
      const air = await getAirQuality(Number(lat), Number(lon));
      setWeather({ ...weather, air });
    }

    fetchWeather();

    // Fetch contacted suppliers
    if (user_id) {
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/last_contacted_suppliers/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.contacts && data.contacts.length > 0) {
            setSuppliers(data.contacts);
          }
        })
        .catch((error) => {
          console.error("Error fetching suppliers:", error);
        })
        .finally(() => {
          setLoadingSuppliers(false);
        });
    } else {
      setLoadingSuppliers(false);
    }

    // Fetch schemes for user's district
    if (user_district) {
      fetch(
        `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/schemes/${encodeURIComponent(user_district)}`
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

    // Fetch additional info from backend
    if (user_id && user_id !== "undefined" && user_id !== "null") {
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/user_info/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.details) {
            setAdditionalInfo(data.details);
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }

    // Fetch latest pest images for this user
    if (user_id && user_id !== "undefined" && user_id !== "null") {
      fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/last_pest_images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.images) {
            // setRecentPestImages(data.images); // This state is no longer used for recent images
          }
        })
        .catch((error) => {
          console.error("Error fetching recent pest images:", error);
        });
    }

    // Fetch pest history for this user
    if (user_id && user_id !== "undefined" && user_id !== "null") {
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/pest_history/${user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.history) {
            setPestHistory(data.history);
          }
        })
        .catch((error) => {
          console.error("Error fetching pest history:", error);
        });
    }
  }, [user_id, user_district]);

  // useEffect(() => {
  //   const timer = setTimeout(() => setLoadingSuppliers(false), 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  // Check for incomplete fields
  useEffect(() => {
    const hasEmpty = Object.values(additionalInfo).some(
      (v) =>
        v === null ||
        v === undefined ||
        // (typeof v === "boolean" && v === false) ||
        (typeof v === "string" && v.trim() === "")
    );
    setShowAlert(hasEmpty);
  }, [additionalInfo]);

  const toggleExpanded = () => setExpanded(!expanded);

  const handleSupplierClick = async (supplier: any) => {
    setSelectedSupplier(supplier);

    // Fetch supplier details
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/supplier_details", {
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
  const handleViewHistory = () => {
    navigate("/farmer/supplier-history");
  };

  const handlePestImageClick = (pestItem: any) => {
    setSelectedPest(pestItem);
    // Find all suppliers matching any pesticide in pestItem.pesticide (comma separated)
    const pesticides = (pestItem.pesticide || "")
      .split(",")
      .map((p: string) => p.trim());
    const matchingSuppliers = suppliers.filter((s) =>
      pesticides.includes(s.pesticide)
    );
    setSelectedSuppliers(matchingSuppliers);
    setShowPestModal(true);
  };
  const handleViewPestHistory = () => {
    navigate("/farmer/pest-history");
  };

  return (
    <>
      <h3 className="mb-4">Welcome, {user_name} 👋</h3>

      {showAlert && (
        <Alert
          variant="warning"
          className="mb-4"
          style={{ zIndex: 9999 }}
          // dismissible
          // onClose={() => setShowAlert(false)}
        >
          Please complete your additional information to get the best
          recommendations. Go to <a href="/farmer/profile">Profile.</a>
        </Alert>
      )}

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
                          {weather.current?.temperature}°C
                        </p>
                        <p>
                          <FaWind className="me-2" /> Wind:{" "}
                          {weather.current?.wind_speed} km/h
                        </p>
                        <p>
                          <FaTint className="me-2" /> Rain:{" "}
                          {weather.current?.rain} mm
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <FaCompass className="me-2" /> Wind Direction:{" "}
                          {weather.current?.wind_direction}°
                        </p>
                        <p>
                          <FaSun className="me-2" /> UV Index:{" "}
                          {weather.current?.solar_irradiance}
                        </p>
                        <p>
                          <FaTint className="me-2" /> Humidity:{" "}
                          {weather.current?.humidity}%
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h6>3-Day Forecast</h6>
                      <div className="row">
                        {weather.forecast?.map((day: any, i: number) => (
                          <div className="col-md-4" key={i}>
                            <div className="border rounded p-2 text-center shadow-sm">
                              <div
                                style={{
                                  color: "white",
                                  background: "#007e33",
                                  borderRadius: "4px",
                                  padding: "4px 0",
                                  marginBottom: 8,
                                }}
                              >
                                <strong>
                                  {(() => {
                                    const d = new Date(day.date);
                                    return d.toLocaleDateString("en-GB");
                                  })()}
                                </strong>
                              </div>
                              <p>
                                <FaThermometerHalf className="me-2" />
                                Temperature: {day.temperature_max}°C
                              </p>
                              <p>
                                <FaTint className="me-2" />
                                Rain: {day.rain || 0} mm
                              </p>
                              <p>
                                <FaWind className="me-2" />
                                Wind: {day.wind_speed} km/h
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
                  <Card.Body>
                    <div className="text-center text-muted">
                      Loading weather...
                    </div>
                  </Card.Body>
                )}
              </Card>
            </div>
            <div className="col-12">
              <Card className="p-3 shadow-sm">
                <Card.Title>Government Schemes</Card.Title>
                <Card.Body>
                  {schemesLoading ? (
                    <div className="text-center text-muted">
                      Loading schemes...
                    </div>
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
                      {weather.current?.temperature}°C
                    </p>
                    <p>
                      <FaWind className="me-2" /> Wind:{" "}
                      {weather.current?.wind_speed} km/h
                    </p>
                    <p>
                      <FaTint className="me-2" /> Rain: {weather.current?.rain}{" "}
                      mm
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
      <div className="row mb-4 align-items-stretch">
        <div className="col-md-6 h-100 d-flex flex-column">
          <Card className="p-3 shadow-sm h-100 d-flex flex-column">
            <Card.Title className="d-flex justify-content-between align-items-center">
              <span>Recent Pest Identifications</span>
              <a
                href="#"
                className="text-decoration-none small"
                onClick={(e) => {
                  e.preventDefault();
                  handleViewPestHistory();
                }}
              >
                View history →
              </a>
            </Card.Title>
            <Card.Body className="flex-grow-1 d-flex flex-column justify-content-center align-items-stretch mt-3">
              {(() => {
                let imagesToShow = [];
                if (pestHistory.length >= 4) {
                  imagesToShow = pestHistory.slice(0, 4);
                } else if (
                  pestHistory.length === 3 ||
                  pestHistory.length === 2
                ) {
                  imagesToShow = pestHistory.slice(0, 2);
                } else if (pestHistory.length === 1) {
                  imagesToShow = pestHistory.slice(0, 1);
                }
                if (imagesToShow.length === 1) {
                  // Single image, fill card
                  const item = imagesToShow[0];
                  return (
                    <div
                      className="w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ minHeight: "180px", height: "100%" }}
                    >
                      <div
                        className="position-relative w-100 h-100 border rounded shadow-sm"
                        style={{
                          cursor: "pointer",
                          overflow: "hidden",
                          height: "180px",
                          maxWidth: "100%",
                        }}
                        onClick={() => handlePestImageClick(item)}
                      >
                        <img
                          src={item.img_url}
                          alt={`Pest 1`}
                          style={{
                            width: "100%",
                            maxHeight: "180px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            background: "#f8f9fa",
                          }}
                        />
                        <div
                          className="position-absolute bottom-0 start-0 w-100 text-white bg-dark bg-opacity-50 px-2 py-1 text-center"
                          style={{
                            fontSize: "1em",
                            borderBottomLeftRadius: "6px",
                            borderBottomRightRadius: "6px",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.pest_name &&
                            item.pest_name.charAt(0).toUpperCase() +
                              item.pest_name.slice(1)}
                        </div>
                      </div>
                    </div>
                  );
                } else if (imagesToShow.length === 2) {
                  // Two images, split vertically
                  return (
                    <div
                      className="d-flex flex-column h-100"
                      style={{ minHeight: "180px" }}
                    >
                      {imagesToShow.map((item, i) => (
                        <div
                          key={i}
                          className="flex-fill position-relative border rounded shadow-sm mb-2"
                          style={{
                            cursor: "pointer",
                            overflow: "hidden",
                            height: "85px",
                            maxWidth: "100%",
                          }}
                          onClick={() => handlePestImageClick(item)}
                        >
                          <img
                            src={item.img_url}
                            alt={`Pest ${i + 1}`}
                            style={{
                              width: "100%",
                              maxHeight: "180px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              background: "#f8f9fa",
                            }}
                          />
                          <div
                            className="position-absolute bottom-0 start-0 w-100 text-white bg-dark bg-opacity-50 px-2 py-1 text-center"
                            style={{
                              fontSize: "0.95em",
                              borderBottomLeftRadius: "6px",
                              borderBottomRightRadius: "6px",
                              textTransform: "capitalize",
                            }}
                          >
                            {item.pest_name &&
                              item.pest_name.charAt(0).toUpperCase() +
                                item.pest_name.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else if (imagesToShow.length === 4) {
                  // 2x2 grid
                  return (
                    <div
                      className="d-flex flex-column h-100 w-100"
                      style={{ minHeight: "180px", height: "100%" }}
                    >
                      <div
                        className="d-flex flex-row flex-fill w-100"
                        style={{ height: "50%" }}
                      >
                        {[0, 1].map((col) => {
                          const item = imagesToShow[col];
                          return (
                            <div
                              key={col}
                              className="flex-fill position-relative border rounded shadow-sm mx-1 mb-4"
                              style={{
                                cursor: "pointer",
                                overflow: "hidden",
                                width: "50%",
                                height: "100%",
                              }}
                              onClick={() => handlePestImageClick(item)}
                            >
                              <img
                                src={item.img_url}
                                alt={`Pest ${col + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  maxHeight: "90px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  background: "#f8f9fa",
                                }}
                              />
                              <div
                                className="position-absolute bottom-0 start-0 w-100 text-white bg-dark bg-opacity-50 px-2 py-1 text-center"
                                style={{
                                  fontSize: "0.95em",
                                  borderBottomLeftRadius: "6px",
                                  borderBottomRightRadius: "6px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {item.pest_name &&
                                  item.pest_name.charAt(0).toUpperCase() +
                                    item.pest_name.slice(1)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div
                        className="d-flex flex-row flex-fill w-100"
                        style={{ height: "50%" }}
                      >
                        {[2, 3].map((col) => {
                          const item = imagesToShow[col];
                          return (
                            <div
                              key={col}
                              className="flex-fill position-relative border rounded shadow-sm mx-1"
                              style={{
                                cursor: "pointer",
                                overflow: "hidden",
                                width: "50%",
                                height: "100%",
                              }}
                              onClick={() => handlePestImageClick(item)}
                            >
                              <img
                                src={item.img_url}
                                alt={`Pest ${col + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  maxHeight: "90px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  background: "#f8f9fa",
                                }}
                              />
                              <div
                                className="position-absolute bottom-0 start-0 w-100 text-white bg-dark bg-opacity-50 px-2 py-1 text-center"
                                style={{
                                  fontSize: "0.95em",
                                  borderBottomLeftRadius: "6px",
                                  borderBottomRightRadius: "6px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {item.pest_name &&
                                  item.pest_name.charAt(0).toUpperCase() +
                                    item.pest_name.slice(1)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                } else if (imagesToShow.length > 0) {
                  // fallback: just show in a row
                  return (
                    <div className="d-flex h-100 align-items-center">
                      {imagesToShow.map((item, i) => (
                        <div
                          key={i}
                          className="position-relative border rounded shadow-sm mx-1"
                          style={{
                            cursor: "pointer",
                            overflow: "hidden",
                            height: "100px",
                            maxWidth: "100%",
                          }}
                          onClick={() => handlePestImageClick(item)}
                        >
                          <img
                            src={item.img_url}
                            alt={`Pest ${i + 1}`}
                            style={{
                              width: "100%",
                              maxHeight: "180px",
                              objectFit: "cover",
                              borderRadius: "6px",
                              background: "#f8f9fa",
                            }}
                          />
                          <div
                            className="position-absolute bottom-0 start-0 w-100 text-white bg-dark bg-opacity-50 px-2 py-1 text-center"
                            style={{
                              fontSize: "0.95em",
                              borderBottomLeftRadius: "6px",
                              borderBottomRightRadius: "6px",
                              textTransform: "capitalize",
                            }}
                          >
                            {item.pest_name &&
                              item.pest_name.charAt(0).toUpperCase() +
                                item.pest_name.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="text-muted">
                      No recent pest images found.
                    </div>
                  );
                }
              })()}
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6 h-100 d-flex flex-column">
          <Card className="p-3 shadow-sm h-100 d-flex flex-column">
            <Card.Title className="d-flex justify-content-between align-items-center">
              <span>Suppliers Contacted Recently</span>
              <a
                href="#"
                className="text-decoration-none small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent clicks
                  handleViewHistory();
                }}
              >
                View history →
              </a>
            </Card.Title>
            <Card.Body className="flex-grow-1 d-flex flex-column justify-content-center align-items-stretch">
              {loadingSuppliers ? (
                <div className="text-center text-muted">Loading history...</div>
              ) : suppliers.length > 0 ? (
                <div
                  className="border rounded p-3 shadow-sm mb-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSupplierClick(suppliers[0])}
                >
                  <h5>{suppliers[0].shop_name}</h5>
                  <p>Pesticide: {suppliers[0].pesticide}</p>
                  <p>
                    Contacted On:{" "}
                    {suppliers[0].contact_time.slice(8, 10) +
                      suppliers[0].contact_time[7] +
                      suppliers[0].contact_time.slice(5, 7) +
                      suppliers[0].contact_time[4] +
                      suppliers[0].contact_time.slice(0, 4)}
                  </p>
                  <button
                    className="btn btn-outline-success fw-medium btn-sm mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCallSupplier(
                        suppliers[0].supplier_id,
                        suppliers[0].pesticide
                      );
                    }}
                  >
                    📞 Call Supplier
                  </button>
                  <small className="text-muted text-end d-block mt-1">
                    Click for detailed view
                  </small>
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
              <h5>{selectedSupplier.shop_name}</h5>
              <p>
                <strong>Supplier:</strong> {selectedSupplier.supplier_name}
              </p>
              <p>
                <strong>Pesticide:</strong> {selectedSupplier.pesticide}
              </p>
              <p>
                <strong>Price:</strong> ₹{supplierDetails.price}/litre
              </p>
              <p>
                <strong>Stock:</strong> {supplierDetails.stock} units
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {supplierDetails.address || "Address not available"}
              </p>
              <p>
                <strong>Contacted On:</strong>{" "}
                {suppliers[0].contact_time.slice(8, 10) +
                  suppliers[0].contact_time[7] +
                  suppliers[0].contact_time.slice(5, 7) +
                  suppliers[0].contact_time[4] +
                  suppliers[0].contact_time.slice(0, 4)}
              </p>
            </div>
          ) : (
            <p>Loading supplier details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          <Button
            variant="btn btn-success"
            onClick={() => {
              if (selectedSupplier) {
                handleCallSupplier(
                  selectedSupplier.supplier_id,
                  selectedSupplier.pesticide
                );
              }
              setShowModal(false);
            }}
          >
            📞 Call Supplier
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pest Details Modal */}
      <Modal show={showPestModal} onHide={() => setShowPestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pest Identification Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPest && (
            <>
              <h4 className="mb-3">
                Pest:{" "}
                {selectedPest.pest_name &&
                  selectedPest.pest_name.charAt(0).toUpperCase() +
                    selectedPest.pest_name.slice(1)}
              </h4>
              <h5 className="mb-4">
                Pesticide(s): {selectedPest.pesticide || "-"}
              </h5>
              <p className="mb-3">
                <b>Suppliers Contacted for these Pesticides:</b>
              </p>
              {selectedSuppliers.length > 0 ? (
                selectedSuppliers.map((supplier, idx) => (
                  <div className="card p-3 mb-3" key={idx}>
                    <h6 className="mb-2">
                      <strong>{supplier.pesticide}</strong>
                    </h6>
                    <p>
                      <strong>Shop Name:</strong> {supplier.shop_name}
                      <br />
                      <strong>Supplier Name:</strong> {supplier.supplier_name}
                      <br />
                      <strong>Contacted On:</strong>{" "}
                      {supplier.contact_time?.slice(0, 10)}
                    </p>
                    <button
                      className="btn btn-outline-success fw-medium"
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
                ))
              ) : (
                <p>
                  You have not contacted any suppliers related to these
                  pesticides.
                </p>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ChatBot Component */}
      <ChatBot />
    </>
  );
};

export default FarmerDashboard;
