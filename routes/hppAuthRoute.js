const express = require("express");
const { hppAuthCreate, hppAuthVerify, hppAuthLogin, hppAuthProfile } = require("../controllers/hppControllers");


const router = express.Router();

router.post("/hppAuthCreate", hppAuthCreate);
router.post("/hppVerifyOTP", hppAuthVerify);
router.post("/hppAuthLogin", hppAuthLogin);
router.post("/hppAuthProfile", hppAuthProfile)

module.exports = router;
