import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectMongoDb } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import User from "./models/User.js";

// Express & HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
export const userSocketMap = {};

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Routes
app.use("/api/status", (res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Socket.IO connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", async (messageData) => {
    try {
      const newMessage = await Message.create(messageData);

      const receiverSocket = userSocketMap[messageData.receiverID];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", newMessage);
      }
    } catch (err) {
      console.log("Message send error:", err);
    }
  });

  socket.on("deleteUser", async (userID) => {
    try {
      const user = await User.findById(userID);
      if (!user) return;

      await User.findByIdAndDelete(userID);

      if (userSocketMap[userID]) {
        io.to(userSocketMap[userID]).disconnect(true);
        delete userSocketMap[userID];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    } catch (err) {
      console.log("Delete user error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

await connectMongoDb();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
