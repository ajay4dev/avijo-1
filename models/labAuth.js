const mongoose = require("mongoose");

const labAuthScehma = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    emailId: {
      type: String,
    },
    password: {
      type: String,
    },
    mobileNumber: {
      type: String,
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
    businessName: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    panNo: {
      type: String,
    },
    register: {
      type: String,
      enum: ["ucs", "nonGstRegistered"],
    },
    addressLineNo1: {
      type: String,
    },
    addressLineNo2: {
      type: String,
    },
    cityDistrict: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    state: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const labAuth = mongoose.model("labAuth", labAuthScehma);

module.exports = labAuth;
