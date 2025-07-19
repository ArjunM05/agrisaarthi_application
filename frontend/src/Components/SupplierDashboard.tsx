// src/Components/FarmerDashboard.tsx
import { useEffect, useState } from "react";
import { Card, Alert } from "react-bootstrap";
import {
  FaCloudSun,
  FaThermometerHalf,
  FaWind,
  FaTint,
  FaCompass,
  FaSun,
} from "react-icons/fa";
import ChatBot from "./ChatBot";
import {
  getLatLonFromDistrict,
  getWeatherData,
  getAirQuality,
} from "../utils/weather";

type SupplierDetails = {
  shop_name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  approved?: boolean;
  service_areas?: string[];
};

const SupplierDashboard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const userName = localStorage.getItem("user_name");
  const userId = localStorage.getItem("user_id");
  const [showAlert, setShowAlert] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<SupplierDetails>({});

  useEffect(() => {
    // Weather: get location or geocode district
    async function fetchWeather() {
      let lat: number | undefined, lon: number | undefined;
      try {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              lat = pos.coords.latitude;
              lon = pos.coords.longitude;
              resolve();
            },
            async () => {
              try {
                const coords = await getLatLonFromDistrict(
                  localStorage.getItem("user_district") || "Delhi"
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
        lat = 28.6139;
        lon = 77.209;
      }
      if (typeof lat !== "number" || typeof lon !== "number") {
        lat = 28.6139;
        lon = 77.209;
      }
      const weatherData = await getWeatherData(Number(lat), Number(lon));
      const air = await getAirQuality(Number(lat), Number(lon));
      setWeather({ ...weatherData, air });
    }
    fetchWeather();

    // Fetch additional info from backend
    if (userId && userId !== "undefined" && userId !== "null") {
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/user_info/${userId}`)
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

    // Fetch all contacts for popularity stats
    if (userId) {
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/contacts_for_supplier/${userId}`)
        .then((res) => res.json())
        .then((data) => setContacts(data.contacts || []));
      // Fetch inventory
      fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/supplier_inventory/${userId}`)
        .then((res) => res.json())
        .then((data) => setInventory(data.inventory || []));
    }
  }, [userId]);

  // Check for incomplete fields
  useEffect(() => {
    if (additionalInfo) {
      const hasEmpty = Object.values(additionalInfo).some(
        (v) =>
          v === null ||
          v === undefined ||
          (typeof v === "string" && v.trim() === "")
      );
      setShowAlert(hasEmpty);
    }
  }, [additionalInfo]);

  // Find top 3 most popular pesticides from all contacts
  const pesticideCount: Record<string, number> = {};
  contacts.forEach((c) => {
    if (c.pesticide_name)
      pesticideCount[c.pesticide_name] =
        (pesticideCount[c.pesticide_name] || 0) + 1;
  });
  const sortedPopular = Object.entries(pesticideCount).sort(
    (a, b) => b[1] - a[1]
  );
  const topPopular = sortedPopular.slice(0, 5);

  // Find low stock pesticides, sort by stock ascending, show only 5
  const lowStock = inventory
    .filter((item) => item.stock !== undefined && item.stock < 10)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, 5);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <>
      <h3 className="mb-4">Welcome, {userName} 👋</h3>

      {showAlert && (
        <Alert
          variant="warning"
          className="mb-4"
          style={{ zIndex: 9999 }}
          // dismissible
          // onClose={() => setShowAlert(false)}
        >
          Please complete your additional information to get the best
          recommendations. Go to <a href="/supplier/profile">Profile.</a>
        </Alert>
      )}

      {/* Weather and Schemes at the top */}
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
                  <ul>
                    <li>Get 50% subsidy on organic pesticides.</li>
                    <li>Register for PM-Kisan before 31st July.</li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-6 mb-3">
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
            <div className="col-md-6 mb-3">
              <Card className="p-3 shadow-sm h-100">
                <Card.Title>Government Schemes</Card.Title>
                <Card.Body>
                  <ul>
                    <li>Get 50% subsidy on organic pesticides.</li>
                    <li>Register for PM-Kisan before 31st July.</li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Popular and Low Stock cards side by side */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <Card className="p-3 shadow-sm h-100">
            <Card.Title>Most Popular Pesticides</Card.Title>
            <Card.Body>
              {topPopular.length > 0 ? (
                <ol className="mb-0">
                  {topPopular.map(([name, count], idx) => (
                    <li key={idx} className="mb-1">
                      <span className="fw-bold">{name}</span> — Contacted{" "}
                      {count} time(s)
                    </li>
                  ))}
                </ol>
              ) : (
                <div>No data</div>
              )}
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6 mb-3">
          <Card className="p-3 shadow-sm h-100">
            <Card.Title>Pesticides in Low Stock</Card.Title>
            <Card.Body>
              {lowStock.length === 0 ? (
                <div>All pesticides are sufficiently stocked.</div>
              ) : (
                <ul className="mb-0">
                  {lowStock.map((item, i) => (
                    <li key={i} className="mb-2">
                      {item.pesticide} -{" "}
                      <span className="text-danger fw-bold">
                        {item.stock} units left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      <ChatBot />
    </>
  );
};

export default SupplierDashboard;
