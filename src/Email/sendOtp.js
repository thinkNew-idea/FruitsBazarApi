const cache = require("../libs/cache");
const { sendMail } = require("./mailer");
function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
       OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
 }
const sendRegisterOTP = async (to) => {
    const otp = generateOTP()
    const otpExpirationTime = 100000
    cache.set(`register_otp_${to}`, otp, otpExpirationTime)
    let subject = 'OTP for registration at FruitsBazar'
    let body = `Dear ${to}, your otp is ${otp}`
   //  console.debug(cache.get(`register_otp_${to}`));
    return sendMail(to, subject, body)
 }
module.exports = {
    sendRegisterOTP
 }