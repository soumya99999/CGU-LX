import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  locationType: { type: String, enum: ["On-Campus", "nearby"], required: true }, // Location filter
  address: { type: String, required: true }, // Address field added
  category: { 
    type: String, 
    enum: ["Study Essentials", "Room & Living", "Tech & Accessories", "Health & Fitness"], 
    required: true 
  }, // Category filter
  condition: { 
    type: String, 
    enum: ["New", "Like New", "Used - Good", "Used - Acceptable"], 
    required: true 
  }, // Condition filter
  images: [{ type: String }], // Store Cloudinary image URLs
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the seller
  isSold: { type: Boolean, default: false }, // Add isSold field
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
