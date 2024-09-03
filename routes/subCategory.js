var express = require('express');
const { verifyToken } = require('../middleware/authmiddleware');
const { createSubCategory, getSubCategory } = require('../controllers/dashboard/subCategoryController');
var router = express.Router();

router.post('/', verifyToken, createSubCategory)
router.get('/', verifyToken, getSubCategory)
router.get('/:id', verifyToken)
router.put('/:id', verifyToken)
router.delete('/:id', verifyToken)

module.exports = router;