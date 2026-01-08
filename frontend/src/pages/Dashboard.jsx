import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "../components/WeatherCard"; 
import ChatRoom from "../components/ChatRoom";
import Navbar from "../components/NavBar";
import '../App.css';
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const Dashboard = () => {
  const [city, setCity] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [weather, setWeather] = useState(() => {
    const saved = localStorage.getItem("weather");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username"); 
  const normalizeCity = (c) => (c || "").trim().toLowerCase();

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      handleSearch(lastCity);
    }
  }, []);


  useEffect(() => {
    const handler = (data) => {
      if (data.city?.toLowerCase() === activeCity?.toLowerCase()) {
        const next = data.weather ?? data;
        setWeather(next);
        localStorage.setItem("weather", JSON.stringify(next));
      }
    };

    socket.on("weather-update", handler);
    return () => socket.off("weather-update", handler);
  }, [activeCity]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleSearch = async (searchCity) => {
    const token = localStorage.getItem("token");
    const queryCity = searchCity || city;
    if (!queryCity) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://localhost:3000/api/weather`, {
        params: { city: queryCity },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      const cityKey = normalizeCity(data.city || queryCity);

      setWeather(data);
      setActiveCity(cityKey);

      localStorage.setItem("weather", JSON.stringify(data));
      localStorage.setItem("lastCity", cityKey);

      socket.emit("joinRoom", cityKey);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("City not found or error fetching data.");
    } finally {
      setLoading(false);
    }
  }

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
                value={city}
                placeholder="Enter city name..."
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="btn btn-primary" onClick={() => handleSearch()}>Search</button>
            </div>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            <div className="d-flex justify-content-center align-items-center flex-grow-1 w-100">
              <WeatherCard city = {activeCity} weather={weather} />
            </div>
          </div>

          <div className="right-side col-lg-6 col-md-12 mb-4 d-flex flex-column align-items-center">
            <h1 className="chat-title mb-3 text-center w-100">City Chat Room</h1>
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
}

export default Dashboard;
