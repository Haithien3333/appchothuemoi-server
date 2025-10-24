// 🔹 Nạp các module cần thiết
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

// 🔹 Import file cấu hình riêng
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const locationSocket = require("./sockets/locationSocket");

// 🔹 Khởi tạo Express và HTTP Server
const app = express();
const httpServer = createServer(app);

// 🔹 Cấu hình Socket.IO
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// ✅ Kết nối MongoDB
connectDB();

// ✅ Middleware cho toàn bộ app
app.use(cors());
app.use(express.json()); // Đọc dữ liệu JSON từ body

// ✅ Định nghĩa route cho API xác thực
// => Tất cả endpoint trong `routes/auth.js` sẽ có prefix: /api/auth
app.use("/api/auth", authRoutes);

// ✅ Kích hoạt Socket.IO (nếu có module locationSocket)
if (typeof locationSocket === "function") {
  locationSocket(io);
}

// ✅ PORT (đặt trong .env hoặc mặc định 5000)
const PORT = process.env.PORT || 5000;

// ✅ Khởi động server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại: http://192.168.1.7:${PORT}`);
});
