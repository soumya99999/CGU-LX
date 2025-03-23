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

    const response = await fetch("http://localhost:5000/products/create", {
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
    <div className="w-full max-w-4xl mx-auto space-y-6  ">
      <h1 className="text-4xl font-bold text-gray-900">Sell an Item</h1>
      <label className="text-lg text-gray-400">List your item for sale to CGU peoples.</label>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl border-4 border-gray-100">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Set a price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={product.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pickup address"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your product in detail"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (Max 5) 
              </label>
              <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-blue-500">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute opacity-0 cursor-pointer"
                  multiple
                  accept="image/*"
                />
                <span className="text-gray-500 text-center">
                  Drag & drop images or click to upload
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select all the images at once.</label>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Previews */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group">
              <img 
                src={src} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-white rounded-md border border-blue-300 shadow-md transition-all duration-300 ease-in-out hover:scale-90 hover:bg-blue-300 hover:shadow-lg text-black py-4 px-6 rounded-lg font-medium text-lg   disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing...
            </span>
          ) : (
            "Hit to List Product"
          )}
        </button>
      </form>
    </div>
  </div>
  );
};

export default Sell;