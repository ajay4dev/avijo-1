const { sendOTP } = require("../helper/sendotp");
const register = require("../models/registerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const registerUser = async (req, res) => {
//   try {
//     const { fullName, email, dateOfBirth, mobileNumber } = req.body;

//     const existingUser = await register.findOne({ mobileNumber });

//     if (existingUser) {
//       const loginOTP = Math.floor(100000 + Math.random() * 900000);
//       const hashOTP = await bcrypt.hash(loginOTP.toString(), 10);
//       existingUser.otp = hashOTP;
//       await existingUser.save();

//       await sendOTP(mobileNumber, loginOTP);

//       return res
//         .status(200)
//         .json({ success: true, message: "Login successful" });
//     } else {
//       const registrationOTP = Math.floor(100000 + Math.random() * 900000);
//       const hashOTP = await bcrypt.hash(registrationOTP.toString(), 10);

//       const newUser = new register({
//         fullName,
//         email,
//         dateOfBirth,
//         mobileNumber,
//         otp: hashOTP,
//       });

//       await newUser.save();

//       await sendOTP(mobileNumber, registrationOTP);

//       return res.status(200).json({
//         success: true,
//         message: "User registered successfully",
//         data: newUser,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

const registerUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    // Check for existing user with the same mobile number
    const existingUser = await register.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // Generate and hash the OTP
    const registrationOTP = Math.floor(100000 + Math.random() * 900000);
    const hashOTP = await bcrypt.hash(registrationOTP.toString(), 10);

    // Create the new user object
    const newUser = new register({
      mobileNumber,
      otp: hashOTP,
    });

    // Save the new user to the database
    await newUser.save();

    // Send the OTP to the user's mobile number
    await sendOTP(mobileNumber, registrationOTP);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate value for field: ${field}`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const existingUser = await register.findOne({ mobileNumber });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register.",
      });
    }

    const loginOTP = Math.floor(100000 + Math.random() * 900000);
    const hashOTP = await bcrypt.hash(loginOTP.toString(), 10);
    existingUser.otp = hashOTP;
    await existingUser.save();

    await sendOTP(mobileNumber, loginOTP);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
const verifyOTP = async (req, res) => {
  try {
    const { fullName, email, dateOfBirth, mobileNumber, otp } = req.body;

    const user = await register.findOne({ mobileNumber });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided OTP with the hashed OTP stored in the database
    const isOTPMatch = await bcrypt.compare(otp.toString(), user.otp);

    if (isOTPMatch) {
      // OTP verified, update user details
      user.fullName = fullName;
      user.email = email;
      user.dateOfBirth = dateOfBirth;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "OTP verification successful",
        data: user,
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const verifyOTPAndLogin = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    const existingUser = await register.findOne({ mobileNumber });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register.",
      });
    }

    const isOTPValid = await bcrypt.compare(otp, existingUser.otp);

    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id, mobileNumber: existingUser.mobileNumber },
      process.env.JWT_SECRET_KEY, // Use an environment variable for the secret key
      { expiresIn: "1h" } // Token expiration time
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the User profile by ID
    const userProfile = await register.findById(id);

    if (!userProfile) {
      return res.status(404).send({
        message: "User Profile not found",
      });
    }

    res.status(200).send({
      message: "User Profile Retrieved Successfully",
      data: userProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const getAllUserProfile = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUser = await register.countDocuments();
    const totalPages = Math.ceil(totalUser / limit);
    // Fetch all user profiles from the database
    const userProfiles = await register.find().skip(skip).limit(limit);
    // Extract IDs and other profile details
    // const doctorProfileData = register.map(profile => ({
    //   _id: profile._id,
    //   fullName: profile.fullName,
    //   // Add other profile details here as needed
    // }));

    res.status(200).send({
      message: "user Profile IDs Retrieved Successfully",
      data: userProfiles,
      page,
      totalPages,
      totalUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const userProfileUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const { fullName, email, dateOfBirth, mobileNumber } = req.body;

    const user = await register.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        dateOfBirth,
        mobileNumber,
      },
      { new: true }
    );
    res.status(200).send({
      message: "User Profile Updated Successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const userProfileDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const userProfile = await register.findByIdAndDelete(id);
    if (!userProfile) {
      return res.status(404).send({
        message: "User Profile not found",
      });
    }
    res.status(200).send({
      message: "User Profile Deleted Successfully",
      data: userProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  verifyOTPAndLogin,
  getUserById,
  getAllUserProfile,
  userProfileUpdate,
  userProfileDelete,
};
