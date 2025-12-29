import React, { useState } from "react";
import axios from "axios";
import WeatherCard from "../components/WeatherCard"; 
import ChatRoom from "../components/ChatRoom";
import Navbar from "../components/NavBar";
import '../App.css';

const Dashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username"); 
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/weather`,
        {
          params: { city },
          headers: { Authorization: `Bearer ${token}` }, // pass token
        }
      );
      setWeather(response.data);
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
        <br/> <h1 className="mb-4 text-center">Welcome to WeatherLink </h1> <br/>

        <div className="row">
          {/* Left Side: Search + Weather */}
          <div className="col-lg-6 col-md-12 mb-4 d-flex flex-column align-items-center">
            {/* Search Box */}
            <div className="search-box d-flex gap-2 mb-4 w-100 justify-content-center">
              <input
                type="text"
                className="form-control"
                value={city}
                placeholder="Enter city name..."
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="btn btn-primary" onClick={handleSearch}>Search</button>
            </div>

            {/* Loading & Error */}
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {/* Centered WeatherCard */}
            <div className="d-flex justify-content-center align-items-center flex-grow-1 w-100">
              <WeatherCard weather={weather} />
            </div>
          </div>

         {/* Right Side: Chat */}
          <div className="right-side col-lg-6 col-md-12 mb-4 d-flex flex-column align-items-center">
            {/* Chat Title */}
            <h1 className="chat-title mb-3 text-center w-100">City Chat Room</h1>
            {/* ChatRoom */}
            <div className="d-flex justify-content-center align-items-start flex-grow-1 w-100">
              <ChatRoom city={weather?.city} username={username} />
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
