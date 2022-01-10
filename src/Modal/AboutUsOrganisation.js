const mongoose = require("mongoose");

const aboutusOrganisationSchema = mongoose.Schema({
  longStory: "",
  shortStory: "",
  locationContact: [],
  emailIds: [],
});

const aboutUsOrganisationModal = mongoose.model(
  "aboutusorganisation",
  aboutusOrganisationSchema
);

module.exports = aboutUsOrganisationModal;
