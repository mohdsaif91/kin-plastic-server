const express = require("express");
const multer = require("multer");

const settingControllerHome = require("../Controller/SettingControllerHome");

const storage = multer.memoryStorage({
  destination: (req, file, callBack) => {
    callBack(null, "");
  },
});

const heroStorage = multer({ storage }).single("heroImage");

const router = express.Router();

router.post("/home", settingControllerHome.createSettingHome);
router.get("/home", settingControllerHome.getSettingHome);
router.get("/homePage", settingControllerHome.getSettinghomePage);
router.post("/heroImage", heroStorage, settingControllerHome.addHeroImage);
router.delete("/heroImage/:imageId", settingControllerHome.removeHeroImage);

module.exports = router;
