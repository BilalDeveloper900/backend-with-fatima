var express = require('express');
const { createCategory } = require('../controllers/dashboard/categoryController');
const { verifyToken } = require('../middleware/authmiddleware');
var router = express.Router();


router.post('/', verifyToken, createCategory)
router.get('/', verifyToken, createCategory)
router.put('/:id', verifyToken, createCategory)
router.delete('/:id', verifyToken, createCategory)
router.get('/:id', verifyToken, createCategory)


module.exports = router;