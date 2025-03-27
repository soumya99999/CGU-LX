import express from "express";
import {
  createProduct,
  getProducts,
  getUserProducts,
  deleteProduct,
  updateProduct,
  getFilteredProducts,
  getProductById,
  toggleSold,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js"; // Ensure correct path
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure correct path
const router = express.Router();

// ✅ Public Routes (No authentication required)
// Fetch all products (for Buy Page)
router.get("/", getProducts);

// ✅ Protected Routes (Authentication required)
// Create a new product (with image upload middleware)
router.post("/create", authMiddleware, upload.array("images", 5), createProduct);

// Fetch products listed by the logged-in user (for Profile Page)
router.get("/user", authMiddleware, getUserProducts);

// Get a single product by ID
router.get("/:productId", authMiddleware, getProductById);

// Delete a product
router.delete("/:productId", authMiddleware, deleteProduct);

// Update a product
router.put("/:productId", authMiddleware, upload.array("images", 5), updateProduct);

// Toggle sold status
router.put("/:productId/toggle-sold", authMiddleware, toggleSold);

router.get("/filter", getFilteredProducts);

export default router;