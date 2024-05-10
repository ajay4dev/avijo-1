const { sendOTP } = require("../helper/sendotp");
const register = require("../models/registerModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, dateOfBirth, mobileNumber } = req.body;

    const existingUser = await register.findOne({ mobileNumber });

    if (existingUser) {
      const loginOTP = Math.floor(100000 + Math.random() * 900000);
      const hashOTP = await bcrypt.hash(loginOTP.toString(), 10);
      existingUser.otp = hashOTP;
      await existingUser.save();

      await sendOTP(mobileNumber, loginOTP);

      return res
        .status(200)
        .json({ success: true, message: "Login successful" });
    } else {
      const registrationOTP = Math.floor(100000 + Math.random() * 900000);
      const hashOTP = await bcrypt.hash(registrationOTP.toString(), 10);

      const newUser = new register({
        fullName,
        email,
        dateOfBirth,
        mobileNumber,
        otp: hashOTP,
      });

      await newUser.save();

      await sendOTP(mobileNumber, registrationOTP);

      return res.status(200).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    }
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
    const { mobileNumber, otp } = req.body;

    const user = await register.findOne({ mobileNumber });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided OTP with the hashed OTP stored in the database
    isOTPMatch = await bcrypt.compare(otp.toString(), user.otp);
    if (isOTPMatch) {
      return res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
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

// const registerUser = async (req, res) => {
//     try {

//         const existingUser = await register.findOne({ mobileNumber: req.body.mobileNumber });

//         if (existingUser) {

//             // const user = await register.findOne({ mobileNumber });
//             // if (user) {
//             //     return res.status(400).json({ success: false, message: 'User already exists' });
//             // }
//             const otp = Math.floor(1000 + Math.random() * 9000);

//             await sendOTP(mobileNumber, otp);
//             return res.status(200).json({ success: true, message: 'OTP sent successfully login' });

//        } else {
//         const { fullName, email, dateOfBirth, mobileNumber } = req.body;
//         const user = await register.findOne({ email });

//         if (user) {
//             return res.status(400).json({ success: false, message: 'User already exists' });
//         }

//         // Generate random OTP
//         const otp = Math.floor(1000 + Math.random() * 9000);

//         // Create a new user
//         const newUser = new register({
//             fullName,
//             email,
//             dateOfBirth,
//             mobileNumber,
//             otp: otp
//         });

//         // Save the new user
//         await newUser.save();

//         // Send OTP via Twilio
//         await sendOTP(mobileNumber, otp);

//         return res.status(200).json({ success: true, message: 'User registered successfully' });
//        }
//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

module.exports = {
  registerUser,
  verifyOTP,
};
