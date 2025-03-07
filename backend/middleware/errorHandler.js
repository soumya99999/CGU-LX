const errorHandler = (err, req, res, next) => {
  console.error("Error Stack:", err.stack); // Log the full error stack for debugging

  // Handle multer file upload errors
  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({ message: err.message });
  }

  // Handle Cloudinary errors
  if (err.message.includes("Unknown API key")) {
    return res.status(500).json({ message: "Invalid Cloudinary credentials. Please check your API key and secret." });
  }

  // Handle other errors
  res.status(500).json({ message: err.message || "Something went wrong!" });
};

export default errorHandler;