const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const UserOTPVerification = require('../models/userOTPVerification');
const {httpsCodes} = require('../constant/httpcode')

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alexie26@ethereal.email',
            pass: 'jsHH2GKaad3ayZYvwK'
        }
    });

    const mailOptions = {
        from: 'Bilal@gmail.com',
        to: email,
        subject: 'Verify Your Account',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
}

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        const otp = generateOTP();

        const otpVerification = new UserOTPVerification({
            userId: newUser._id,
            otp: otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
        });

        await otpVerification.save();

        await sendOTPEmail(email, otp);

        res.status(httpsCodes.CREATED).json({ message: 'User created successfully. Please verify your OTP.', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'my_secret',
            { expiresIn: '1h' }
        )

        res.status(200).json({ message: 'Login Successful', token, user })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendResetEmail = async (email, resetURL) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: 'bilal.dev900@gmail.com',
            pass: 'usntdkavibxpzpin'
        }
    });

    const mailOptions = {
        from: 'bilal@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: `You have requested to reset your password. Click the link to reset: ${resetURL}. This link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
}

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign(
            { userId: user._id },
            'my_secret',
            { expiresIn: '1h' }
        );

        const resetURL = `http://localhost:5000/api/v1/reset-password/${resetToken}`;

        await sendResetEmail(user.email, resetURL);

        res.status(200).json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, 'my_secret');

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
