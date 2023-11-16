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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/storage"));
    // cb(
    //   null,
    //   path.join(
    //     "/Users/prabhashvishwakarma/Desktop/SampleProjects/FruitsBazarApis/public/storage"
    //   )
    // );
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});
var upload = multer({ storage });

//User login and register apis
router.post("/register", RegisterRequest(), Auth.registerUser);
router.post("/login", LoginRequest(), Auth.loginUser);
router.post("/sendOtp", SendOTPRequest(), Auth.sendOtp);

// products apis
router.post("/CreateProduct", Product.CreateProduct);
router.get("/GetProducts",Product.GetProducst);

//Cart
router.post("/addCart",verifyToken,Cart.AddCart);

//upload files
router.post("/upload", upload.single("file"), UploadController.storeFile);

module.exports = router;
