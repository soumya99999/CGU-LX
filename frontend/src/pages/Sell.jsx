import { useState } from "react";

const Sell = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    address: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Allow up to 5 images
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
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
    images.forEach((image) => formData.append("images", image));
  
    try {
      const response = await fetch("${API_BASE_URL}/api/products", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("Product listed successfully!");
        setProduct({ name: "", price: "", description: "", address: "" });
        setImages([]);
        setImagePreviews([]);
      } else {
        const errorData = await response.json();
        alert(`Error listing product: ${errorData.message}`);
      }
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
          className="mt-5 w-full bg-blue-500 text-white py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:bg-blue-800 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed">
          {loading ? "Listing Product..." : "List Product"}
        </button>

      </form>
    </div>
    </div>
  );
};

export default Sell;