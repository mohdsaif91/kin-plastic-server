const mongoose = require("mongoose");

const clientModal = mongoose.Schema({
  clientImage: {
    type: String,
    require: true,
  },
  clientName: {
    type: String,
    require: true,
  },
});

const clientSchema = mongoose.model("client", clientModal);

module.exports = clientSchema;
