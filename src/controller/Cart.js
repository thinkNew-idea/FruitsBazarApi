const { validationResult } = require("express-validator");
const Cart = require("../models/Cart");
const Product = require("../models/ProductList");

const cartAddFuntion = async (req, res, item,ProductDetails) => {
  let val;
  if (item.length == 0) {
    val = {
      user_id: req.body.user_id,
      product_id: req.body.product_id,
      product_count: 1,
    };
    await Cart.create(val)
      .then(async (response) => {
        return res.status(200).send({
          data: response,
          ok: true,
          message: "Add to cart sucessfully !",
        });
      })
      .catch((e) => {
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      });
  } else {
    let single = item[0];
    let bookedVal=single.product_count + 1;
    if(ProductDetails.productCount>=bookedVal){
      val = {
        user_id: req.body.user_id,
        product_id: req.body.product_id,
        product_count:bookedVal,
      };
      await Cart.findByIdAndUpdate(single?._id?.toString(), val, { new: true })
        .then(async (response) => {
          return res.status(200).send({
            data: response,
            ok: true,
            message: "Add to cart sucessfully !",
          });
        })
        .catch((e) => {
          return res.status(500).send({
            error: e,
            message: e.message,
            ok: false,
          });
        });
    }else{
      return res.status(200).send({
        ok: false,
        message: "Max "+ProductDetails.productCount+" product allowed !",
      });
    }
  }
};
const cartRemoveFuntion = async (req, res, item) => {
  let val;
  let single = item[0];
  if (single?.product_count == 1) {
    await Cart.findByIdAndDelete(single?._id?.toString())
      .then(async () => {
        return res.status(200).send({
          ok: true,
          message: "Removed from cart sucessfully !",
        });
      })
      .catch((e) => {
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      });
  } else {
    val = {
      user_id: req.body.user_id,
      product_id: req.body.product_id,
      product_count: single?.product_count - 1,
    };

    await Cart.findByIdAndUpdate(single?._id?.toString(), val, { new: true })
      .then(async (response) => {
        return res.status(200).send({
          data: response,
          ok: true,
          message: "Add to cart sucessfully !",
        });
      })
      .catch((e) => {
        return res.status(500).send({
          error: e,
          message: e.message,
          ok: false,
        });
      });
  }
};
const AddCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      ok: false,
    });
  }
  const product_id=req?.body?.product_id;
  const user_id=req?.body?.user_id;
  let val = {
    user_id:user_id,
    product_id:product_id,
  };
  const findProduct = await Cart.find(val);
  const ProductDetails= await Product.findById(product_id);
  cartAddFuntion(req, res, findProduct,ProductDetails);
};
const GetCart = async (req, res) => {
  const CartData = await Cart.find({ user_id: req?.body?.user_id });
  let cartList = [];
  for (let i = 0; i < CartData.length; i++) {
    await Product.findById(CartData[i]?.product_id).then((res) => {
      return cartList.push({
        ...CartData[i]?._doc,
        title: res.title,
        price: res.price,
        photo: res.photos,
      });
    });
  }
  console.log(cartList)
  if(cartList){
    return res.status(200).send({
      data: cartList,
      ok: true,
      message: "Cart given sucessfully !",
    });
  }

};
const RemoveCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      ok: false,
    });
  }
  let val = {
    user_id: req.body.user_id,
    product_id: req.body.product_id,
  };
  const findProduct = await Cart.find(val);
  cartRemoveFuntion(req, res, findProduct);
};

module.exports = {
  AddCart,
  GetCart,
  RemoveCart,
};
