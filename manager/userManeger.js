"use strict";
const { httpsCodes } = require("../constant/language");
const User = require("../models/userSchema");
const { language } = require("../constant/language");
const { sendOTPEmail } = require('../modules/helper')
class UserManager {
    static async createUser(reqObj) {
        try {
            const { username, email, password, role } = reqObj;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return {
                    status: httpsCodes.BAD_REQUEST,
                    message: language.USER_ALREADY_EXISTS,
                };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                role
            });
            await newUser.save();
            await sendOTPEmail(email);
            return {
                status: httpsCodes.SUCCESS_CODE,
                message: language.ONE_RECORD_CREATE,
                result: newUser,
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserManager;
