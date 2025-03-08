import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
<<<<<<< HEAD
import cloudinary from "../config/cloudinary.js"; // Ensure this path is correct

// Configure Cloudinary Storage
=======
import multer from "multer";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key,
  api_secret: cloudinary.config().api_secret ? "****" : undefined,
});

// Set up Cloudinary storage for Multer
>>>>>>> c4114f99194437ff9ad2e33db83c366dba76bd81
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    format: async () => "png", // Convert images to PNG format
    public_id: (req, file) => file.originalname.split(".")[0], // Keep original filename
  },
});

<<<<<<< HEAD
// Initialize Multer with Cloudinary Storage
=======
>>>>>>> c4114f99194437ff9ad2e33db83c366dba76bd81
const upload = multer({ storage });

export default upload;