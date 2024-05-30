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
    const { emailId, mobileNumber, verifyStatus } = req.body;
    if (!emailId || !mobileNumber) {
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

    // const hashedPassword = await bcrypt.hash(password, salt);

    const emailOTP = generateOTP();
    const hashedEmailOTP = await bcrypt.hash(emailOTP.toString(), salt);
    await sendOTPEmail(emailId, emailOTP);

    const mobileOTP = generateOTP();
    const hashedMobileOTP = await bcrypt.hash(mobileOTP.toString(), salt);
    await sendOTP(mobileNumber, mobileOTP);

    // Create a new user object with only essential fields
    const newUser = new doctorModel({
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

const doctorVerify = async (req, res) => {
  try {
    const { emailId, emailOTP, mobileNumber, mobileOTP, fullName, password } =
      req.body;

    // Find the user by emailId and mobileNumber
    const user = await doctorModel.findOne({ emailId, mobileNumber });

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

const doctorLogin = async (req, res) => {
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
    const user = await doctorModel.findOne({
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

const doctorProfileCreate = async (req, res) => {
  try {
    const {
      fullName,
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

    // if (
    //   !title ||
    //   !specialization ||
    //   !experience ||
    //   !gender ||
    //   !dateOfBirth ||
    //   !degree ||
    //   !collegeUniversity ||
    //   !year ||
    //   !city ||
    //   !colonyStreetLocality ||
    //   !country ||
    //   !pinCode ||
    //   !state ||
    //   !registrationNumber ||
    //   !registrationCouncil ||
    //   !registrationYear
    // ) {
    //   return res.status(400).send({
    //     message: "All fields are required",
    //   });
    // }
    const newPharmacyProfile = new doctorProfileModel({
      fullName,
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

const getDoctorProfileById = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the doctor profile by ID
    const doctorProfile = await doctorProfileModel.findById(id);

    if (!doctorProfile) {
      return res.status(404).send({
        message: "Doctor Profile not found",
      });
    }

    res.status(200).send({
      message: "Doctor Profile Retrieved Successfully",
      data: doctorProfile,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllDoctorProfileIds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit ;
    const totalDoctors = await doctorProfileModel.countDocuments();
    const totalPages = Math.ceil(totalDoctors / limit);
    // Fetch all doctor profiles from the database
    const doctorProfiles = await doctorProfileModel.find().skip(skip).limit(limit);   
    // Extract IDs and other profile details
    // const doctorProfileData = doctorProfiles.map(profile => ({
    //   _id: profile._id,
    //   fullName: profile.fullName,
    //   // Add other profile details here as needed
    // }));

    res.status(200).send({
      message: "Doctor Profile IDs Retrieved Successfully",
      data: doctorProfiles,
      page,
      totalPages,
      totalDoctors
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

   /// delete doctorProfileUpdate api
const  doctorProfileUpdate = async (req, res) => {
  try {
    const {
      fullName,
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
     
    const {id} = req.body;
    const updatedDoctorProfile = await doctorProfileModel.findByIdAndUpdate(id , {
      fullName,
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
    }, 
     {new : true }
  );
  res.status(200).send({
    message: "Doctor Profile Updated Successfully",
    data: updatedDoctorProfile,
  });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

   /// delete doctorProfileDelete api
const doctorProfileDelete = async (req, res) => {
  try {
    const { id } = req.body;

    const  deletedDoctorProfile  = await doctorProfileModel.findByIdAndDelete(id);
    if(!deletedDoctorProfile) {
      return res.status(404).send({
        message: "Doctor Profile not found",
      })
    }
    res.status(200).send({
      message: "Doctor Profile Deleted Successfully",
      data: deletedDoctorProfile,
    }) 
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  doctorCreate,
  doctorVerify,
  doctorLogin,
  doctorProfileCreate,
  getDoctorProfileById,
  getAllDoctorProfileIds,
  doctorProfileUpdate,
  doctorProfileDelete,
  doctorImage,
};
