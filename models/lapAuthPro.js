const mongoose = require("mongoose");

const labAuthProfileSchema = new mongoose.Schema(
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

const labAuthProfile = mongoose.model("labAuthProfile", labAuthProfileSchema);

module.exports = labAuthProfile;
