"use strict";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: 'prabhashvishwakarma69@gmail.com',
    pass: '3580mGkaCvfKXERj'
},
});
const sendMail = async (to, subject, message) => {
  let info = await transporter.sendMail({
    from:'FruitsBazar@gmail.com', 
    to: to, 
    subject: subject, 
    text: message, 
    html: `<b>${message}</b>`,
  });
  return info;
}
module.exports = {
   sendMail
}
