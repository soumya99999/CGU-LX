import Product from "../models/Product.js";
import User from "../models/User.js"; // 🔹 Fix: Import User model
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const { name, price, description, address, email } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    // 🔹 Find seller using email
    const seller = await User.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // 🔹 Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        imageUrls.push(result.secure_url);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Image upload failed. Try again later." });
      }
    }

    // 🔹 Save product with seller reference
    const product = new Product({
      name,
      price,
      description,
      address,
      images: imageUrls,
      seller: seller._id, // Attach seller ID
    });

    await product.save();
    return res.status(201).json({ message: "Product created successfully!", product });

  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: error.message || "Error creating product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    // 🔹 Populate `seller` with only phone number
    const products = await Product.find().populate("seller", "phone");

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Error fetching products" });
  }
};
