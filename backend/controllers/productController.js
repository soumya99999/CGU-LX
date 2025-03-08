import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

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

  try {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const { name, price, description, address } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        imageUrls.push(result.secure_url);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw new Error("Failed to upload images to Cloudinary");
      }
    }

    // Save product to MongoDB
    const product = new Product({
      name,
      price,
      description,
      address,
      images: imageUrls,
    });
    await product.save();

    res.status(201).json({ message: "Product created successfully!", product });
  } catch (error) {
    console.error("Error creating product:", error.stack);
    res.status(500).json({ message: error.message || "Error creating product" });
  }

};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.stack);
    res.status(500).json({ message: "Error fetching products" });
  }
};