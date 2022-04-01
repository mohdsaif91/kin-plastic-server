const mongoose = require("mongoose");

const heroImageSchema = mongoose.Schema({
  heroImage: [],
});

const heroImageModal = mongoose.model("heroImage", heroImageSchema);

module.exports = heroImageModal;
