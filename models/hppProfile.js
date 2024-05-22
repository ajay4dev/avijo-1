const mongoose = require("mongoose");

const hppProfileSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
    },

    yourName: {
      type: String,
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },
    companyLegalName: {
      type: String,
    },
    gstNo: {
      type: String,
    },
    panNo: {
      type: String,
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
    countryRegion: {
      type: String,
    },
    bankAccountName: {
      type: String,
    },
    bankAccountNumber: {
      type: String,
    },
    IfscCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const hppProfile = mongoose.model("hppProfile", hppProfileSchema);

module.exports = hppProfile;
