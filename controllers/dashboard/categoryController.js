const Category = require('../../models/dashboard/categorySchema')

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.userId;

        const existingCategory = await Category.findOne({ name, userId });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const newCategory = new Category({ name, userId });
        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [categories, totalCategories] = await Promise.all([
            Category.find().skip(skip).limit(limit),
            Category.countDocuments(),
        ]);

        res.status(200).json({
            total: totalCategories,
            page,
            pages: Math.ceil(totalCategories / limit),
            categories,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ category })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const updateCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true, runValidators: true }
        );

        if (!updateCategory) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json({ message: 'Category updated successfully', category: updateCategory });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const deleteCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deleteCategory) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};