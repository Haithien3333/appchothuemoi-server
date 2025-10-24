function locationSocket(io) {
  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    socket.on("sendLocation", (data) => {
      // data: { userId, lat, lng }
      console.log("📍 Vị trí mới:", data);
      io.emit("updateLocation", data); // Gửi lại cho tất cả client
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

module.exports = locationSocket;
