const express = require("express");
const {
  hppAuthCreate,
  hppAuthVerify,
  hppAuthLogin,
  hppAuthProfile,
  getHppProfileById,
  getAllHppProfile,
  hppProfileUpdate,
  hppProfileDelete,
  forgetPassword,
  resetPassword,
} = require("../controllers/hppControllers");
const adminAuth = require("../admin/authMiddleware");

const router = express.Router();

router.post("/hppAuthCreate", hppAuthCreate);
router.post("/hppVerifyOTP", hppAuthVerify);
router.post("/hppAuthLogin", hppAuthLogin);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:id", resetPassword);
router.post("/hppAuthProfile", hppAuthProfile);
router.get("/getById/:id", getHppProfileById);
router.get("/getAllApi", adminAuth, getAllHppProfile);
router.put("/hppProfileUpdate/:id", adminAuth, hppProfileUpdate);
router.delete("/deleteProfileUpdate/:id", adminAuth, hppProfileDelete);

module.exports = router;
