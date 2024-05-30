const labAuthModel = require("../models/labAuth");
const labAutProfilehModel = require("../models/lapAuthPro");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../helper/emailOtp");
const { sendOTP } = require("../helper/sendotp");
const jwt = require("jsonwebtoken");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const labAuthCreate = async (req, res) => {
  try {
    const { emailId, mobileNumber, verifyStatus } = req.body;
    if (!emailId || !mobileNumber) {
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

    // const hashedPassword = await bcrypt.hash(password, salt);

    const emailOTP = generateOTP();
    const hashedEmailOTP = await bcrypt.hash(emailOTP.toString(), salt);
    await sendOTPEmail(emailId, emailOTP);

    const mobileOTP = generateOTP();
    const hashedMobileOTP = await bcrypt.hash(mobileOTP.toString(), salt);
    await sendOTP(mobileNumber, mobileOTP);

    // Create a new user object with only essential fields
    const newUser = new labAuthModel({
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

const labAuthVerify = async (req, res) => {
  try {
    const { emailId, emailOTP, mobileNumber, mobileOTP, fullName, password } =
      req.body;

    // Find the user by emailId and mobileNumber
    const user = await labAuthModel.findOne({ emailId, mobileNumber });

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

const labAuthLogin = async (req, res) => {
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
    const user = await labAuthModel.findOne({
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
    // if (
    //   !businessName ||
    //   !fullName ||
    //   !emailId ||
    //   !mobileNumber ||
    //   !addressLineNo1 ||
    //   !cityDistrict ||
    //   !pincode ||
    //   !state
    // ) {
    //   return res.status(400).send({
    //     message: "All required fields must be provided",
    //   });
    // }

    // Create a new LabAuth document
    const newLabAuth = new labAutProfilehModel({
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

const getLapProfileById = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the lab profile by ID
    const labProfile = await labAutProfilehModel.findById(id);

    if (!labProfile) {
      return res.status(404).send({
        message: "lap Profile not found",
      });
    }

    res.status(200).send({
      message: "lap Profile Retrieved Successfully",
      data: labProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllLapProfile = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalLap = await labAutProfilehModel.countDocuments();
    const totalPages = Math.ceil(totalLap / limit);
    // Fetch all doctor profiles from the database
    const lapProfiles = await labAutProfilehModel.find().skip(skip).limit(limit);
    // Extract IDs and other profile details
    // const doctorProfileData = doctorProfiles.map(profile => ({
    //   _id: profile._id,
    //   fullName: profile.fullName,
    //   // Add other profile details here as needed
    // }));

    res.status(200).send({
      message: "Lap Profile IDs Retrieved Successfully",
      data: lapProfiles,
      page,
      totalPages,
      totalLap,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const labAuthProfileUpdate = async (req , res) =>  {
  try {
    const {
      id , 
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
    const updateLapAuth = await labAutProfilehModel.findByIdAndUpdate(id , {
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
    }, { new: true});

    res.status(200).send({
      message: "lap Auth Profile Updated Successfully",
      data: updateLapAuth,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const lapAuthProfileDelete = async (req, res) => {
  try {
    const { id } = req.body;
    const  deletedLapAuthProfile  = await labAutProfilehModel.findByIdAndDelete(id);
    if(!deletedLapAuthProfile) {
      return res.status(404).send({
        message: "Lap Auth Profile not found",
      })
    }
    res.status(200).send({
      message: "Lap Auth Profile Deleted Successfully",
      data: deletedLapAuthProfile,
    }) 
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
  getLapProfileById, 
  getAllLapProfile,
  labAuthProfileUpdate,
  lapAuthProfileDelete
};
