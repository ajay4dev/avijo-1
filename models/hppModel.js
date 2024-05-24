const mongoose = require("mongoose");

const hppScehma = new mongoose.Schema(
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
     verifyStatus : {
        type : Boolean,
        default : false
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

const hpp = mongoose.model("Hpp", hppScehma);

module.exports = hpp;
