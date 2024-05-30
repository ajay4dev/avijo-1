const express = require("express");
const {
  registerUser,
  verifyOTP,
  loginUser,
  verifyOTPAndLogin,
} = require("../controllers/registerControllers");
const {
  pharmacyCreate,
  pharmacyVerify,
  pharmacyLogin,
  pharmacyProfile,
  uploadImage,
  getPharmacyProfileById,
  getAllPharmacyProfile,
  pharmacyProfileUpdate,
  pharmacyProfileDelete,
} = require("../controllers/pharmacyControllers");
const {
  doctorCreate,
  doctorLogin,
  doctorVerify,
  doctorProfileCreate,
  getDoctorProfileById,
  getAllDoctorProfileIds,
  doctorProfileUpdate,
  doctorProfileDelete,
} = require("../controllers/doctorControllers");
const adminAuth = require("../admin/authMiddleware");
const multerConfig = require("../config/multerConfig");
const cloudinaryConfig = require("../config/cloudinaryConfig");
const { createContact } = require("../controllers/contact");

const router = express.Router();

// router.post("/login", loginApi)
router.post("/register", registerUser);
router.post("/verify", verifyOTP);
router.post("/login", loginUser);
router.post("/verifyLogin", verifyOTPAndLogin);


//getPharmacyProfileBy Api
router.post("/pharmacyCreate", pharmacyCreate);
router.post("/pharmacyVerify", pharmacyVerify);
router.post("/pharmacyLogin", pharmacyLogin);
router.post("/pharmacyProfile", pharmacyProfile);
router.get("/getPharmacyProfileById", adminAuth, getPharmacyProfileById);
router.get("/getAllPharmacyProfile",adminAuth, getAllPharmacyProfile);
router.put("/pharmacyProfileUpdate", pharmacyProfileUpdate),
router.delete("/pharmacyProfileDelete", pharmacyProfileDelete)


//doctor Api
router.post("/doctorCreate", doctorCreate);
router.post("/doctorVerify", doctorVerify);
router.post("/doctorLogin", doctorLogin);
router.post("/doctorProfile", doctorProfileCreate);
router.get("/getDoctorProfileById", adminAuth,getDoctorProfileById);
router.get("/getAllDoctorProfileIds",adminAuth, getAllDoctorProfileIds);
router.put("/doctorProfileUpdate", doctorProfileUpdate)
router.delete("/doctorProfileDelete", doctorProfileDelete)


router.post("/contact", createContact);

// Configure Cloudinary
cloudinaryConfig();

// Route for uploading an image
router.post("/upload", multerConfig.single("image"), uploadImage);

module.exports = router;
