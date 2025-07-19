export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getLatLonFromDistrict(district: string) {
  // Still use OpenWeather geocoding for lat/lon
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    district
  )}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return { lat: data[0].lat, lon: data[0].lon };
  }
  throw new Error("Could not geocode district");
}

export async function getWeatherData(lat: number, lon: number) {
  // Use Open-Meteo API for current and daily forecast
  // Docs: https://open-meteo.com/en/docs
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,precipitation,relative_humidity_2m,uv_index,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max&forecast_days=3&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.current_weather || !Array.isArray(data.daily?.temperature_2m_max)) {
    console.error("Malformed weather data from Open-Meteo:", data);
    throw new Error("Malformed weather data from Open-Meteo");
  }

  // Current
  const current = data.current_weather;
  // Use first value from hourly arrays for rain, uv, wind direction
  const nowHourIdx = 0;
  const hourly = data.hourly || {};

  return {
    current: {
      temperature: current.temperature,
      wind_speed: current.windspeed,
      humidity: data.hourly.relative_humidity_2m?.[nowHourIdx] ?? null,
      wind_direction: current.winddirection,
      rain: hourly.precipitation ? hourly.precipitation[nowHourIdx] : 0,
      solar_irradiance: hourly.uv_index ? hourly.uv_index[nowHourIdx] : null,
    },
    forecast: [0, 1, 2].map((i) => ({
      date: data.daily.time ? data.daily.time[i] : "",
      temperature_max: data.daily.temperature_2m_max
        ? data.daily.temperature_2m_max[i]
        : null,
      temperature_min: data.daily.temperature_2m_min
        ? data.daily.temperature_2m_min[i]
        : null,
      rain: data.daily.precipitation_sum
        ? data.daily.precipitation_sum[i]
        : null,
      wind_speed: data.daily.wind_speed_10m_max
        ? data.daily.wind_speed_10m_max[i]
        : null,
      solar_irradiance: data.daily.uv_index_max
        ? data.daily.uv_index_max[i]
        : null,
    })),
  };
}

// Open-Meteo does not provide air quality in the free endpoint. You can use their air quality endpoint if needed.
export async function getAirQuality(lat: number, lon: number) {
  // Open-Meteo air quality endpoint: https://air-quality-api.open-meteo.com/v1/air-quality
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,uv_index&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();
  // Return the first hour's values for each pollutant
  return {
    pm10: data.hourly?.pm10?.[0],
    pm2_5: data.hourly?.pm2_5?.[0],
    carbon_monoxide: data.hourly?.carbon_monoxide?.[0],
    nitrogen_dioxide: data.hourly?.nitrogen_dioxide?.[0],
    ozone: data.hourly?.ozone?.[0],
    sulphur_dioxide: data.hourly?.sulphur_dioxide?.[0],
    uv_index: data.hourly?.uv_index?.[0],
  };
}
