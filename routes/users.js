var express = require('express');
const { createUser, loginUser, resetPassword, forgetPassword  } = require('../controllers/userController');
const { verifyOTP } = require('../modules/helpers/verifyOTP');
var router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/forget-password', forgetPassword);


module.exports = router;
