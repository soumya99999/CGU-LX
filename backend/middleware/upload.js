import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // Ensure this path is correct

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    format: async () => "png", // Convert images to PNG format
    public_id: (req, file) => file.originalname.split(".")[0], // Keep original filename
  },
});

// Initialize Multer with Cloudinary Storage
const upload = multer({ storage });

export default upload;
