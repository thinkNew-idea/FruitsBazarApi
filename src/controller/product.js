const { validationResult } = require("express-validator");
const Product = require("../models/ProductList");
const Order = require("../models/Order");

const OrderProduct= async(req, res,productDetails,productId,productCount,user_id)=>{
  let val = {
    product_id:productId,
    user_id:user_id,
    order_count:productCount,
    order_prize:(productCount*productDetails.price)
  };
  await Order.create(val)
    .then(async (response) => {
      return res.status(200).send({
        data: response,
        ok: true,
        message: "Product buy sucessfully!",
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
    inStock: req.body.inStock,
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

const BuyProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      ...JSON.parse(JSON.stringify(errors)),
      ok: false,
    });
  }
  const user_id= req.body.user_id;
  const productId= req.body.productId;
  const productCount= req.body.productCount;
  const productDetails = await Product.findById(productId);
  if(productDetails?.productCount>=productCount){
    let remainProducts=productDetails?.productCount-productCount;
    await Product.findByIdAndUpdate(productId,{productCount:remainProducts,inStock:remainProducts>0?true:false },{new:true}).then((response)=>{
      OrderProduct(req, res,response,productId,productCount,user_id)
    })
  }else{
    return res.status(200).send({
      ok: false,
      message: "Max "+productDetails.productCount+" product allowed !",
    });
  }

 
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
          message: "Product search given sucessfully !",
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
      message: "Character length must be greater than 3!",
    });
  }
};

const GetOderList = async (req, res) => {
  const OrderData = await Order.find({ user_id: req?.body?.user_id });
  let orderList = [];
  for (let i = 0; i < OrderData.length; i++) {
    await Product.findById(OrderData[i]?.product_id).then((res) => {
      return orderList.push({
        ...OrderData[i]?._doc,
        title: res.title,
        price: res.price,
        photo: res.photos,
      });
    });
  }
  console.log(orderList)
  if(orderList){
    return res.status(200).send({
      data: orderList,
      ok: true,
      message: "Orders given sucessfully !",
    });
  }

};

module.exports = {
  BuyProduct,
  CreateProduct,
  GetProducst,
  GetProducstById,
  GetProducstSearch,
  GetOderList
};
