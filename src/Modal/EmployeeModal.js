const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  employeeName: {
    type: String,
    require: true,
  },
  employeeText: {
    type: String,
    require: true,
  },
  employeeImage: {
    type: String,
    require: true,
  },
});

const employeemodal = mongoose.model("employee", employeeSchema);

module.exports = employeemodal;
