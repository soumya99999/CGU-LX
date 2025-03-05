import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, address } = req.body;

        // ✅ Check if images were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        // ✅ Get Cloudinary URLs from uploaded images
        const imageUrls = req.files.map((file) => file.path);

        const newProduct = new Product({ name, price, description, address, images: imageUrls });
        await newProduct.save();

        res.status(201).json({ message: "Product created!", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: error.message });
    }
};
