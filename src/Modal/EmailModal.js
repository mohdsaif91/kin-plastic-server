const mongoose = require("mongoose");

const emailSchema = mongoose.Schema({
  senderName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  message: { type: String, require: true },
  emailDate: {
    type: Date,
    require: true,
    default: new Date(),
  },
});

const EmailModal = mongoose.model("email", emailSchema);

module.exports = EmailModal;
