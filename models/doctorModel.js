const mongoose = require("mongoose");

const doctorScehma = new mongoose.Schema(
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
    title: { type: String },
    specialization: { type: String },
    experience: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    degree: { type: String },
    collegeUniversity: { type: String },
    year: { type: Number },
    city: { type: String },
    colonyStreetLocality: { type: String },
    country: { type: String },
    pinCode: { type: String },
    state: { type: String },
    registrationNumber: { type: String },
    registrationCouncil: { type: String },
    registrationYear: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Pharmacy = mongoose.model("Doctor", doctorScehma);

module.exports = Pharmacy;
