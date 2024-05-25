require('dotenv').config();
const client = require("twilio")( process.env.TWILIO_ACCOUNT_SID , process.env.TWILIO_AUTH_TOKEN );

const sendOTP = async (to, otp) => {
  try {
    const message = await client.messages.create({
      body: `Please verify the mobile number with the given OTP. Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${to}`,
    });
    console.log(`OTP sent successfully. SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    console.error('Error details:', error.message, error.code, error.moreInfo);
    return { message: `Error sending OTP: ${error.message}` };
  }
};


module.exports = { sendOTP };
