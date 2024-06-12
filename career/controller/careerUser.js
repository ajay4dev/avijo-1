const careerUserModel = require("../model/careerUserModel");

const careerUserCreate = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNo,
      addressNo1,
      addressNo2,
      city,
      zipCode,
      country,
      state,
      preferredStartDate,
      relocate,
      howRole,
      educationalLevel,
      schoolName,
      firstMajor,
      secondMajor,
      minor,
      studentStatus,
      amazonAffiliate,
      amazonSubsidiaries,
      amazonSubsidiary,
      permanentResidency,
    } = req.body;

    const newUser = new careerUserModel({
      firstName,
      lastName,
      email,
      mobileNo,
      addressNo1,
      addressNo2,
      city,
      zipCode,
      country,
      state,
      preferredStartDate,
      relocate,
      howRole,
      educationalLevel,
      schoolName,
      firstMajor,
      secondMajor,
      minor,
      studentStatus,
      amazonAffiliate,
      amazonSubsidiaries,
      amazonSubsidiary,
      permanentResidency,
    });
    await newUser.save();
    res.status(201).send({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send("Error creating user");
  }
};

const careerUserGetAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await careerUserModel.find().skip(skip).limit(limit);
    const totalUsers = await careerUserModel.countDocuments();

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

const careerUserGetById = async (req, res) => {
  try {
    const {id} = req.params
    const user = await careerUserModel.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
        message: "Job Retrieved Successfully",
       data: user
    });
  } catch (err) {
    res.status(500).send("Error fetching user");
  }
};


const careerUserUpdate = async (req, res) => {
    const {
        firstName, lastName, email, mobileNo, addressNo1, addressNo2, city, zipCode,
        country, state, preferredStartDate, relocate, howRole, educationalLevel,
        schoolName, firstMajor, secondMajor, minor, studentStatus, amazonAffiliate,
        amazonSubsidiaries, amazonSubsidiary, permanentResidency
    } = req.body;

    try {
        const user = await careerUserModel.findByIdAndUpdate(
            req.params.id,
            {
                firstName, lastName, email, mobileNo, addressNo1, addressNo2, city, zipCode,
                country, state, preferredStartDate, relocate, howRole, educationalLevel,
                schoolName, firstMajor, secondMajor, minor, studentStatus, amazonAffiliate,
                amazonSubsidiaries, amazonSubsidiary, permanentResidency
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
}

const careerUserDelete = async (req, res) => {
    try {
        const user = await careerUserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
}



module.exports = {
  careerUserCreate,
  careerUserGetAll,
  careerUserGetById, 
  careerUserUpdate,
  careerUserDelete
};
