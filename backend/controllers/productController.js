import Product from "../models/Product.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);
    console.log("Authenticated user:", req.user); 

    const { name, price, description, address } = req.body;
    const seller = req.user._id; 

    if (!seller) {
      return res.status(400).json({ message: "Seller ID is missing." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    
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

    
    const product = new Product({
      name,
      price,
      description,
      address,
      images: imageUrls,
      seller,
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
    
    const products = await Product.find().populate("seller", "phone");
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Error fetching products" });
  }
};


export const getUserProducts = async (req, res) => {
  try {
    const sellerId = req.user._id; 

    
    const products = await Product.find({ seller: sellerId }).populate("seller", "phone");
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching user products:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id; 

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }


    for (const imageUrl of product.images) {
      const publicId = imageUrl.split("/").pop().split(".")[0]; 
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.deleteOne({ _id: productId });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id; 
    const { name, price, description, address } = req.body;

    console.log("Product ID:", productId); // Debugging log
    console.log("Seller ID:", sellerId); // Debugging log

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.address = address || product.address;

    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        imageUrls.push(result.secure_url);
      }
      product.images = imageUrls;
    }

    await product.save();
    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};