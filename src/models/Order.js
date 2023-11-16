const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  order_prize: {
    type: Number,
    required: true,
  },
  order_count: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Order = mongoose.model("order", orderSchema);
module.exports = Order;
