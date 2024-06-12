const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  facebookId: String,
  email: String,
});

module.exports = mongoose.model("gooUser", userSchema);
