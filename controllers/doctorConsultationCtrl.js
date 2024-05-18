const doctorConsultationModel = require("../models/doctorConsultationModel");



const doctorConsultationCreate = async (req, res)  => {
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
          message: 'Doctors fetched successfully',
          data: doctors,
        });
      } catch (error) {
        return res.status(500).send({
          message: 'Internal server error',
          error: error.message,
        });
      }
}

module.exports = {
    doctorConsultationCreate
}