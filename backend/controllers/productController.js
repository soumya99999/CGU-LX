import Product from "../models/Product.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import fs from "fs-extra";

// Configure Multer to store files in `uploads/`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = "uploads/";
      fs.ensureDirSync(uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      console.error("Error ensuring upload directory:", error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, `${Date.now()}-${file.originalname}`);
    } catch (error) {
      console.error("Error generating filename:", error);
      cb(error, null);
    }
  }
});

// Allow only images
const fileFilter = (req, file, cb) => {
  try {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  } catch (error) {
    console.error("Error in file filter:", error);
    cb(error, false);
  }
};

// Configure Multer with a 15MB limit
export const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // ✅ 15MB limit
  fileFilter: fileFilter
}).array("images", 5);

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "products",
      transformation: [
        { width: 1920, crop: "limit" }, // ✅ Resize image (optional)
        { quality: "auto:good" }        // ✅ Automatic compression by Cloudinary
      ]
    });
    console.log(`Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const createProduct = async (req, res) => { 
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);
    console.log("Authenticated user:", req.user); 

    const { name, price, description, address, locationType, condition, category } = req.body;
    const seller = req.user._id; 

    if (!seller) return res.status(400).json({ message: "Seller ID is missing." });
    if (!name || !price || !description || !address || !locationType || !condition || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image." });
    }

    // ✅ Convert files to correct format before uploading
    const imageUrls = await Promise.all(req.files.map(async (file) => {
      try {
        if (!(file instanceof Object) || !file.path) {
          console.error("Invalid file format:", file);
          throw new Error("Invalid file format");
        }
        return await uploadToCloudinary(file.path);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
      }
    }));

    // ✅ Delete local files after upload
    req.files.forEach((file) => {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error("Error deleting local file:", error);
      }
    });

    // ✅ Save product in database
    const product = new Product({
      name, price, description, address, locationType, condition, category,
      images: imageUrls, seller,
    });

    await product.save();
    return res.status(201).json({ message: "Product created successfully!", product });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Error creating product" });
  }
};





export const getProducts = async (req, res) => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const products = await Product.find({
      $or: [
        { isSold: false },
        {
          isSold: true,
          soldAt: { $gte: fiveDaysAgo },
        },
      ],
    }).populate("seller", "phone");

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
    const { 
      name, 
      price, 
      description, 
      address, 
      locationType, 
      condition, 
      category,
      existingImages // This comes from formData as JSON string
    } = req.body;

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    // Update product fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.address = address || product.address;
    product.locationType = locationType || product.locationType;
    product.condition = condition || product.condition;
    product.category = category || product.category;

    // Handle images
    let finalImages = [];
    
    // 1. Process existing images that were kept
    if (existingImages) {
      try {
        const keptImages = JSON.parse(existingImages);
        finalImages = keptImages;
        
        // Delete images from Cloudinary that were removed
        const imagesToDelete = product.images.filter(img => !keptImages.includes(img));
        for (const imgUrl of imagesToDelete) {
          const publicId = imgUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        }
      } catch (err) {
        console.error("Error parsing existingImages:", err);
        return res.status(400).json({ success: false, message: "Invalid existing images data" });
      }
    }

    // 2. Add new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
        finalImages.push(result.secure_url);
      }
    }

    // Update product images
    product.images = finalImages;

    await product.save();
    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getFilteredProducts = async (req, res) => {
  try {
    const { locationType, condition, category, priceRange } = req.query;

    // Build the base filter for showing unsold OR recently sold products (within 5 days)
    const currentDate = new Date();
    const fiveDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

    let filter = {
      $or: [
        { isSold: false },
        { isSold: true, soldAt: { $gte: fiveDaysAgo } },
      ],
    };

    // Apply additional filters dynamically
    if (locationType) {
      filter.locationType = locationType;
    }
    if (condition) {
      filter.condition = condition;
    }
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (priceRange) {
      const [minPrice, maxPriceRaw] = priceRange.split("-");
      const maxPrice = maxPriceRaw?.includes("+") ? Infinity : Number(maxPriceRaw);
      const min = Number(minPrice);

      filter.price = {};
      if (!isNaN(min)) filter.price.$gte = min;
      if (maxPrice !== Infinity) filter.price.$lte = maxPrice;
    }

    const products = await Product.find(filter).populate("seller", "phone");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ message: "Server error while filtering products" });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching product details"
    });
  }
};

export const toggleSold = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user._id;

    const product = await Product.findOne({ _id: productId, seller: sellerId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    // Toggle the isSold status
    product.isSold = !product.isSold;

    // Set or clear the soldAt timestamp accordingly
    if (product.isSold) {
      product.soldAt = new Date();
    } else {
      product.soldAt = null;
    }

    await product.save();

    res.status(200).json({ 
      success: true, 
      message: `Product ${product.isSold ? 'marked as sold' : 'marked as unsold'} successfully`,
      product 
    });
  } catch (error) {
    console.error("Error toggling sold status:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const updateProductClickCount = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { clickCount: 1 } }, // Increment click count
      { new: true } // Return updated document
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Click count updated successfully",
      product
    });
  } catch (error) {
    console.error("Error updating click count:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating click count"
    });
  }
};


















