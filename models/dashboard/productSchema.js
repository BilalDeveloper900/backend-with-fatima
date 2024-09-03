const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    img: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;