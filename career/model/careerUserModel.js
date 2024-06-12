const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String},
    mobileNo: { type: Number },
    addressNo1: { type: String },
    addressNo2: { type: String },
    city: { type: String},
    zipCode: { type: Number },
    country: { type: String },
    state: { type: String},
    preferredStartDate: { type: Date },
    relocate: { type: Boolean },
    howRole: { type: String },
    educationalLevel: { type: String },
    schoolName: { type: String },
    firstMajor: { type: String },
    secondMajor: { type: String },
    minor: { type: String },
    studentStatus: { type: Boolean },
    amazonAffiliate: { type: Boolean },
    amazonSubsidiaries: { type: Boolean },
    amazonSubsidiary: { type: Boolean },
    permanentResidency: { type: Boolean }
});

const User = mongoose.model('CareerUser', userSchema);

module.exports = User;
