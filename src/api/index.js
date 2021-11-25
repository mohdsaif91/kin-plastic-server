const express = require("express");

const emojis = require("./emojis");
const Auth = require("./Auth");
const router = express.Router();
const setting = require("./Setting");
const Categories = require("./Categories");
const product = require("./Product");

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/auth", Auth);
router.use("/setting", setting);
router.use("/category", Categories);
router.use("/product", product);

module.exports = router;
