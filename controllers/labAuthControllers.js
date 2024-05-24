const labAuthModel = require("../models/labAuth");
const labAuthProfileModel = require("../models/lapAuthPro");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../helper/emailOtp");
const { sendOTP } = require("../helper/sendotp");
const jwt = require("jsonwebtoken");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const labAuthCreate = async (req, res) => {
  try {
    const { fullName, emailId, password, mobileNumber, verifyStatus } =
      req.body;
    if (!fullName || !emailId || !password || !mobileNumber) {
      return res.status(400).send({
        message: "Please fill all the fields",
      });
    }

    const userExists = await labAuthModel.findOne({ emailId, mobileNumber });
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
    const newUser = new labAuthModel({
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

const labAuthVerify = async (req, res) => {
  try {
    const { emailId, emailOTP, mobileNumber, mobileOTP } = req.body;

    // Find the user by emailId and mobileNumber
    const user = await labAuthModel.findOne({ emailId, mobileNumber });
    console.log(user);

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

const labAuthLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).send({
        message: "Please provide email and password",
      });
    }

    const user = await labAuthModel.findOne({ emailId });
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
const labAuthProfile = async (req, res) => {
  try {
    const {
      businessName,
      fullName, 
      emailId,   
      mobileNumber,  
      gstNo,
      panNo,
      register,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
    } = req.body;    
    // Validate required fields
    if (
      !businessName ||
      !fullName ||
      !emailId ||
      !mobileNumber ||
      !addressLineNo1 ||
      !cityDistrict ||
      !pincode ||
      !state
    ) {
      return res.status(400).send({
        message: "All required fields must be provided",
      });
    }

    // Create a new LabAuth document
    const newLabAuth = new labAuthModel({
      businessName,
      fullName,
      emailId,
      mobileNumber,
      gstNo,
      panNo,
      register,
      addressLineNo1,
      addressLineNo2,
      cityDistrict,
      pincode,
      state,
    });
    // Save the document to the database
    await newLabAuth.save();

    res.status(200).send({
      message: "Lab Profile Created Successfully",
      data: newLabAuth,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  labAuthCreate,
  labAuthVerify,
  labAuthLogin,
  labAuthProfile,
};
