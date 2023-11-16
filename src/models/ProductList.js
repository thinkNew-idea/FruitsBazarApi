const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productCount:{
    type:Number,
    required: true,
  },
  photos: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Product = mongoose.model("product_list", productSchema);
module.exports = Product;
