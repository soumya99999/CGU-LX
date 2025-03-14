import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  address: { type: String, required: true },
  images: [{ type: String }], // Store Cloudinary image URLs
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the seller
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
