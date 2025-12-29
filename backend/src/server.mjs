import { Server } from "socket.io";
import { Message } from "./models/Messages.mjs";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinRoom", (city) => {
      socket.join(city);
    });

    socket.on("sendMessage", async (msgData) => {
      const savedMsg = await Message.create(msgData);
      io.to(msgData.city).emit("receiveMessage", savedMsg);
    });

    socket.on("disconnect", () => {
      console.log("[Error] Socket disconnected:", socket.id);
    });
  });

  return io;
};
