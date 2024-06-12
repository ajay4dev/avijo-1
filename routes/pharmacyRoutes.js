const express = require("express");

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
  forgetPassword,
  resetPassword,
} = require("../controllers/pharmacyControllers");

const adminAuth = require("../admin/authMiddleware");
const multerConfig = require("../config/multerConfig");
const cloudinaryConfig = require("../config/cloudinaryConfig");
const router = express.Router();

//getPharmacyProfileBy Api
router.post("/pharmacyCreate", pharmacyCreate);
router.post("/pharmacyVerify", pharmacyVerify);
router.post("/pharmacyLogin", pharmacyLogin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:id", resetPassword);
router.post("/pharmacyProfile", pharmacyProfile);
router.get("/getPharmacyProfileById/:id", adminAuth, getPharmacyProfileById);
router.get("/getAllPharmacyProfile", adminAuth, getAllPharmacyProfile);
router.put("/pharmacyProfileUpdate/:id", adminAuth, pharmacyProfileUpdate),
  router.delete("/pharmacyProfileDelete/:id", adminAuth, pharmacyProfileDelete);

module.exports = router;
