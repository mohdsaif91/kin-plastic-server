const express = require("express");
const multer = require("multer");

const AboutUscontroller = require("../Controller/AboutUsController");

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const uploadOwner = multer({ storage }).single("ownerImage");
const uploadEmployee = multer({ storage }).single("employeeImage");

const router = express.Router();

router.post("/owner", uploadOwner, AboutUscontroller.addUpdateOwner);
router.get("/owner", AboutUscontroller.getOwnerData);
router.post("/employee", uploadEmployee, AboutUscontroller.addEmployee);
router.get("/employee", AboutUscontroller.getEmployee);
router.put(
  "/employee/update",
  uploadEmployee,
  AboutUscontroller.updateEmployee
);
router.delete("/employee/:id/:imageName", AboutUscontroller.deleteEmployee);
router.put("/organasation", AboutUscontroller.updateOganisation);
router.get("/organisation", AboutUscontroller.getOrganisationData);
router.get("/organisationOwner", AboutUscontroller.getOrganisationOwner);
router.post("/socialMedia", AboutUscontroller.addSocialMedia);

module.exports = router;
