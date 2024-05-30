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
} = require("../controllers/labAuthControllers");
const adminAuth = require("../admin/authMiddleware");


const router = express.Router();

router.post("/labAuthCreate", labAuthCreate);
router.post("/labVerifyOTP", labAuthVerify);
router.post("/labAuthLogin", labAuthLogin);
router.post("/labAuthProfile", labAuthProfile);
router.get("/getById",adminAuth, getLapProfileById);
router.get("/getAllApi", adminAuth,getAllLapProfile);
router.put("/labAuthProfileUpdate", labAuthProfileUpdate);
router.delete("/lapAuthProfileDelete", lapAuthProfileDelete)

module.exports = router;
