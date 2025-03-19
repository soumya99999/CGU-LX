import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // ✅ Import useAuth

const Sell = () => {
  const { user } = useAuth(); // ✅ Get logged-in user details
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    address: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL ;

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !user.email) { // ✅ Ensure user is logged in
      alert("User not logged in");
      setLoading(false);
      return;
    }

    if (!product.name || !product.price || !product.description || !product.address || images.length === 0) {
      alert("Please fill in all fields and upload at least one image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("address", product.address);
    formData.append("email", user.email); // ✅ Send email from AuthContext
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/create", // ✅ Use localhost
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    // try {
    //   const response = await fetch(`${API_BASE_URL}/api/products/create`, {
    //     method: "POST",
    //     body: formData,
    //   });
  

      alert("Product listed successfully!");
      setProduct({ name: "", price: "", description: "", address: "" });
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error listing product");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="bg-gray-200">
    <div className="container mx-auto my-auto p-10">
      <h1 className="text-3xl font-bold text-center text-blue-600">Sell Your Item</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-12 shadow-xl rounded-3xl mt-5" encType="multipart/form-data">
        <label className="block mb-2 font-semibold">Product Name:</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

        <label className="block mt-4 mb-2 font-semibold">Price (₹):</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

        <label className="block mt-4 mb-2 font-semibold">Description:</label>
        <textarea name="description" value={product.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required></textarea>

        <label className="block mt-4 mb-2 font-semibold">Address:</label>
        <input type="text" name="address" value={product.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

        <label className="block mt-4 mb-2 font-semibold">Upload Images (Max 5):</label>
        <input type="file" onChange={handleImageChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm text-gray-700 cursor-pointer file:cursor-pointer file:bg-white file:border file:border-gray-500 file:text-gray-700 file:px-4 file:py-2 file:rounded-full file:font-semibold file:hover:bg-gray-300 transition" multiple accept="image/*" />

        <div className="mt-3 flex flex-wrap gap-2">
          {imagePreviews.map((src, index) => (
            <img key={index} src={src} alt="Preview" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>

        <button
  type="submit"
  disabled={loading}
  className={`mt-5 w-full text-white py-3 rounded-full font-semibold transition-all duration-300 shadow-md 
              flex justify-center items-center gap-3 relative overflow-hidden 
              bg-gradient-to-r from-blue-500 to-indigo-500 bg-[length:200%_200%] 
              hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed
              ${loading ? "animate-gradient" : ""}`}>

  {/* Inner Glow Effect (Only when loading) */}
  {loading && (
    <span className="absolute inset-0 bg-white opacity-10 blur-lg animate-pulse"></span>
  )}

  {loading ? (
    <span className="flex items-center gap-2 relative">
      {/* Rotating Gradient Loader */}
      <div className="w-5 h-5 border-4 border-transparent border-t-white border-l-white rounded-full animate-spin"></div>

      {/* Hypnotic Pulsing Text */}
      <span className="animate-pulse text-lg">Uploading</span>
    </span>
  ) : (
    <span className="relative z-10 text-lg">List Product</span>
  )}
</button>


      </form>
    </div>
    </div>
  );
};

export default Sell;