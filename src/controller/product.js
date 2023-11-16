const { validationResult } = require("express-validator");
const Product = require("../models/ProductList");

const CreateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      ok: false,
    });
  }
  let val = {
    title: req.body.title,
    description: req.body.description,
    photos: req.body.photos,
    productCount: req.body.productCount,
    price: req.body.price,
  };

  await Product.create(val)
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

const GetProducstById = async (req, res) => {
  await Product.findById(req?.params?.id)
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

const GetProducstSearch = async (req, res) => {
  if (req?.params?.search?.length > 3) {
    var searchString = new RegExp(req?.params?.search, "i");
    Product.find({ title: { $regex: searchString } })
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
  }
};
module.exports = {
  CreateProduct,
  GetProducst,
  GetProducstById,
  GetProducstSearch,
};
