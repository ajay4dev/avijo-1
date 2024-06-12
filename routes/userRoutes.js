const express = require("express");
const {
  registerUser,
  verifyOTP,
  loginUser,
  verifyOTPAndLogin,
  getUserById,
  getAllUserProfile,
} = require("../controllers/registerControllers");

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
router.get("/getUserById/:id", adminAuth, getUserById);
router.get("/getAllUserProfile", adminAuth, getAllUserProfile);

router.post("/contact", createContact);

//Configure Cloudinary
cloudinaryConfig();

// Route for uploading an image
// router.post("/upload", multerConfig.single("image"), uploadImage);

module.exports = router;
