const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    googleId: { type: String, required: true, unique: true },
    profilePhoto: { type: String },

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User; 
