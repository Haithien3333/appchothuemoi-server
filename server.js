require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const { createServer } = require("http");
const { Server } = require("socket.io");
const locationSocket = require("./sockets/locationSocket");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// ✅ Kết nối MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// ✅ Route API
app.use("/api/auth", authRoutes);

// ✅ Socket.IO
locationSocket(io);

const PORT = process.env.PORT || 3000;

// ✅ Mở cho toàn mạng LAN
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại: http://192.168.1.7:${PORT}`);
});
