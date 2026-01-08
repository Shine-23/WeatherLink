import { useEffect, useMemo, useState } from "react";

import WeatherCard from "../components/WeatherCard";
import ChatRoom from "../components/ChatRoom";
import Navbar from "../components/NavBar";

import { fetchWeather } from "../api/weather";
import { authStorage } from "../utils/storage";
import { useSocket } from "../hooks/useSocket";

import "../App.css";

const normalizeCity = (c) => (c || "").trim().toLowerCase();

const Dashboard = () => {
  const socketRef = useSocket();
  const socket = socketRef.current;

  const username = useMemo(() => localStorage.getItem("username"), []);

  const [cityInput, setCityInput] = useState("");
  const [activeCity, setActiveCity] = useState(() => {
    return localStorage.getItem("lastCity") || "";
  });

  const [weather, setWeather] = useState(() => {
    const saved = localStorage.getItem("weather");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) handleSearch(lastCity);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handler = (payload) => {
      const payloadCity = normalizeCity(payload?.city);
      if (!payloadCity || payloadCity !== normalizeCity(activeCity)) return;

      const nextWeather = payload.weather || payload; // supports both shapes
      setWeather(nextWeather);
      localStorage.setItem("weather", JSON.stringify(nextWeather));
    };

    socket.on("weather-update", handler);
    return () => socket.off("weather-update", handler);
  }, [socket, activeCity]);

  useEffect(() => {
    if (!socket) return;
    if (!activeCity) return;

    socket.emit("joinRoom", normalizeCity(activeCity));
  }, [socket, activeCity]);

  const handleLogout = () => {
    authStorage.clear();
    window.location.href = "/login";
  };

  const handleSearch = async (overrideCity) => {
    const queryCity = overrideCity || cityInput;
    const cityKey = normalizeCity(queryCity);
    if (!cityKey) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchWeather(cityKey);

      const normalized = normalizeCity(data.city || cityKey);
      setActiveCity(normalized);
      localStorage.setItem("lastCity", normalized);

      setWeather(data);
      localStorage.setItem("weather", JSON.stringify(data));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "City not found or error fetching data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar username={username?.toUpperCase()} onLogout={handleLogout} />

      <div className="dashboard container mt-4">
        <h1 className="mb-4 text-center">Welcome to WeatherLink</h1>

        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 d-flex flex-column align-items-center">
            <div className="search-box d-flex gap-2 mb-4 w-100 justify-content-center">
              <input
                type="text"
                className="form-control"
                value={cityInput}
                placeholder="Enter city name..."
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                className="btn btn-primary"
                onClick={() => handleSearch()}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {error && <p className="text-center text-danger">{error}</p>}

            <div className="d-flex justify-content-center align-items-center flex-grow-1 w-100">
              <WeatherCard city={activeCity} weather={weather} />
            </div>
          </div>

          <div className="right-side col-lg-6 col-md-12 mb-4 d-flex flex-column align-items-center">
            <h1 className="chat-title mb-3 text-center w-100">
              City Chat Room
            </h1>

            <div className="d-flex justify-content-center align-items-start flex-grow-1 w-100">
              <ChatRoom
                city={activeCity}
                username={username}
                socket={socket}
                onWeatherUpdate={(updatedWeather) => {
                  setWeather(updatedWeather);
                  localStorage.setItem("weather", JSON.stringify(updatedWeather));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
