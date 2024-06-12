const express = require("express");
const {
  doctorCreate,
  doctorLogin,
  doctorVerify,
  doctorProfileCreate,
  getDoctorProfileById,
  getAllDoctorProfileIds,
  doctorProfileUpdate,
  doctorProfileDelete,
  forgetPassword,
  resetPassword,
} = require("../controllers/doctorControllers");
const adminAuth = require("../admin/authMiddleware");
const multerConfig = require("../config/multerConfig");
const cloudinaryConfig = require("../config/cloudinaryConfig");
const router = express.Router();

//doctor Api
router.post("/doctorCreate", doctorCreate);
router.post("/doctorVerify", doctorVerify);
router.post("/doctorLogin", doctorLogin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:id", resetPassword);
router.post("/doctorProfile", doctorProfileCreate);
router.get("/getDoctorProfileById/:id", adminAuth, getDoctorProfileById);
router.get("/getAllDoctorProfileIds", adminAuth, getAllDoctorProfileIds);
router.put("/doctorProfileUpdate/:id", adminAuth, doctorProfileUpdate);
router.delete("/doctorProfileDelete/:id", adminAuth, doctorProfileDelete);

module.exports = router;
