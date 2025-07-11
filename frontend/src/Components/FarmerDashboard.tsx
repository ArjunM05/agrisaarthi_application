// src/Components/FarmerDashboard.tsx
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
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

import pest1 from "../assets/pest1.jpg";
import pest2 from "../assets/pest2.jpg";
import pest3 from "../assets/pest3.jpg";
import pest4 from "../assets/pest4.jpg";

const FarmerDashboard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true&daily=precipitation_sum,windspeed_10m_max&timezone=auto"
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  const recentPests = [
    { img: pest1, pest: "Flea Beetle", pesticide: "Imidacloprid" },
    { img: pest2, pest: "Aphid", pesticide: "Malathion" },
    { img: pest3, pest: "Leaf Miner", pesticide: "Spinosad" },
    { img: pest4, pest: "Whitefly", pesticide: "Thiamethoxam" },
  ];

  const dummySuppliers = [
    { name: "AgroMart", distance: "2.3 km", pesticide: "Imidacloprid" },
  ];

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <>
      <h3 className="mb-4">Welcome, Farmer 👋</h3>

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
              <a href="#" className="text-decoration-none small">
                View history →
              </a>
            </Card.Title>
            <Card.Body>
              {dummySuppliers.map((s, i) => (
                <div key={i} className="border rounded p-3 shadow-sm mb-3">
                  <h5>{s.name}</h5>
                  <p>Pesticide: {s.pesticide}</p>
                  <p>Distance: {s.distance}</p>
                  <button className="btn btn-success btn-sm">
                    <FaPhone className="me-1" /> Call Supplier
                  </button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FarmerDashboard;
