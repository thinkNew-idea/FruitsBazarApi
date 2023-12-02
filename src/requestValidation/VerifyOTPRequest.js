const { checkSchema, validationResult } = require('express-validator');
const User = require('../models/User');

const VerifyOTPRequest = () => checkSchema({
   otp: {
      isLength: {
         errorMessage: 'Invalid OTP',
         options: { min: 6, max: 6 },
      },
   },
   email: {
      isEmail: {
         bail: true,
      },
      custom: {
         options: async (value) => {
            return User.findOne({ email: value }, { _id: 1, email: 1 }).then(user => {
               if (user) {
                  return Promise.reject('User already exits with given Email!');
               } else {
                  return true;
               }
            })
         }
      }
   },
})
module.exports = VerifyOTPRequest
