// src/Components/FarmerDashboard.tsx
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
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

const SupplierDashboard = () => {
  const [weather, setWeather] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const userName = localStorage.getItem("user_name");

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true&daily=precipitation_sum,windspeed_10m_max&timezone=auto"
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <>
      <h3 className="mb-4">Welcome, {userName} 👋</h3>

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
      <ChatBot />
    </>
  );
};

export default SupplierDashboard;
