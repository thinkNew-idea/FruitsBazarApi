const mongoose = require("mongoose");
const otpModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: { type: Date, expires: 60 }
});
const OtpModel = mongoose.model("otpModel",otpModel);
module.exports = OtpModel;
