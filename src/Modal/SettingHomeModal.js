const mongoose = require("mongoose");

const settingHomeSchema = mongoose.Schema({
  homeHeroColor: {
    require: true,
    type: String,
  },
  paralexData: [],
  card1: {
    heading: {
      type: String,
    },
    subHeading: {
      type: String,
    },
  },
  card2: {
    heading: {
      type: String,
    },
    subHeading: {
      type: String,
    },
  },
  card3: {
    heading: {
      type: String,
    },
    subHeading: {
      type: String,
    },
  },
  quotes: {
    type: String,
  },
  videoCode: {
    type: String,
  },
  name: {
    type: String,
  },
});

const settingHomeModal = mongoose.model("setting", settingHomeSchema);

module.exports = settingHomeModal;
