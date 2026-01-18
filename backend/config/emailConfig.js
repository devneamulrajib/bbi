import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Use explicit host
    port: 587,              // Use Port 587 (TLS) instead of 465 (SSL)
    secure: false,          // Must be 'false' for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps avoid certificate errors on cloud servers
    }
});

export const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Verification" <${process.env.EMAIL_USER}>`, // Adds a nice sender name
        to: email,
        subject: 'Verify Your Account - OTP',
        text: `Your Verification Code is: ${otp}. This code expires in 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error("Email Error:", error);
        return false;
    }
}