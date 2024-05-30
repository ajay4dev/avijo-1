const pharmacyModel = require("../models/pharmacyModel");
const pharmacyProfileModel = require("../models/pharmacyProfileModel");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../helper/emailOtp");
const { sendOTP } = require("../helper/sendotp");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const pharmacyCreate = async (req, res) => {
  try {
    const { emailId, mobileNumber, verifyStatus } = req.body;
    if (!emailId || !mobileNumber) {
      return res.status(400).send({
        message: "Please fill all the fields",
      });
    }

    const userExists = await pharmacyModel.findOne({ emailId, mobileNumber });
    if (userExists) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    // const hashedPassword = await bcrypt.hash(password, salt);
    const emailOTP = generateOTP();
    const hashedEmailOTP = await bcrypt.hash(emailOTP.toString(), salt);
    await sendOTPEmail(emailId, emailOTP);

    const mobileOTP = generateOTP();
    const hashedMobileOTP = await bcrypt.hash(mobileOTP.toString(), salt);
    await sendOTP(mobileNumber, mobileOTP);

    // Create a new user object with only essential fields
    const newUser = new pharmacyModel({
      // fullName,
      emailId,
      // password: hashedPassword,
      mobileNumber,
      emailOTP: hashedEmailOTP,
      mobileOTP: hashedMobileOTP,
      verifyStatus,
    });

    await newUser.save();

    return res.status(200).send({
      message: "OTP sent for verification",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const pharmacyVerify = async (req, res) => {
  try {
    const { emailId, emailOTP, mobileNumber, mobileOTP, fullName, password } =
      req.body;

    // Find the user by emailId and mobileNumber
    const user = await pharmacyModel.findOne({ emailId, mobileNumber });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const isEmailOTPMatch = await bcrypt.compare(
      emailOTP.toString(),
      user.emailOTP
    );
    const isMobileOTPMatch = await bcrypt.compare(
      mobileOTP.toString(),
      user.mobileOTP
    );

    // Check if the provided OTPs match the ones saved in the database
    if (!isEmailOTPMatch || !isMobileOTPMatch) {
      return res.status(400).send({
        message: "Invalid OTP",
      });
    }

    // Update verifyStatus to true, fullName, and hashed password
    user.verifyStatus = true;
    user.fullName = fullName;
    user.password = await bcrypt.hash(password, 10); // Hash the password before saving

    await user.save();

    return res.status(200).send({
      message: "OTP verified successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const pharmacyLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).send({
        message: "Please provide email or mobile number and password",
      });
    }

    // Add logging to debug the input values
    // console.log('Login attempt with:', emailOrMobile);

    // Find the user by emailId or mobileNumber
    const user = await pharmacyModel.findOne({
      $or: [{ emailId: emailOrMobile }, { mobileNumber: emailOrMobile }],
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    // console.log("User found:", user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Invalid password",
      });
    }

    // Check if the user's email and mobile have been verified
    if (!user.verifyStatus) {
      return res.status(401).send({
        message: "Email or mobile not verified",
      });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      message: "Login successful",
      token: token,
      data: user,
    });
  } catch (error) {
    // Add logging for errors
    console.error("Error during login:", error);

    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const pharmacyProfile = async (req, res) => {
  try {
    const {
      fullName,
      emailId,
      mobileNumber,
      businessName,
      businessTitle,
      drugLicenceNo,
      fssaiLicenceNo,
      gstNo,
      panNo,
      register,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
    } = req.body;

    // if (
    //   !businessName ||
    //   !fullName ||
    //   !emailId ||
    //   !mobileNumber ||
    //   !drugLicenceNo ||
    //   !addressLineNo1 ||
    //   !cityDistrict ||
    //   !pincode ||
    //   !state
    // ) {
    //   return res.status(400).send({
    //     message: "All required fields must be filled",
    //   });
    // }

    const newPharmacyProfile = new pharmacyProfileModel({
      fullName,
      emailId,
      mobileNumber,
      businessName,
      businessTitle,
      drugLicenceNo,
      fssaiLicenceNo,
      gstNo,
      panNo,
      register,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
    });

    await newPharmacyProfile.save();

    res.status(200).send({
      message: "Pharmacy Profile Created Successfully",
      data: newPharmacyProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "pharmacy Auth",
    });

    // Send back the uploaded image URL
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    // If an error occurs, handle it and send an error response
    console.error(error);
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
};

const getPharmacyProfileById = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the Pharmacy profile by ID
    const pharmacyProfile = await pharmacyProfileModel.findById(id);

    if (!pharmacyProfile) {
      return res.status(404).send({
        message: "pharmacy Profile not found",
      });
    }

    res.status(200).send({
      message: "pharmacy Profile Retrieved Successfully",
      data: pharmacyProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllPharmacyProfile = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalPharmacy = await pharmacyProfileModel.countDocuments();
    const totalPages = Math.ceil(totalPharmacy / limit);
    // Fetch all pharmacy profiles from the database
    const pharmacyProfiles = await pharmacyProfileModel
      .find()
      .skip(skip)
      .limit(limit);
    // Extract IDs and other profile details
    // const doctorProfileData = pharmacyProfileModel.map(profile => ({
    //   _id: profile._id,
    //   fullName: profile.fullName,
    //   // Add other profile details here as needed
    // }));

    res.status(200).send({
      message: "pharmacy Profile IDs Retrieved Successfully",
      data: pharmacyProfiles,
      page,
      totalPages,
      totalPharmacy,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const pharmacyProfileUpdate = async (req , res) => {
  try {
    const {
      id,
      fullName,
      emailId,
      mobileNumber,
      businessName,
      businessTitle,
      drugLicenceNo,
      fssaiLicenceNo,
      gstNo,
      panNo,
      register,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
     } = req.body;
     const pharmacyProfile = await pharmacyProfileModel.findByIdAndUpdate(id , {
      fullName,
      emailId,
      mobileNumber,
      businessName,
      businessTitle,
      drugLicenceNo,
      fssaiLicenceNo,
      gstNo,
      panNo,
      register,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
     } , {new : true});
     res.status(200).send({
      message: "Pharmacy Profile Updated Successfully",
      data: pharmacyProfile,
    }) 
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const pharmacyProfileDelete = async (req, res) => {
  try {
    const { id } = req.body;
    const  pharmacyProfile  = await pharmacyProfileModel.findByIdAndDelete(id);
    if(!pharmacyProfile) {
      return res.status(404).send({
        message: "Hpp Profile not found",
      })
    }
    res.status(200).send({
      message: "Hpp Profile Deleted Successfully",
      data: pharmacyProfile,
    }) 
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  pharmacyCreate,
  pharmacyVerify,
  pharmacyLogin,
  pharmacyProfile,
  getPharmacyProfileById,
  getAllPharmacyProfile,
  pharmacyProfileUpdate,
  pharmacyProfileDelete,
  uploadImage,
};
