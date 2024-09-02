const jwt = require('jsonwebtoken'); 
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

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
        res.status(201).json({ message: 'User created successfully', user: newUser });
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