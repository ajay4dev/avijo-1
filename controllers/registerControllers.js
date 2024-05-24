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

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  verifyOTPAndLogin,
};
