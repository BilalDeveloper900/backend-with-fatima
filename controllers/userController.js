const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const UserOTPVerification = require('../models/userOTPVerification');

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

        res.status(201).json({ message: 'User created successfully. Please verify your OTP.', user: newUser });
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