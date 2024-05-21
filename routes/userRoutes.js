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
} = require("../controllers/pharmacyControllers");
const {
  doctorCreate,
  doctorLogin,
  doctorVerify,
  doctorProfileCreate,
} = require("../controllers/doctorControllers");
const multerConfig = require("../config/multerConfig");
const cloudinaryConfig = require("../config/cloudinaryConfig");

const router = express.Router();

// router.post("/login", loginApi)

router.post("/register", registerUser);
router.post("/verify", verifyOTP);
router.post("/login", loginUser);
router.post("/verifyLogin", verifyOTPAndLogin);




router.post("/pharmacyCreate", pharmacyCreate);
router.post("/pharmacyVerify", pharmacyVerify);
router.post("/pharmacyLogin", pharmacyLogin);
router.post("/pharmacyProfile", pharmacyProfile);

router.post("/doctorCreate", doctorCreate);
router.post("/doctorVerify", doctorVerify);
router.post("/doctorLogin", doctorLogin);
router.post("/doctorProfile", doctorProfileCreate);

// Configure Cloudinary
cloudinaryConfig();

// Route for uploading an image
router.post("/upload", multerConfig.single("image"), uploadImage);


module.exports = router;
