import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectMongoDb } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import Message from "./models/Message.js"; // MongoDB Message model

// Express & HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
export const userSocketMap = {};

// Socket.IO connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);
  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for sendMessage
  socket.on("sendMessage", async (messageData) => {
    try {
      // Save message in MongoDB
      const newMessage = await Message.create(messageData);

      // Send to receiver if online
      const receiverSocket = userSocketMap[messageData.receiverID];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", newMessage);
      }
    } catch (err) {
      console.log("Message send error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect MongoDB
await connectMongoDb();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on PORT:", PORT));
