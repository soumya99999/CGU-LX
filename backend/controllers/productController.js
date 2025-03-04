import Product from "../models/Product.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, address } = req.body;
    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new Product({ name, price, description, address, images: imageUrls });
    await newProduct.save();

    res.status(201).json({ message: "Product created!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
