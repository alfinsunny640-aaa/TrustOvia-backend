const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// GET all products (Public)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single product (Public)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD product (MULTIPLE IMAGES)
const addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        // ✅ Validate images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // ✅ Upload all images to Cloudinary
        const imageUrls = [];

        for (const file of req.files) {
            const uploadResult = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
            );
            imageUrls.push(uploadResult.secure_url);
        }

        const product = await Product.create({
            name,
            price,
            description,
            category,
            images: imageUrls,
            createdBy: req.user._id, // ✅ admin who created product
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE product (OPTIONAL IMAGE UPDATE)
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 🔥 Upload new images if provided
        if (req.files && req.files.length > 0) {
            const newImages = [];

            for (const file of req.files) {
                const uploadResult = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
                );
                newImages.push(uploadResult.secure_url);
            }

            product.images = newImages;
        }

        // ✅ Update only provided fields
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;
        if (category !== undefined) product.category = category;

        // ✅ FIX: ensure createdBy exists (for old products)
        if (!product.createdBy) {
            product.createdBy = req.user._id;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: "Product deleted" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
