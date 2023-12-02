"use strict";
const nodemailer = require("nodemailer");
const OtpModel = require("../models/otpModel");
const moment = require("moment/moment");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "prabhashvishwakarma69@gmail.com",
    pass: "3580mGkaCvfKXERj",
  },
});
const sendMail = async (to, subject, message, otp) => {
  let info = await transporter.sendMail({
    from: "FruitsBazar@gmail.com",
    to: to,
    subject: subject,
    text: message,
    html: `<b>${message}</b>`,
  });
  let val = {
    email: to,
    otp: otp,
    expireAt:moment().add(180,"seconds")
  };
  OtpModel.create(val)
    .then(async (response) => {
      console.warn({OtpModel:response });
      return info;
    })
    .catch((e) => {
      return e?.message;
    });
};
module.exports = {
  sendMail,
};
