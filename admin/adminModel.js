// Define the schema
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"], // Regex for email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Ensuring password is at least 6 characters long
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
