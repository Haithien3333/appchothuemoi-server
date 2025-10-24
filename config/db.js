const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("❌ MONGO_URI chưa được khai báo trong file .env");
    }

    // ✅ Kết nối MongoDB
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Đã kết nối MongoDB: ${conn.connection.host}`);

    // ✅ Bật debug (tùy chọn)
    if (process.env.NODE_ENV === "development") {
      mongoose.set("debug", true);
    }

  } catch (err) {
    console.error("❌ Kết nối MongoDB thất bại:");
    console.error(err.message);
    process.exit(1); // Dừng tiến trình khi không kết nối được DB
  }
};

module.exports = connectDB;
