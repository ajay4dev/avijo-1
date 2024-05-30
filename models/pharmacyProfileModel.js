const mongoose = require("mongoose");

const pharmacyProfileSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    emailId: {
      type: String,
    },
    mobileNumber: {
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

const PharmacyProfile = mongoose.model(
  "PharmacyProfile",
  pharmacyProfileSchema
);

module.exports = PharmacyProfile;
