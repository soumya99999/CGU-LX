import express from "express";
<<<<<<< HEAD
import upload from "../middleware/upload.js"; // Ensure correct path
import { createProduct } from "../controllers/productController.js";

const router = express.Router();

// ✅ Use `upload.array("images", 5)` for multiple files
router.post("/create", upload.array("images", 5), createProduct);
=======
import { createProduct, getProducts } from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create a new product (with image upload middleware)
router.post("/", upload.array("images", 5), createProduct); // Allow up to 5 images

// Fetch all products
router.get("/", getProducts);
>>>>>>> c4114f99194437ff9ad2e33db83c366dba76bd81

export default router;
