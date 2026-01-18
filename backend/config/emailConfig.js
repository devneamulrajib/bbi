import Brevo from "@getbrevo/brevo";
import dotenv from 'dotenv';
dotenv.config(); // Ensure env vars are loaded

const apiInstance = new Brevo.TransactionalEmailsApi();

// key identifier is optional in setApiKey, usually just the key string is enough
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOtpEmail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      subject: "Verify Your Account - OTP",
      sender: {
        // CHANGE THIS: You must use the email you verified in Brevo
        email: process.env.EMAIL_USER, 
        name: "Babai Bangladesh"
      },
      to: [
        {
          email: email
        }
      ],
      textContent: `Your verification code is ${otp}. This code will expire in 5 minutes.`,
      htmlContent: `
        <h3>Account Verification</h3>
        <p>Your OTP code is:</p>
        <h2>${otp}</h2>
        <p>This code will expire in <b>5 minutes</b>.</p>
      `
    });

    console.log("OTP email sent successfully to", email);
    return true;

  } catch (error) {
    // Log the actual error body to see why Brevo rejected it
    console.error("Brevo Email Error:", error.body ? error.body : error);
    return false;
  }
};