import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const ChatRoom = ({ city, username, onWeatherUpdate }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const cityTitle = city.charAt(0).toUpperCase() + city.slice(1);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!city) return;
    socket.emit("joinRoom", city);
    fetchMessages(city);
  }, [city]);

  useEffect(() => {
    if (!onWeatherUpdate || !city) return;

    const handler = (data) => {
      if (data.city?.toLowerCase() === city.toLowerCase()) {
        onWeatherUpdate(data.weather);
      }
    };

    socket.on("weather-update", handler);
    return () => socket.off("weather-update", handler);
  }, [city, onWeatherUpdate]);

  const fetchMessages = async (city) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:3000/api/weather/messages/${city}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChatMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChatMessages((prev) => {
        if (msg?._id && prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (message.trim() === "" || !city) return;

    const msgData = {
      tempId: Date.now(),
      username,
      city,
      message,
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  return (
    <div className="chat-room glass-card">
      <h2>💬 {city ? `Chat - ${cityTitle}` : "Join a city to start chatting"}</h2>

      <div className="chat-box">
        {chatMessages.map((msg, index) => (
          <div
            key={msg._id ?? msg.tempId ?? index}
            className={`chat-message ${
              msg.username === "WeatherBot" ? "bot-message" : ""
            }`}
          >
            <div className="message-header">
              <strong>{msg.username}</strong>
            </div>
            <div
              className={
                msg.username === "WeatherBot" ? "bot-text-wrapper" : "message-content"
              }
            >
              <span className={msg.username === "WeatherBot" ? "bot-text" : ""}>
                {msg.message}
              </span>
            </div>
            <div className="message-time">{formatTime(msg.createdAt)}</div>
          </div>
        ))}
      </div>

      {city && (
        <div className="chat-input mt-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-primary ms-2" onClick={sendMessage}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
