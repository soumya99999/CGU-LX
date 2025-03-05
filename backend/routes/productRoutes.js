import express from "express";
import upload from "../middleware/upload.js"; // Ensure correct path
import { createProduct } from "../controllers/productController.js";

const router = express.Router();

// ✅ Use `upload.array("images", 5)` for multiple files
router.post("/create", upload.array("images", 5), createProduct);

export default router;
