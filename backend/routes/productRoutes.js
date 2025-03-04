import express from "express";
import { createProduct } from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.array("images", 5), createProduct);

export default router;
