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
  const [weather, setWeather] = useState(() => {
    const saved = localStorage.getItem("weather");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username"); 

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      setCity(lastCity);
      handleSearch(lastCity);
    }
  }, []);

  useEffect(() => {
    socket.on("weather-update", (data) => {
      if (data.city.toLowerCase() === city.toLowerCase()) {
        console.log("Real-time weather update received:", data);
        setWeather(data.weather);
        localStorage.setItem("weather", JSON.stringify(data.weather));
      }
    });

    return () => {
      socket.off("weather-update"); // cleanup
    };
  }, [city]);

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
      const response = await axios.get(
        `http://localhost:3000/api/weather`,
        {
          params: { city: queryCity },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWeather(response.data);
      localStorage.setItem("weather", JSON.stringify(response.data));
      localStorage.setItem("lastCity", queryCity);
      socket.emit("joinRoom", queryCity.toLowerCase());

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
              <WeatherCard weather={weather} />
            </div>
          </div>

          <div className="right-side col-lg-6 col-md-12 mb-4 d-flex flex-column align-items-center">
            <h1 className="chat-title mb-3 text-center w-100">City Chat Room</h1>
            <div className="d-flex justify-content-center align-items-start flex-grow-1 w-100">
              <ChatRoom 
                city={weather?.city} 
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
