const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String },
  jobId: { type: String },
  companyName: { type: String },
  jobLocation: { type: String },
  description: { type: String },
  basicQualification: { type: String },
  preferredQualification: { type: String },
  jobRole: { type: String },
  dateOfCreate: { type: Date, default: Date.now },
  updateJob: { type: Date },
  jobType: { type: String },
  jobCategory: { type: String },
  country: { type: String },
  state: { type: String },
  team: { type: String },
  roleType: { type: String },
});

const careerJob = mongoose.model("Career", jobSchema);

module.exports = careerJob;
