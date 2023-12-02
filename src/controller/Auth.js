const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { sendRegisterOTP } = require("../Email/sendOtp");
const OtpModel = require("../models/otpModel");
function verifyPassword(plaintextPassword, encryptedPassword) {
  return bcrypt.compareSync(plaintextPassword, encryptedPassword);
}
const generateTokenForUser = (user) => {
  const tokenExpiresIn = "168h";
  const token = jwt.sign(
    { user_id: user._id, username: user.username },
    'secret',
    {
      expiresIn: tokenExpiresIn,
    }
  );
  return token;
};
const sendOtp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      message: "Please fill valid inputs",
      ok: false,
    });
  }
  const email = req.body.email;
  try {
    const response = await sendRegisterOTP(email);
    console.warn({ response });
    return res.send({
      ok: true,
      response: response,
      message: "OTP sent successfuly",
    });
  } catch (error) {
    console.warn({ error });
    return res.send({
      message: error.message,
      error,
      ok: false,
    });
  }
};

const OtpVerify = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      message: "Please fill valid inputs",
      ok: false,
    });
  }
  const email = req.body.email;
  const otp = req.body.otp;

    await OtpModel.findOne({email:email}).then((response)=>{
      console.warn({response})
      if(otp==response?.otp){
        return res.send({
          ok: true,
          response: response,
          message: "OTP verification done successfuly",
        });
      }else{
        return res.send({
          ok: false,
          message: "Invalid OTP !",
        });
      }
  });
}

const registerUser = async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).send({
       ...JSON.parse(JSON.stringify(errors)),
       ok: false,
     });
   }
  const username = req.body.username;
  const email = req.body.email;
  const password = await bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(req.body.password, salt))
    .then((hash) => hash);
  User.create({ username, email, password })
    .then(async (response) => {
      const token = generateTokenForUser(response);
      return res.status(200).send({
        data: response,
        meta: {
          token,
        },
        ok: true,
        message: "User registered",
      });
    })
    .catch((e) => {
      return res.status(500).send({
        error: e,
        message: e.message,
        ok: false,
      });
    });
};
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      ok: false,
    });
  }
  const email = req.body.email;
  const password = req.body.password;
  try {
    let user = await User.findOne({ email });
    if (!verifyPassword(password, user.password)) {
      return res.status(400).send({
        ok: false,
        message: "Invalid username or password.",
      });
    }
    await User.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
    });
    user = await User.findOne({ email });

    return res.status(200).send({
      data: user,
      meta: {
        token: generateTokenForUser(user),
      },
      ok: true,
      message: "Login success",
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
      message: error.message,
      ok: false,
    });
  }
};
module.exports = {
  registerUser,
  sendOtp,
  loginUser,
  OtpVerify
};
