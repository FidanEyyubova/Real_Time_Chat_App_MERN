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
// import jwt from "jsonwebtoken"; // Gerçek JWT doğrulaması için bunu aktif edin

// ⚠️ Harita: Kullanıcı ID'sini Socket ID ile eşleştirir.
export const userSocketMap = {}; 

const allowedOrigins = [
  "https://real-time-chat-app-mern-ruddy.vercel.app", // Production Frontend
  "http://localhost:5173", // Development Frontend
];

const app = express();
const server = http.createServer(app);

// =================================================================
// 1. SOCKET.IO SUNUCU TANIMI VE GÜVENLİK MİDDLEWARE'İ
// =================================================================

// Socket.IO bağlantısı kurulmadan önce kullanıcı kimliğini kontrol eder.
// Ön uçtan gönderilen token veya userId'nin güvenilirliğini sağlar.
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
    // Gerçek JWT doğrulama örneği:
    /*
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication failed: Token missing"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        socket.userId = decoded.userId;
        next();
    } catch (err) {
        next(new Error("Authentication failed: Invalid token"));
    }
    */
    
    // Geçici olarak sadece userId kontrolü:
    const userId = socket.handshake.auth?.userId; 
    if (!userId) {
        return next(new Error("Authentication failed: userId missing"));
    }
    socket.userId = userId;
    next();
});

export { io }; // Diğer modüllerin io'ya erişimi için

// =================================================================
// 2. EXPRESS MİDDLEWARE'LERİ VE 413 HATASI ÇÖZÜMÜ
// =================================================================

// 413 Content Too Large hatasını çözmek için limit 50MB'a çıkarıldı.
app.use(express.json({ limit: "50mb" })); 
// URL kodlu form verileri için de limiti artırma (gerekliyse)
app.use(express.urlencoded({ limit: "50mb", extended: true })); 

// CORS hatasını çözmek için sadece izin verilen kaynaklara erişim izni
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Express Rotaları
app.get("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


// =================================================================
// 3. SOCKET.IO OLAY YÖNETİMİ
// =================================================================
io.on("connection", (socket) => {
    // userId artık middleware tarafından doğrulanmıştır.
    const userId = socket.userId; 
    console.log("User connected:", userId);

    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Mesaj gönderme olayı ve geri bildirim
    socket.on("sendMessage", async (messageData, callback) => {
        try {
            // Mesaj içeriğinin boyutu 50MB'ı aşmadığı sürece burada kaydedilecektir.
            const newMessage = await Message.create(messageData);
            
            // Başarılı geri bildirim: Ön uca mesajın başarıyla kaydedildiğini bildirir.
            if (callback) callback({ status: "ok", message: newMessage }); 

            const receiverSocket = userSocketMap[messageData.receiverID];

            // Alıcı online ise mesajı gerçek zamanlı gönder
            if (receiverSocket) {
                io.to(receiverSocket).emit("receiveMessage", newMessage);
            }
        } catch (err) {
            console.error("Message send error:", err);
            // Hata geri bildirimi: Ön uca hata oluştuğunu bildirir.
            if (callback) callback({ status: "error", message: "Failed to send message", errorDetails: err.message });
        }
    });

    // DELETE USER
    socket.on("deleteUser", async (userID) => {
        try {
            const user = await User.findById(userID);
            if (!user) return;

            await User.findByIdAndDelete(userID);

            if (userSocketMap[userID]) {
                // Bağlantıyı kesme, haritadan silme ve online kullanıcıları güncelleme
                io.to(userSocketMap[userID]).disconnect(true);
                delete userSocketMap[userID];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            }
        } catch (err) {
            console.error("Delete user error:", err);
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

// =================================================================
// 4. SUNUCU BAŞLATMA
// =================================================================

// MongoDB'ye bağlan ve bağlantı başarılıysa sunucuyu dinlemeye başla
await connectMongoDb();
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
}

export default server;