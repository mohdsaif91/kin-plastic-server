const mongoose = require("mongoose");

const aboutUsmodal = mongoose.Schema({
  ownerName: { type: String },
  ownerText: { type: String },
  ownerImageName: { type: String },
  employee: { type: [] },
  shortStory: { type: String },
  longStory: { type: String },
});

const aboutUsSchema = mongoose.model("aboutUs", aboutUsmodal);

module.exports = aboutUsSchema;
