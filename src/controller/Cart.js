const { validationResult } = require("express-validator");
const Cart = require("../models/Cart");

const AddCart = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      ok: false,
    });
  }

  let val = {
    user_id: req.body.user_id,
    product_id: req.body.product_id
  };

  await Cart.create(val)
    .then(async (response) => {
      return res.status(200).send({
        data: response,
        ok: true,
        message: "Product created sucessfully !",
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


const GetProducst = async (req, res) => {
  await Product.find()
    .then(async (response) => {
      return res.status(200).send({
        data: response,
        ok: true,
        message: "Product given sucessfully !",
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

module.exports = {
  AddCart,
  GetProducst
};
