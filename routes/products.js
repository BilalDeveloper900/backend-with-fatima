var express = require('express');
const { verifyToken } = require('../middleware/authmiddleware');
const { createProduct,  getProductById, updateProduct, deleteProduct, getProduct } = require('../controllers/dashboard/productController');
var router = express.Router();

router.post('/', verifyToken, createProduct)
router.get('/', verifyToken, getProduct)
router.get('/:id', verifyToken, getProductById)
router.put('/:id', verifyToken, updateProduct)
router.delete('/:id', verifyToken, deleteProduct)

module.exports = router;