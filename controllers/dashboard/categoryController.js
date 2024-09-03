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
        res.status(500).json({ error: error.message })
    }
}