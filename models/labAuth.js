const mongoose = require("mongoose");

const labAuthScehma = new mongoose.Schema(
  {
    fullName: {
      type: String,
      default: false,
    },
    emailId: {
      type: String,
      default: false,
    },
    password: {
      type: String,
      default: false,
    },
    mobileNumber: {
      type: String,
      default: false,
    },
    verifyStatus: {
      type: Boolean,
      default: false,
    },
    emailOTP: {
      type: String,
    },
    mobileOTP: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const labAuth = mongoose.model("labAuth", labAuthScehma);

module.exports = labAuth;
