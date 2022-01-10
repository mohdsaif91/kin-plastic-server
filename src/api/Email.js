const express = require("express");

const EmailController = require("../Controller/EmailController");

const router = express.Router();

router.post("/inquery", EmailController.sendInquery);
router.get("/inquery", EmailController.getEmail);

module.exports = router;
