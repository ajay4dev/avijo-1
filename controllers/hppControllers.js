const hppModel = require("../models/hppModel");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../helper/emailOtp");
const { sendOTP } = require("../helper/sendotp");
const jwt = require("jsonwebtoken");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hppAuthCreate = async (req, res) => {
  try {
    const { emailId, mobileNumber, verifyStatus } = req.body;
    if (!emailId || !mobileNumber) {
      return res.status(400).send({
        message: "Please fill all the fields",
      });
    }

    const userExists = await hppModel.findOne({ emailId, mobileNumber });
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
    const newUser = new hppModel({
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

const hppAuthVerify = async (req, res) => {
  try {
    const { emailId, emailOTP, mobileNumber, mobileOTP, fullName, password } =
      req.body;

    // Find the user by emailId and mobileNumber
    const user = await hppModel.findOne({ emailId, mobileNumber });

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

const hppAuthLogin = async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).send({
        message: "Please provide email or mobile number and password",
      });
    }

    // Add logging to debug the input values
    console.log("Login attempt with:", emailOrMobile);

    // Find the user by emailId or mobileNumber
    const user = await hppModel.findOne({
      $or: [
        { emailId: emailOrMobile.toLowerCase() }, // Convert email to lowercase for case insensitive match
        { mobileNumber: emailOrMobile },
      ],
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    console.log("User found:", user);

    if (!user.password) {
      console.error("Error during login: user.password is undefined or null");
      return res.status(500).send({
        message: "Internal server error",
        error: "User password is missing",
      });
    }

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

const hppAuthProfile = async (req, res) => {
  try {
    const {
      businessName,
      fullName,
      emailId,
      mobileNumber,
      companyLegalName,
      gstNo,
      panNo,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
      countryRegion,
      bankAccountName,
      bankAccountNumber,
      ifscCode,
    } = req.body;

    // Validate required fields
    // if (
    //   !businessName ||
    //   !fullName ||
    //   !emailId ||
    //   !mobileNumber ||
    //   !companyLegalName ||
    //   !gstNo ||
    //   !panNo ||
    //   !addressLineNo1 ||
    //   !cityDistrict ||
    //   !pincode ||
    //   !state ||
    //   !countryRegion ||
    //   !bankAccountName ||
    //   !bankAccountNumber ||
    //   !ifscCode
    // ) {
    //   return res.status(400).send({
    //     message: 'All fields are required',
    //   });
    // }

    const newHppProfile = new hppModel({
      businessName,
      fullName,
      emailId,
      mobileNumber,
      companyLegalName,
      gstNo,
      panNo,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
      countryRegion,
      bankAccountName,
      bankAccountNumber,
      ifscCode,
    });

    await newHppProfile.save();

    res.status(200).send({
      message: "Hpp Profile Created Successfully",
      data: newHppProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { hppAuthCreate, hppAuthVerify, hppAuthLogin, hppAuthProfile };
