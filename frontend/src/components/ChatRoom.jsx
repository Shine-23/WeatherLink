import { useEffect, useMemo, useState } from "react";
import { fetchMessagesByCity } from "../api/weather";

const normalizeCity = (c) => (c || "").trim().toLowerCase();

const ChatRoom = ({ city, username, socket, onWeatherUpdate }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const cityKey = useMemo(() => normalizeCity(city), [city]);
  const cityTitle = useMemo(() => {
    if (!cityKey) return "";
    return cityKey.charAt(0).toUpperCase() + cityKey.slice(1);
  }, [cityKey]);

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!cityKey) {
      setChatMessages([]);
      return;
    }

    const load = async () => {
      try {
        const msgs = await fetchMessagesByCity(cityKey);
        setChatMessages(msgs || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    load();
  }, [cityKey]);

  useEffect(() => {
    if (!socket) return;

    const onHistory = (history) => {
      if (Array.isArray(history)) setChatMessages(history);
    };

    socket.on("chat-history", onHistory);
    return () => socket.off("chat-history", onHistory);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onReceive = (msg) => {
      setChatMessages((prev) => {
        if (msg?._id && prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", onReceive);
    return () => socket.off("receiveMessage", onReceive);
  }, [socket]);

  useEffect(() => {
    if (!socket || !onWeatherUpdate || !cityKey) return;

    const handler = (payload) => {
      const payloadCity = normalizeCity(payload?.city);
      if (payloadCity !== cityKey) return;

      const nextWeather = payload.weather || payload;
      onWeatherUpdate(nextWeather);
    };

    socket.on("weather-update", handler);
    return () => socket.off("weather-update", handler);
  }, [socket, onWeatherUpdate, cityKey]);

  const sendMessage = () => {
    if (!socket || !cityKey) return;

    const text = message.trim();
    if (!text) return;

    socket.emit("sendMessage", {
      tempId: Date.now(),
      username,
      city: cityKey,
      message: text,
    });

    setMessage("");
  };

  return (
    <div className="chat-room glass-card">
      <h2>💬 {cityKey ? `Chat - ${cityTitle}` : "Join a city to start chatting"}</h2>

      <div className="chat-box">
        {chatMessages.map((msg, index) => (
          <div
            key={msg._id ?? msg.tempId ?? index}
            className={`chat-message ${msg.username === "WeatherBot" ? "bot-message" : ""}`}
          >
            <div className="message-header">
              <strong>{msg.username}</strong>
            </div>

            <div className={msg.username === "WeatherBot" ? "bot-text-wrapper" : "message-content"}>
              <span className={msg.username === "WeatherBot" ? "bot-text" : ""}>
                {msg.message}
              </span>
            </div>

            <div className="message-time">{formatTime(msg.createdAt)}</div>
          </div>
        ))}
      </div>

      {cityKey && (
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
