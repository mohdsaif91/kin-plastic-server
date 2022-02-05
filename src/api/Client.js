const express = require("express");
const multer = require("multer");

const router = express.Router();

const ClientController = require("../Controller/ClientController");

const storage = multer.memoryStorage({
  destination: function (req, file, callBack) {
    callBack(null, "");
  },
});

const uploadClient = multer({ storage }).single("clientImage");
const editClient = multer({ storage }).single("clientImage");

router.post("/", uploadClient, ClientController.addClient);
router.get("/", ClientController.getClient);
router.put("/", editClient, ClientController.editClient);
router.delete("/:id/:imageName", ClientController.deleteClient);

module.exports = router;
