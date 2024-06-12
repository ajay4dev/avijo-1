const express = require("express");
const {
  labAuthCreate,
  labAuthVerify,
  labAuthLogin,
  labAuthProfile,
  getLapProfileById,
  getAllLapProfile,
  labAuthProfileUpdate,
  lapAuthProfileDelete,
  forgetPassword,
  resetPassword,
} = require("../controllers/labAuthControllers");
const adminAuth = require("../admin/authMiddleware");


const router = express.Router();

router.post("/labAuthCreate", labAuthCreate);
router.post("/labVerifyOTP", labAuthVerify);
router.post("/labAuthLogin", labAuthLogin);
router.post("/labAuthProfile", labAuthProfile);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:id",  resetPassword);
router.get("/getById/:id",adminAuth, getLapProfileById);
router.get("/getAllApi", adminAuth,getAllLapProfile);
router.put("/labAuthProfileUpdate/:id",adminAuth, labAuthProfileUpdate);
router.delete("/lapAuthProfileDelete/:id",adminAuth, lapAuthProfileDelete)

module.exports = router;
