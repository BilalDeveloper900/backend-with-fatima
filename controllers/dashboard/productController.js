const Product = require('../../models/dashboard/ProductSchema')

exports.createProduct = async (req, res) => {
    try {
        const { name, description, oldPrice, newPrice, color, size, img, category, subCategory, userId } = req.body;

        const existingProduct = await Product.findOne({ name, userId });

        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        const newProduct = new Product({
            name,
            description,
            oldPrice,
            newPrice,
            color,
            size,
            img,
            category,
            subCategory,
            userId,
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', Product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [products, totalProducts] = await Promise.all([
            Product.find()
                .populate('category')
                .populate('subCategory')
                .populate('userId')
                .skip(skip)
                .limit(limit),
            Product.countDocuments(),
        ]);

        res.status(200).json({
            total: totalProducts,
            page,
            pages: Math.ceil(totalProducts / limit),
            products,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate('category')
        .populate('subCategory')
        .populate('userId');
        
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, oldPrice, newPrice, color, size, img, category, subCategory, userId } = req.body;

        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, oldPrice, newPrice, color, size, img, category, subCategory, userId },
            { new: true, runValidators: true }
        )
        .populate('category')
        .populate('subCategory')
        .populate('userId');

        if (!updateProduct) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ message: 'Product updated successfully', Product: updateProduct });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deleteProduct) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};