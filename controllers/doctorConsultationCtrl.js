const doctorConsultationModel = require("../models/doctorConsultationModel");
const Razorpay = require("razorpay");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const doctorConsultationCreate = async (req, res) => {
  try {
    const { speciality, symptom, healthProblem } = req.body;
    let query = {};

    if (speciality) {
      query.speciality = speciality;
    }

    if (symptom) {
      query.symptoms = symptom;
    }

    if (healthProblem) {
      query.healthProblems = healthProblem;
    }

    const doctors = await doctorConsultationModel.find(query);
    return res.status(200).send({
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const APP_ID = "d19a9bdbb20e41dc8fad2ff7fe7f3d34";
const APP_CERTIFICATE = "e29e0d052a874e6ca3216e2518dbb4ff";
const expirationTimeInSeconds = 3600;

const generateAgoraToken = async (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName || !uid) {
    return res
      .status(400)
      .json({ message: "Channel name and UID are required" });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return res.json({ token });
};

const razorpay = new Razorpay({
  key_id: "rzp_test_aAAisbxaDEGUY9",
  key_secret: "MVRBIglBD2Fn0HF8g11wK9fg",
});

const createPayment = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise for INR)
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", razorpay.key_secret);

  hmac.update(order_id + "|" + payment_id);
  const generated_signature = hmac.digest("hex");

  if (generated_signature === signature) {
    res.json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
};

module.exports = {
  doctorConsultationCreate,
  generateAgoraToken,
  createPayment,
  verifyPayment,
};
