const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = SubCategory;
