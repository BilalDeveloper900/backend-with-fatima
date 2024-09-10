const UserOTPVerification = require("../../models/userOTPVerification");

exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const otpRecord = await UserOTPVerification.findOne({ userId, otp });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid OTP or User ID' });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        await UserOTPVerification.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}