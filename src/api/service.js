const express = require("express");
const multer = require("multer");

const ServiceController = require("../Controller/ServiceController");

const storage = multer.memoryStorage({
  destination: function (req, file, callBack) {
    callBack(null, "");
  },
});

const uploadService = multer({ storage }).single("serviceImage");
const Router = express.Router();

Router.post("/", uploadService, ServiceController.addService);
Router.get("/", ServiceController.getServices);

module.exports = Router;
