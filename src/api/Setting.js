const express = require("express");

const settingControllerHome = require("../Controller/SettingControllerHome");

const router = express.Router();

router.post("/home", settingControllerHome.createSettingHome);
router.get("/home", settingControllerHome.getSettingHome);
router.get("/homePage", settingControllerHome.getSettinghomePage);

module.exports = router;
