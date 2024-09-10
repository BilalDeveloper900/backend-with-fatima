const nodemailer = require('nodemailer');

module.exports.generateOtp = async () => {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
};

module.exports.sendOTPEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alexie26@ethereal.email',
            pass: 'jsHH2GKaad3ayZYvwK'
        }
    });
    const otp = await this.generateOtp();
    const mailOptions = {
        from: 'Bilal@gmail.com',
        to: email,
        subject: 'Verify Your Account',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
}
