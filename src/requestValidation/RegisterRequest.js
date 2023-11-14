const { checkSchema, validationResult } = require('express-validator');
const User = require('../models/User');
const cache = require('../libs/cache');



const RegisterRequest = () => checkSchema({

   email: {
      isEmail: {
         bail: true,
      },
      custom: {
         options: async (value) => {
            return User.findOne({ email: value }).then(user => {
               if (user) {
                  return Promise.reject('User already exits with given Email !');
               } else {
                  return true;
               }
            })
         }
      }
   },
   otp: {
      isLength: {
         errorMessage: 'Invalid OTP',
         options: { min: 6, max: 6 },
      },
      custom: {
         options: async (value, { req }) => {
            const cachedOtp = cache.get(`register_otp_${req.body.email}`)
            if (value !== cachedOtp) {
               return Promise.reject('Invalid OTP');
            }
            return true
         }
      }
   },
   password: {
      isLength: {
         errorMessage: 'Password should be 6 chars long',
         // Multiple options would be expressed as an array
         options: { min: 7 },
      },
   },
   firstName: {
      rtrim: {
         // Options as an array
         options: [' -'],
      },
   },
})
module.exports = RegisterRequest
