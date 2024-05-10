const mongoose = require("mongoose");

const pharmacyScehma = new mongoose.Schema(
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

const Pharmacy = mongoose.model("pharmacy", pharmacyScehma);

module.exports = Pharmacy;
