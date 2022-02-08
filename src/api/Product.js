const express = require("express");
const multer = require("multer");

const productController = require("../Controller/ProductController");

const storage = multer.memoryStorage({
  destination: function (req, file, callBack) {
    callBack(null, "");
  },
});

const uploadProduct = multer({ storage }).single("productImage");
const Router = express.Router();

Router.post("/", uploadProduct, productController.addController);
Router.get("/", productController.getProduct);
Router.delete("/:deleteId/:productImage", productController.deleteProduct);
Router.get("/getProduct/:catName", productController.getProductByCategory);
Router.get("/getAllProducts", productController.getAllProducts);
Router.post("/addBestProduct", productController.addBestProduct);
Router.get("/bestProduct", productController.getBestProduct);
Router.delete("/:id", productController.deletebestProduct);
Router.get("/:id", productController.getProductById);

module.exports = Router;
