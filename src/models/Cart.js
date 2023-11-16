const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
