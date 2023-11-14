"use strict";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: 'prabhashvishwakarma69@gmail.com',
    pass: 'xsmtpsib-1ed8647c0768d82d408de64f30ca9dcbc9faf232658414842505bb73ed1cc31d-fImW6hcxNyjaC8QM'
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
