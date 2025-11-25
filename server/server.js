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

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = "https://real-time-chat-app-mern-frontend.onrender.com";


// Socket.IO config
export const io = new Server(server, {
  cors: { 
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
});

export const userSocketMap = {};

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: FRONTEND_URL, credentials: true })); 


// Routes
app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  console.log("User connected:", userId);

  if (!userId) {
    console.log("No userId → disconnect");
    return socket.disconnect(true);
  }

  userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // SEND MESSAGE
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

  // DELETE USER
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

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

await connectMongoDb();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));

export default server;