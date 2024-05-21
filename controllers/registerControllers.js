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

// const registerUser = async (req, res) => {
//   try {
//     const {  mobileNumber } = req.body;

//     const existingUser = await register.findOne({ mobileNumber });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists. Please log in.",
//       });
//     }

//     const registrationOTP = Math.floor(100000 + Math.random() * 900000);
//     const hashOTP = await bcrypt.hash(registrationOTP.toString(), 10);

//     const newUser = new register({
//       mobileNumber,
//       otp: hashOTP,
//     });

//     await newUser.save();
//     await sendOTP(mobileNumber, registrationOTP);

//     return res.status(200).json({
//       success: true,
//       message: "User registered successfully",
//       data: newUser,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

const loginUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const existingUser = await register.findOne({ mobileNumber });

    // if (!existingUser) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found. Please register.",
    //   });
    // }

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


// const verifyOTP = async (req, res) => {
//   try {
//     const { mobileNumber, otp } = req.body;

//     const user = await register.findOne({ mobileNumber });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // Compare the provided OTP with the hashed OTP stored in the database
//     isOTPMatch = await bcrypt.compare(otp.toString(), user.otp);
//     if (isOTPMatch) {
//       return res
//         .status(200)
//         .json({ success: true, message: "OTP verification successful" });
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

const verifyOTPAndLogin = async (req, res) => {
  try {
    const {mobileNumber, otp, fullName, email, dateOfBirth  } = req.body;

    const existingUser = await register.findByIdAndDelete({ mobileNumber });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register.",
      });
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isMatch = await bcrypt.compare(otp.toString(), existingUser.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // If OTP is verified successfully, save additional user information
    // Assuming fullName and email are also sent in the request body
    // const { fullName, email , dateOfBirth } = req.body;
    existingUser.fullName = fullName;
    existingUser.email = email;
    existingUser.dateOfBirth = dateOfBirth;

    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
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
  // registerUser,
  // verifyOTP,
  loginUser,
  verifyOTPAndLogin
};
