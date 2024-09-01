var express = require('express');
const { createUser } = require('../controllers/userController');
var router = express.Router();

router.post('/register', createUser);

module.exports = router;
