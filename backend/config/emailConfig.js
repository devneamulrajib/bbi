import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Email
        pass: process.env.EMAIL_PASS  // Your App Password
    }
});

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Account - OTP',
        text: `Your Verification Code is: ${otp}. This code expires in 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log("Email Error:", error);
        return false;
    }
}