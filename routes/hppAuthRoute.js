const express = require("express");
const { hppAuthCreate, hppAuthVerify, hppAuthLogin, hppAuthProfile, getHppProfileById, getAllHppProfile, hppProfileUpdate, hppProfileDelete } = require("../controllers/hppControllers");
const adminAuth = require("../admin/authMiddleware");


const router = express.Router();

router.post("/hppAuthCreate", hppAuthCreate);
router.post("/hppVerifyOTP", hppAuthVerify);
router.post("/hppAuthLogin", hppAuthLogin);
router.post("/hppAuthProfile", hppAuthProfile);
router.get("/getById", adminAuth, getHppProfileById);
router.get("/getAllApi", adminAuth, getAllHppProfile);
router.put("/hppProfileUpdate", hppProfileUpdate );
router.delete("/deleteProfileUpdate", hppProfileDelete);


module.exports = router;
