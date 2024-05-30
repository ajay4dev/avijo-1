const adminModel = require('./adminModel');
const doctorProfileModel = require("../models/doctorProfile");
const hppProfileModel = require("../models/hppProfile");
const labAutProfilehModel = require("../models/lapAuthPro")
const pharmacyProfileModel = require("../models/pharmacyProfileModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminCreate = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({
      emailId,
      password: hashedPassword,
    });

    await newAdmin.save();
    return res.status(201).send({
      message: 'Admin created successfully',
      data: newAdmin,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const adminUser = await adminModel.findOne({ emailId });

    if (!adminUser) {
      return res.status(404).send({
        message: 'Admin not found',
      });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (!isMatch) {
      return res.status(401).send({
        message: 'Invalid password',
      });
    }

    const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.status(200).send({
      message: 'Login successful',
      token,
      data: adminUser,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};

const totalProfile = async (req, res) => {
  try {
    const totalDoctors = await doctorProfileModel.countDocuments();
    const totalHpp = await hppProfileModel.countDocuments();
    const totalLap = await labAutProfilehModel.countDocuments();
    const totalPharmacy = await pharmacyProfileModel.countDocuments();
    // Send the response with the counts
    return res.status(200).send({
      message: "Profile counts retrieved successfully",
      totalDoctors,
      totalHpp,
      totalLap, 
      totalPharmacy
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  adminCreate,
  adminLogin,
  totalProfile
};
