const SubCategory = require('../../models/dashboard/subCategorySchema');

exports.createSubCategory = async (req, res) => {
    try {
        const { name, category } = req.body;
        const userId = req.user.userId;

        const existingSubCategory = await SubCategory.findOne({ name, category, userId });

        if (existingSubCategory) {
            return res.status(400).json({ error: 'Subcategory already exists' });
        }

        const newSubCategory = new SubCategory({ name, category, userId });
        await newSubCategory.save();

        res.status(201).json({ message: 'Subcategory created successfully', subCategory: newSubCategory });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.getSubCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [subCategories, totalSubCategories] = await Promise.all([
            SubCategory.find().skip(skip).limit(limit),
            SubCategory.countDocuments(),
        ])

        res.status(200).json({
            total: totalSubCategories,
            page,
            pages: Math.ceil(totalSubCategories / limit),
            subCategories
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) return res.status(404).json({ message: "subCategory not found" })

        res.status(200).json({ subCategory });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateSubCategory = async (req, res) => {
    try {
        const { name, category } = req.body;

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { name, category },
            { new: true, runValidators: true }
        );

        if (!updatedSubCategory) return res.status(404).json({ message: "subCategory not found" })

        res.status(200).json({ message: 'Category updated successfully', subCategory: updatedSubCategory });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.deleteSubCategory = async (req, res) => {
    try {
        const deleteSubCategory = await SubCategory.findByIdAndDelete(req.params.id);

        if (!deleteSubCategory) return res.status(404).json({ message: "subCategory not found" })

        res.status(200).json({ deleteSubCategory });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}