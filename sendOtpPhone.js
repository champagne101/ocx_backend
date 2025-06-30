const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOTPPhone = async (phone, otp) => {
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    to: phone,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
};

module.exports = sendOTPPhone;
