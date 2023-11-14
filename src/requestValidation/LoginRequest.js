const {checkSchema} = require('express-validator');
const User = require('../models/User');
const LoginRequest = () => checkSchema({
   email: {
      custom: {
         options: async (value) => {
            return User.findOne({ email: value }).then(user => {
               if (user) {
                  return true
               } else {
                  return Promise.reject('Email or password is wrong!');
               }
            })
         }
      }
   },
})
module.exports = LoginRequest
