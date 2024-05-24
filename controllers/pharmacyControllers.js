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

// const pharmacyCreate = async (req, res) => {
//   try {
//     const { fullName, emailId, password, mobileNumber, emailOTP, mobileOTP } = req.body;

//     // Check if all required fields are provided
//     if (!fullName || !emailId || !password || !mobileNumber) {
//       return res.status(400).send({
//         message: "Please fill all the fields",
//       });
//     }

//     // Check if user with the same email already exists
//     // const existingUser = await pharmacyModel.findOne({ emailId });
//     // if (existingUser) {
//     //   return res.status(400).send({
//     //     message: "User already exists",
//     //   });
//     // }

//     // Generate salt and hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Generate OTP for email verification
//     const emailVerificationOTP = generateOTP();
//     await sendOTPEmail(emailId, emailVerificationOTP);

//     // Generate OTP for mobile verification
//     const mobileVerificationOTP = generateOTP();
//     await sendOTP(mobileNumber, mobileVerificationOTP);

//     // Create new user instance
//     const newUser = new pharmacyModel({
//       fullName,
//       emailId,
//       password: hashedPassword,
//       mobileNumber,
//       emailOTP: emailVerificationOTP,
//       mobileOTP: mobileVerificationOTP
//     });

//     // Save the new user to the database
//     await newUser.save();

//     return res.status(200).send({
//       message: "User created successfully",
//       data: newUser,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const pharmacyCreate = async (req, res) => {
  try {
    const { fullName, emailId, password, mobileNumber, verifyStatus } =
      req.body;
    if (!fullName || !emailId || !password || !mobileNumber) {
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

    const hashedPassword = await bcrypt.hash(password, salt);

    const emailOTP = generateOTP();
    const hashedEmailOTP = await bcrypt.hash(emailOTP.toString(), salt);
    await sendOTPEmail(emailId, emailOTP);

    const mobileOTP = generateOTP();
    const hashedMobileOTP = await bcrypt.hash(mobileOTP.toString(), salt);
    await sendOTP(mobileNumber, mobileOTP);

    // Create a new user object with only essential fields
    const newUser = new pharmacyModel({
      fullName,
      emailId,
      password: hashedPassword,
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

// const pharmacyVerify = async (req, res) => {
//   try {
//     const { emailId, mobileNumber, emailOTP, mobileOTP } = req.body;

//     // Verify email OTP
//     const isEmailOTPVerified = await verifyAndDeleteEmailOTP(emailId, emailOTP);

//     // Verify mobile OTP
//     const isMobileOTPVerified = await verifyAndDeleteMobileOTP(mobileNumber, mobileOTP);

//     if (isEmailOTPVerified && isMobileOTPVerified) {
//       // Both OTPs are verified
//       return res.status(200).send({
//         message: "OTP verification successful",
//       });
//     } else {
//       // If either OTP verification fails
//       return res.status(400).send({
//         message: "OTP verification failed",
//       });
//     }
//   } catch (error) {
//     return res.status(500).send({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const pharmacyVerify = async (req, res) => {
  try {
    const { emailId, emailOTP, mobileNumber, mobileOTP } = req.body;

    // Find the user by emailId and mobileNumber
    const user = await pharmacyModel.findOne({ emailId, mobileNumber });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

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

    // Update verifyStatus to true
    user.verifyStatus = true;
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
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).send({
        message: "Please provide email and password",
      });
    }

    const user = await pharmacyModel.findOne({ emailId });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Invalid password",
      });
    }

    // if (!user.emailVerified || !user.mobileVerified) {
    //   return res.status(401).send({
    //     message: "Email or mobile not verified",
    //   });
    // }

    // You can generate a JWT token here for authentication
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      message: "Login successful",
      token: token,
      data: user,
    });
  } catch (error) {
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

    if (
      !businessName ||
      !fullName || 
      !emailId || 
      !mobileNumber || 
      !drugLicenceNo || 
      !addressLineNo1 ||
      !cityDistrict ||
      !pincode ||
      !state
    ) {
      return res.status(400).send({
        message: "All required fields must be filled",
      });
    }

    const newPharmacyProfile = new pharmacyModel({
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

module.exports = {
  pharmacyCreate,
  pharmacyVerify,
  pharmacyLogin,
  pharmacyProfile,
  uploadImage,
};
