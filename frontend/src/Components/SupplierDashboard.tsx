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
  FaWater,
} from "react-icons/fa";
import ChatBot from "./ChatBot";

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
  const userName = localStorage.getItem("user_name");
  const userId = localStorage.getItem("user_id");
  const [showAlert, setShowAlert] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<SupplierDetails>({});

  useEffect(() => {
    // Use backend weather data instead of external API
    const userDistrict = "Delhi"; // Default location for supplier dashboard
    fetch(
      `http://localhost:5001/weather_data/${encodeURIComponent(userDistrict)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.weather_data) {
          setWeather(data.weather_data);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
      });

    // Fetch additional info from backend
    if (userId && userId !== "undefined" && userId !== "null") {
      fetch(`http://localhost:5001/user_info/${userId}`)
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
  }, [userId]);

  // Check for incomplete fields
  useEffect(() => {
    if (additionalInfo) {
      const hasEmpty = Object.values(additionalInfo).some((v) => !v);
      setShowAlert(hasEmpty);
    }
  }, [additionalInfo]);

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
                          {weather.current?.temp_c}°C
                        </p>
                        <p>
                          <FaWind className="me-2" /> Wind:{" "}
                          {weather.current?.wind_kph} km/h
                        </p>
                        <p>
                          <FaTint className="me-2" /> Humidity:{" "}
                          {weather.current?.humidity}%
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <FaCompass className="me-2" /> Wind Direction:{" "}
                          {weather.current?.wind_dir}
                        </p>
                        <p>
                          <FaSun className="me-2" /> UV Index:{" "}
                          {weather.current?.uv}
                        </p>
                        <p>
                          <FaWater className="me-2" /> Feels Like:{" "}
                          {weather.current?.feelslike_c}°C
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h6>3-Day Forecast</h6>
                      <div className="row">
                        {weather.forecast?.forecastday
                          ?.slice(0, 3)
                          .map((day: any, i: number) => (
                            <div className="col-md-4" key={i}>
                              <div className="border rounded p-2 text-center shadow-sm">
                                <strong>{day.date}</strong>
                                <p>Max: {day.day.maxtemp_c}°C</p>
                                <p>Min: {day.day.mintemp_c}°C</p>
                                <p>Rain: {day.day.totalprecip_mm} mm</p>
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
                      {weather.current?.temp_c}°C
                    </p>
                    <p>
                      <FaWind className="me-2" /> Wind:{" "}
                      {weather.current?.wind_kph} km/h
                    </p>
                    <p>
                      <FaTint className="me-2" /> Humidity:{" "}
                      {weather.current?.humidity}%
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
      <ChatBot />
    </>
  );
};

export default SupplierDashboard;
