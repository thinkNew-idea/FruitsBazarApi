const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  last_name:{
    type: String,
    required: true,
  },
  address_1:{
    type: String,
    required: false,
  },
  address_2:{
    type: String,
    required: false,
  },
  mobile:{
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("users", userSchema);
module.exports = User;
