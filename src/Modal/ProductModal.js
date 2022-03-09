const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  application: {
    type: String,
    require: true,
  },
  categoryName: {
    type: String,
    require: true,
  },
  design: {
    type: String,
    require: true,
  },
  nominalDiameter: {
    type: String,
    require: true,
  },
  productDescription: {
    type: String,
    require: true,
  },
  productImage: {
    type: String,
    require: true,
  },
  productName: {
    type: String,
    require: true,
  },
  process: {
    type: String,
    require: true,
  },
  shellMatrial: {
    type: String,
    require: true,
  },
  shellWeight: {
    type: String,
    require: true,
  },
  temperature: {
    type: String,
  },
});

const productModal = mongoose.model("products", productSchema);

module.exports = productModal;
