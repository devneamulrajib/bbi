import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOtpEmail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      subject: "Verify Your Account - OTP",
      sender: {
        email: "no-reply@babaibangladesh.com",
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
    console.error("Brevo Email Error:", error);
    return false;
  }
};
