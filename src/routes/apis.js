const express = require("express");
const router = express.Router();
const Auth = require("../controller/Auth");
var fs = require("fs");
var path = require("path");
var multer = require("multer");
const RegisterRequest = require("../requestValidation/RegisterRequest");
const SendOTPRequest = require("../requestValidation/SendOTPRequest");
const LoginRequest = require("../requestValidation/LoginRequest");
const UploadController = require("../controller/Upload");
const Product = require("../controller/product");
const Cart = require("../controller/Cart");
const verifyToken = require("../middleware/verifyToken");
const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 500000 }
});
// var upload = storage

//User login and register apis
router.post("/register", RegisterRequest(), Auth.registerUser);
router.post("/login", LoginRequest(), Auth.loginUser);
router.post("/sendOtp", SendOTPRequest(), Auth.sendOtp);

// products apis
router.post("/createProduct", Product.CreateProduct);
router.get("/getProducts",Product.GetProducst);
router.get("/getProducts/:id",Product.GetProducstById);
router.get("/getProducts=:search",Product.GetProducstSearch);


//Order
router.post("/buyProduct", Product.BuyProduct);
router.get("/getOrders",verifyToken,Product.GetOderList);

//Cart
router.post("/addCart",verifyToken,Cart.AddCart);
router.get("/getCart",verifyToken,Cart.GetCart);
router.post("/removeCart",verifyToken,Cart.RemoveCart);


//upload files
router.post("/upload", upload.single("file"), UploadController.storeFile);

module.exports = router;
