const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
    },
    mobileNumber: {
      type: String,
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

const Login = mongoose.model("Register", loginSchema);

module.exports = Login;
