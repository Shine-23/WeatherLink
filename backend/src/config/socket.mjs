import { Message } from "../models/Messages.mjs";

const normalizeCity = (city) => (city || "").trim().toLowerCase();

export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", async (city) => {
      try {
        const normalizedCity = normalizeCity(city);
        if (!normalizedCity) return;

        socket.join(normalizedCity);

        const history = await Message.find({ city: normalizedCity })
          .sort({ createdAt: -1 })
          .limit(30);

        socket.emit("chat-history", history.reverse());
      } catch (err) {
        console.error("joinRoom error:", err.message);
      }
    });
    
    socket.on("sendMessage", async (msgData) => {
      try {
        const normalizedCity = normalizeCity(msgData.city);
        if (!normalizedCity) return;

        const savedMsg = await Message.create({
          username: msgData.username,
          city: normalizedCity,
          message: msgData.message,
        });

        io.to(normalizedCity).emit("receiveMessage", savedMsg);
      } catch (err) {
        console.error("Error saving message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
