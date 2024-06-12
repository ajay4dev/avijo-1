const express = require("express");
const { doctorConsultationCreate, createPayment, verifyPayment, generateAgoraToken } = require("../controllers/doctorConsultationCtrl");


const router = express.Router();

router.post("/doctorConsultationCreate", doctorConsultationCreate)
router.post("/agoraToken" , generateAgoraToken)
router.post("/payment", createPayment);
router.post("/verifyPayment", verifyPayment )



module.exports = router;


