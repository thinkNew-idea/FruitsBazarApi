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
const sendOtp = async (req, res) => {
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
const regisFun=async(name,email,last_name,address_1,address_2,mobile, password,res,req)=>{
  User.create({ name,email,last_name,address_1,address_2,mobile, password })
  .then(async (response) => {
    loginFun(response.email,req.body.password,res,req);
    // const token = generateTokenForUser(response);
    // return res.status(200).send({
    //   data: response,
    //   meta: {
    //     token,
    //   },
    //   ok: true,
    //   message: "User registered",
    // });
  })
  .catch((e) => {
    return res.status(500).send({
      error: e,
      message: e.message,
      ok: false,
    });
  });
}
const loginFun=async(email,password,res,req)=>{
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
}

const OtpVerify = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      message: "Please fill valid inputs",
      ok: false,
    });
  }
  // const email = req.body.email;
  // const otp = req.body.otp;
  const {name,email,last_name,address_1,address_2,mobile,otp} = req.body;
    await OtpModel.findOne({email:email}).then(async(response)=>{
      if(otp==response?.otp){
       
        const password = await bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(req.body.password, salt))
          .then((hash) => hash);
          regisFun(name,email,last_name,address_1,address_2,mobile,password,res,req);
      }else{
        return res.send({
          ok: false,
          message: "Invalid OTP !",
        });
      }
  });
}

// const registerUser = async (req, res) => {
//    const errors = validationResult(req);
//    if (!errors.isEmpty()) {
//      return res.status(400).send({
//        ...JSON.parse(JSON.stringify(errors)),
//        ok: false,
//      });
//    }
//   sendOtp(req,res);
// };

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
  loginFun(email,password,res,req);
};

const EmailVerify= async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      ok: false,
    });
  }
  User.findOne({ email: req.body.email }, { _id: 1, email: 1 }).then(user => {
    if (user) {
      return res.send({
        ok: true,
        message:'User already exits with given Email!',
      });
    } else {
      return res.send({
        ok: false,
        message:'New User',
      });
    }
 })
};

module.exports = {
  // registerUser,
  sendOtp,
  loginUser,
  OtpVerify,
  EmailVerify
};
