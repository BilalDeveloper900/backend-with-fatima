"use strict";
const { httpsCodes } = require("../constants/httpsCodes");
const User = require("../models/userSchema");
const { language } = require("../constant/language");
class UserManager {
    // create user
    static async createUser(reqObj) {
        try {
            let user;

            return {
                status: httpsCodes.SUCCESS_CODE,
                message: language.ONE_RECORD_CREATE,
                result: user,
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserManager;
