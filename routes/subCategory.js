var express = require('express');
const { verifyToken } = require('../middleware/authmiddleware');
const { createSubCategory, getSubCategory, getSubCategoryById, updateSubCategory, deleteSubCategory } = require('../controllers/dashboard/subCategoryController');
var router = express.Router();

router.post('/', verifyToken, createSubCategory)
router.get('/', verifyToken, getSubCategory)
router.get('/:id', verifyToken, getSubCategoryById)
router.put('/:id', verifyToken, updateSubCategory)
router.delete('/:id', verifyToken, deleteSubCategory)

module.exports = router;