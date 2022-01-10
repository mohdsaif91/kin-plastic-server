const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  serviceName: {
    type: String,
    require: true,
  },
  serviceDescription: {
    type: String,
    require: true,
  },
  serviceImage: {
    type: String,
    require: true,
  },
});

const ServiceModal = mongoose.model("service", serviceSchema);

module.exports = ServiceModal;
