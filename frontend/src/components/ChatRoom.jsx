import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from 'axios';

const socket = io(`http://localhost:3000`); // Connect to backend

const ChatRoom = ({ city, username }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  
  // Fetch previous messages when city changes
  useEffect(() => {
    if (!city) return;
    console.log("Joining room for city:", city);
    socket.emit('joinRoom', city);
    fetchMessages(city);
  }, [city]);

  //Fetch Messages for the city
  const fetchMessages = async (city) => { 
  const token = localStorage.getItem('token');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/weather/messages/${city}`,
        {
          headers:{
             Authorization: `Bearer ${token}`
          }
        }
      );
      setChatMessages(res.data);
    } catch (error) {{
      console.error("Error fetching messages:", error);
    }
  }}

  //Listen for incoming messages
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("receiveMessage");
    }
  }, []);

  //Send message to server
  const sendMessage = () => {
    if (message.trim() === "" || !city) return;
    const msgData = {
      tempId: Date.now(), // Temporary ID
      username,
      city,
      message,
    };
    socket.emit("sendMessage", msgData);
    setMessage("");
    }

  return (
    <div className="chat-room glass-card">
      <h2>💬 {city ? `Chat - ${city}` : "Join a city to start chatting"}</h2>

      <div className="chat-box">
        {chatMessages.map((msg, index) => (
          <div key={msg._id ?? msg.tempId ?? index} className="chat-message">
            <strong>{msg.username}:</strong> {msg.message}
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
          <button className="btn btn-primary ms-2" onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
