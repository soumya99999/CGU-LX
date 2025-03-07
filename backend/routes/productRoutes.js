import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create a new product (with image upload middleware)
router.post("/", upload.array("images", 5), createProduct); // Allow up to 5 images

// Fetch all products
router.get("/", getProducts);

export default router;
