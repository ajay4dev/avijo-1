const express = require("express");
const {
  labAuthCreate,
  labAuthVerify,
  labAuthLogin,
  labAuthProfile,
} = require("../controllers/labAuthControllers");

const router = express.Router();

router.post("/labAuthCreate", labAuthCreate);
router.post("/labVerifyOTP", labAuthVerify);
router.post("/labAuthLogin", labAuthLogin);
router.post("/labAuthProfile", labAuthProfile)

module.exports = router;
