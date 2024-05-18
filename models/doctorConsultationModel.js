// models/Doctor.js
const mongoose = require('mongoose');

const doctorConsultationModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, ref: 'Speciality', required: true },
  symptoms : {type : String},
  healthProblems : {type : String},
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
});

const doctorConsultation = mongoose.model('doctorConsultation', doctorConsultationModelSchema);

module.exports = doctorConsultation;
