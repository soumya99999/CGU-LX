import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { productId } = useParams(); 
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    address: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        console.log("Fetching product with ID:", productId); // Debugging log
        const { data } = await axios.get(`${API_BASE_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", data); // Debugging log

        if (data.success) {
          setProduct(data.product);
          setImagePreviews(data.product.images); 
        } else {
          setError("Failed to fetch product details.");
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setError("Error fetching product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + product.images.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }

    setNewImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("address", product.address);
      newImages.forEach((image) => formData.append("images", image));

      const { data } = await axios.put(
        `${API_BASE_URL}/api/products/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        alert("Product updated successfully!");
        navigate("/profile"); 
      } else {
        setError(data.message || "Error updating product.");
      }
    } catch (error) {
      console.error("Error updating product:", error.message);
      setError("Error updating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-xl w-full max-w-md backdrop-blur-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Product</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Product Name:</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Price (₹):</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={product.address}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Existing Images:</label>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Upload New Images (Max 5):</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              multiple
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;