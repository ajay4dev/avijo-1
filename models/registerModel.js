const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the login schema
const loginSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Login = mongoose.model("Login", loginSchema);

module.exports = Login;
