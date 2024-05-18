const express = require("express");
const { doctorConsultationCreate } = require("../controllers/doctorConsultationCtrl");


const router = express.Router();

router.post("/doctorConsultationCreate", doctorConsultationCreate)



module.exports = router;


