// server/server.js
const express = require("express");
const cors = require("cors");
const sendOTPEmail = require("./sendOtp");
const sendOTPPhone = require("./sendOtpPhone"); 
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const otpStore = {}; 

app.post("/api/send-otp", async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ success: false, message: "Email or phone is required." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const promises = [];

  if (email) {
    otpStore[email] = otp;
    promises.push(sendOTPEmail(email, otp));
  }

  if (phone) {
    otpStore[phone] = otp;
    promises.push(sendOTPPhone(phone, otp));
  }

  try {
    await Promise.all(promises);
    res.status(200).json({ success: true, message: "OTP sent." });
  } catch (err) {
    console.error("OTP send failed:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const { email, phone, otp } = req.body;
  const key = email || phone;

  if (!key) return res.status(400).json({ success: false, message: "Missing email or phone." });

  const valid = otpStore[key] === otp;
  res.json({ success: valid });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
