const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================================
// 🔹 API ĐĂNG KÝ NGƯỜI DÙNG
// ========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ msg: "Vui lòng nhập đầy đủ thông tin." });
    }

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email đã được sử dụng." });
    }

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

    // Tạo token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Đăng ký thành công!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err);
    res.status(500).json({ msg: "Lỗi máy chủ", error: err.message });
  }
});

// ========================================
// 🔹 API ĐĂNG NHẬP NGƯỜI DÙNG
// ========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ msg: "Vui lòng nhập email và mật khẩu." });
    }

    // Tìm user trong DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Tài khoản không tồn tại." });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Mật khẩu không đúng." });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      msg: "Đăng nhập thành công!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ msg: "Lỗi máy chủ", error: err.message });
  }
});

module.exports = router;
