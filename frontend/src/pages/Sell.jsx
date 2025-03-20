import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Sell = () => {
  const { user } = useAuth(); // Get logged-in user details
  const navigate = useNavigate(); // For redirecting after listing
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    address: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For displaying error messages
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setError(""); // Clear any previous errors
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!user || !user._id) { // Ensure user is logged in and has an _id
    setError("User not logged in");
    setLoading(false);
    return;
  }

  if (!product.name || !product.price || !product.description || !product.address || images.length === 0) {
    setError("Please fill in all fields and upload at least one image.");
    setLoading(false);
    return;
  }

  try {
    const token = await user.getIdToken(); // Fetch the ID token
    console.log("Token:", token); // Debugging line

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("address", product.address);
    formData.append("seller", user._id); // Add seller field
    images.forEach((image) => formData.append("images", image));

    const response = await fetch(`${API_BASE_URL}/api/products/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the header
      },
      body: formData,
    });

    if (response.ok) {
      alert("Product listed successfully!");
      setProduct({ name: "", price: "", description: "", address: "" });
      setImages([]);
      setImagePreviews([]);
      navigate("/profile"); // Redirect to profile page
    } else {
      const data = await response.json();
      setError(data.message || "Error listing product");
    }
  } catch (error) {
    console.error("Error submitting product:", error);
    setError("Error listing product. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-gray-200">
      <div className="container mx-auto my-auto p-10">
        <h1 className="text-3xl font-bold text-center text-blue-600">Sell Your Item</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-12 shadow-xl rounded-3xl mt-5" encType="multipart/form-data">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Product Name */}
          <label className="block mb-2 font-semibold">Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Price */}
          <label className="block mt-4 mb-2 font-semibold">Price (₹):</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Description */}
          <label className="block mt-4 mb-2 font-semibold">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>

          {/* Address */}
          <label className="block mt-4 mb-2 font-semibold">Address:</label>
          <input
            type="text"
            name="address"
            value={product.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Upload Images */}
          <label className="block mt-4 mb-2 font-semibold">Upload Images (Max 5):</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm text-gray-700 cursor-pointer file:cursor-pointer file:bg-white file:border file:border-gray-500 file:text-gray-700 file:px-4 file:py-2 file:rounded-full file:font-semibold file:hover:bg-gray-300 transition"
            multiple
            accept="image/*"
          />

          {/* Image Previews */}
          <div className="mt-3 flex flex-wrap gap-2">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full bg-blue-500 text-white py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:bg-blue-800 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "List Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sell;