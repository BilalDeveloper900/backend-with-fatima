var express = require('express');
const { createUser, loginUser  } = require('../controllers/userController');
const { verifyOTP } = require('../helpers/verifyOTP');
var router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);

module.exports = router;
