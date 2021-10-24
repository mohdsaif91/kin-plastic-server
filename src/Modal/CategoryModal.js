const mongoose = require("mongoose");

const CategoryModal = mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
  count: {
    type: Number,
    require: true,
    default: 0,
  },
});

const categorySchema = mongoose.model("category", CategoryModal);

module.exports = categorySchema;
