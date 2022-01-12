const express = require("express");

const emojis = require("./emojis");
const Auth = require("./Auth");
const router = express.Router();
const setting = require("./Setting");
const Categories = require("./Categories");
const product = require("./Product");
const service = require("./service");
const AboutUs = require("./AboutUs");
const Email = require("./Email");
const Client = require("./Client");

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/aboutus", AboutUs);
router.use("/auth", Auth);
router.use("/category", Categories);
router.use("/client", Client);
router.use("/emojis", emojis);
router.use("/email", Email);
router.use("/product", product);
router.use("/setting", setting);
router.use("/service", service);

module.exports = router;
