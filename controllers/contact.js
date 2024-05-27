const contactModel = require("../models/contact");
const nodemailer = require("nodemailer");

const createContact = async (req, res) => {
  try {
    const { interestedIn, name, email, country, city, message , mobileNummber } = req.body;

    // Create a new contact document
    const newContact = new contactModel({
      interestedIn,
      name,
      email,
      country,
      city,
      message,
      mobileNummber
    });

    // Save the contact document to MongoDB
    // await newContact.save();

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Set up email options for user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting us, ${name}`,
      text: `Hello ${name},\n\nThank you for reaching out. We have received your message and will get back to you shortly.\n\nBest regards,\nYour Company`,
    };

    // Send confirmation email to the user
    await transporter.sendMail(userMailOptions);
    console.log(`Confirmation email sent to user: ${email}`);

    // Set up email options for company
    const companyMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.COMPANY_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `A new contact form has been submitted with the following details:\n\n
      Interested In: ${interestedIn}\n
      Name: ${name}\n
      Email: ${email}\n
      Country: ${country}\n
      City: ${city}\n
      Message: ${message}\n
      Mobile Number : ${mobileNummber}`,
    };

    // Send information email to the company
    await transporter.sendMail(companyMailOptions);
    console.log(
      `Information email sent to company: ${process.env.COMPANY_EMAIL}`
    );

    // Send response
    res.status(200).send({ message: "Contact form submitted successfully." });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({
      error:
        "An error occurred while submitting the form. Please try again later.",
    });
  }
};

module.exports = {
  createContact,
};
