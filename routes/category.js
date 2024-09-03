var express = require('express');
const { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } = require('../controllers/dashboard/categoryController');
const { verifyToken } = require('../middleware/authmiddleware');
var router = express.Router();

router.post('/', verifyToken, createCategory)
router.get('/', verifyToken, getCategory)
router.get('/:id', verifyToken, getCategoryById)
router.put('/:id', verifyToken, updateCategory)
router.delete('/:id', verifyToken, deleteCategory)

module.exports = router;