const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  interestedIn: { type: String },
  name: { type: String },
  email: { type: String },
  country: { type: String },
  city: { type: String },
  message: { type: String },
  mobileNummber: { type: String },
});

module.exports = mongoose.model("Contact", contactSchema);
