const careerJobModel = require("../model/careerModel");

const createJob = async (req, res) => {
  const {
    jobTitle,
    jobId,
    companyName,
    jobLocation,
    description,
    basicQualification,
    preferredQualification,
    jobRole,
    dateOfCreate,
    updateJob,
    jobType,
    jobCategory,
    country,
    state,
    team,
    roleType,
  } = req.body;

  // Check if all required fields are provided
  //   if (
  //     !jobTitle || !jobId || !companyName || !jobLocation || !description ||
  //     !basicQualification || !preferredQualification || !jobRole ||
  //     !dateOfCreate || !updateJob || !jobType || !jobCategory ||
  //     !country || !state || !team || !roleType
  //   ) {
  //     return res.status(400).json({ message: 'All fields are required' });
  //   }

  try {
    const newJob = new careerJobModel({
      jobTitle,
      jobId,
      companyName,
      jobLocation,
      description,
      basicQualification,
      preferredQualification,
      jobRole,
      dateOfCreate,
      updateJob,
      jobType,
      jobCategory,
      country,
      state,
      team,
      roleType,
    });
    const savedJob = await newJob.save();
    res.status(201).json({
      message: "create career job successfully",
      data: savedJob,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllJob = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalJobs = await careerJobModel.countDocuments();
    const totalPages = Math.ceil(totalJobs / limit);

    const jobProfiles = await careerJobModel.find().skip(skip).limit(limit);

    res.status(200).send({
      message: "Job IDs Retrieved Successfully",
      data: jobProfiles,
      page,
      totalPages,
      totalJobs,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while retrieving job profiles",
      error: error.message,
    });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const job = await careerJobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }
    res.status(200).send({
      message: "Job Retrieved Successfully",
      data: job,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while retrieving the job",
      error: error.message,
    });
  }
};

const filterCareerJobs = async (req, res) => {
  const { jobType, jobCategory, country, state, team, roleType } = req.query;

  const filter = {};

  if (jobType) filter.jobType = jobType;
  if (jobCategory) filter.jobCategory = jobCategory;
  if (country) filter.country = country;
  if (state) filter.state = state;
  if (team) filter.team = team;
  if (roleType) filter.roleType = roleType;

  try {
    const jobs = await careerJobModel.find(filter);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({
      error: "Server error",
      message: "Unable to retrieve jobs at this time",
    });
  }
};

const updatecareerJob = async (req, res) => {
  const {
    jobTitle,
    jobId,
    companyName,
    jobLocation,
    description,
    basicQualification,
    preferredQualification,
    jobRole,
    dateOfCreate,
    updateJob,
    jobType,
    jobCategory,
    country,
    state,
    team,
    roleType,
  } = req.body;

  // Check if all required fields are provided
  // if (
  //   !jobTitle || !jobId || !companyName || !jobLocation || !description ||
  //   !basicQualification || !preferredQualification || !jobRole ||
  //   !dateOfCreate || !updateJob || !jobType || !jobCategory ||
  //   !country || !state || !team || !roleType
  // ) {
  //   return res.status(400).send({ message: 'All fields are required' });
  // }

  try {
    const job = await careerJobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }

    // Update job fields with request body
    job.jobTitle = jobTitle;
    job.jobId = jobId;
    job.companyName = companyName;
    job.jobLocation = jobLocation;
    job.description = description;
    job.basicQualification = basicQualification;
    job.preferredQualification = preferredQualification;
    job.jobRole = jobRole;
    job.dateOfCreate = dateOfCreate;
    job.updateJob = new Date(); // Update the updateJob field
    job.jobType = jobType;
    job.jobCategory = jobCategory;
    job.country = country;
    job.state = state;
    job.team = team;
    job.roleType = roleType;

    const updatedJob = await job.save();
    res.status(200).send({
      message: "Job Updated Successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while updating the job",
      error: error.message,
    });
  }
};

// Delete job by ID
// const deleteJob = async (req, res) => {
//     try {
//     const { id } = req.params;
//       const job = await careerJobModel.findByIdAndDelete(id);
//       if (!job) {
//         return res.status(404).send({ message: 'Job not found' });
//       }
//       await job.remove();
//       res.status(200).send({
//         message: "Job Deleted Successfully",
//       });
//     } catch (error) {
//       res.status(500).send({
//         message: "An error occurred while deleting the job",
//         error: error.message,
//       });
//     }
//   };

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await careerJobModel.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).send({
        message: "Job Profile not found",
      });
    }
    res.status(200).send({
      message: "Job Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while deleting the job",
      error: error.message,
    });
  }
};



module.exports = {
  createJob,
  getAllJob,
  getJobById,
  filterCareerJobs,
  updatecareerJob,
  deleteJob,
};
