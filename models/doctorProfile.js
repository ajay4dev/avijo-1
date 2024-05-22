const mongoose = require("mongoose");

// Define schema
const doctorProfileSchema = new mongoose.Schema({
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
});

// Create model
const doctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);

module.exports = doctorProfile;
