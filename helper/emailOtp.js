const nodemailer = require("nodemailer");
const sendOTPEmail = async (emailId, otp) => {


  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ur.ajayk@gmail.com",
      pass: "scirznintzokugvr",
    },
  });
  console.log(transporter);

  const info = await transporter.sendMail({
    from: "ur.ajayk@gmail.com",
    to: emailId,
    subject: "OTP for Avijo Registration",
    text: `Your OTP is: ${otp}`,
  });

  console.log("Email sent: %s", info.messageId);



};

module.exports = {
  sendOTPEmail,
};
