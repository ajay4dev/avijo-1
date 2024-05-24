const doctorModel = require("../models/doctorModel");
const doctorProfileModel = require("../models/doctorProfile");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../helper/emailOtp");
const { sendOTP } = require("../helper/sendotp");
const jwt = require("jsonwebtoken");

// const cloudinary = require('../config/cloudinaryConfig');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const doctorCreate = async (req, res) => {
  try {
    const { fullName, emailId, password, mobileNumber , verifyStatus} = req.body;
    if (!fullName || !emailId || !password || !mobileNumber) {
      return res.status(400).send({
        message: "Please fill all the fields",
      });
    }

    const userExists = await doctorModel.findOne({ emailId, mobileNumber });
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
    const hashedMobileOTP = await bcrypt.hash(mobileOTP.toString(), salt)
    await sendOTP(mobileNumber, mobileOTP);

    // Create a new user object with only essential fields
    const newUser = new doctorModel({
      fullName,
      emailId,
      password: hashedPassword,
      mobileNumber,
      emailOTP : hashedEmailOTP,
      mobileOTP : hashedMobileOTP,
      verifyStatus
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
// const doctorVerify = async (req, res) => {
//   try {
//     const { emailOTP, mobileOTP } = req.body;

//     const user = await pharmacyModel.findOneAndUpdate(
//       { emailOTP, mobileOTP },
//       { $set: { emailVerified: true, mobileVerified: true } },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(400).send({
//         message: "Invalid OTPs",
//       });
//     }

//     return res.status(200).send({
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const doctorVerify = async (req, res) => {
  try {
    const { emailId, emailOTP, mobileNumber, mobileOTP } = req.body;

    // Find the user by emailId and mobileNumber
    const user = await doctorModel.findOne({ emailId, mobileNumber });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const isEmailOTPMatch = await bcrypt.compare(emailOTP.toString(), user.emailOTP);
    const isMobileOTPMatch = await bcrypt.compare(mobileOTP.toString(), user.mobileOTP)

    // Check if the provided OTPs match the ones saved in the database
    if ( !isEmailOTPMatch || !isMobileOTPMatch) {
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

const doctorLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).send({
        message: "Please provide email and password",
      });
    }

    const user = await doctorModel.findOne({ emailId });
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

const doctorProfileCreate = async (req, res) => {
  try {
    const {
      title,
      specialization,
      experience,
      gender,
      dateOfBirth,
      degree,
      collegeUniversity,
      year,
      city,
      colonyStreetLocality,
      country,
      pinCode,
      state,
      registrationNumber,
      registrationCouncil,
      registrationYear,
    } = req.body;

    if (
      !title ||
      !specialization ||
      !experience ||
      !gender ||
      !dateOfBirth ||
      !degree ||
      !collegeUniversity ||
      !year ||
      !city ||
      !colonyStreetLocality ||
      !country ||
      !pinCode ||
      !state ||
      !registrationNumber ||
      !registrationCouncil ||
      !registrationYear
    ) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }
    const newPharmacyProfile = new doctorModel({
      title,
      specialization,
      experience,
      gender,
      dateOfBirth,
      degree,
      collegeUniversity,
      year,
      city,
      colonyStreetLocality,
      country,
      pinCode,
      state,
      registrationNumber,
      registrationCouncil,
      registrationYear,
    });

    await newPharmacyProfile.save();

    res.status(200).send({
      message: "Doctor Profile Created Successfully",
      data: newPharmacyProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const doctorImage = async (req, res) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctor Auth",
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
  doctorCreate,
  doctorVerify,
  doctorLogin,
  doctorProfileCreate,
  doctorImage
};
