import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    address: "",
    locationType: "",
    condition: "",
    category: "",
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
        const { data } = await axios.get(`${API_BASE_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setProduct(data.product);
          // Set previews for existing images (use url if available)
          setImagePreviews(data.product.images.map(img => img.url || img));
        } else {
          setError("Failed to fetch product details.");
          toast.error("Failed to fetch product details.");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error fetching product details. Please try again.");
        toast.error("Error fetching product details. Please try again.");
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
    const maxSize = 15 * 1024 * 1024; // 15MB in bytes

    // Filter valid files (size < 15MB)
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`File is too large (Max: 15MB).`);
        return false;
      }
      return true;
    });

    // Ensure total images do not exceed 5
    if (imagePreviews.length + validFiles.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    // Update state with new images and previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setNewImages([...newImages, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);

    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} image(s) added successfully!`);
    }
  };

  const handleRemoveImage = (index) => {
    // Check if the image is from the existing product images or new uploads
    if (index < product.images.length) {
      // Remove from existing images
      const updatedImages = product.images.filter((_, i) => i !== index);
      setProduct({ ...product, images: updatedImages });
    } else {
      // Remove from new uploads
      const adjustedIndex = index - product.images.length;
      const updatedNewImages = newImages.filter((_, i) => i !== adjustedIndex);
      setNewImages(updatedNewImages);
    }

    // Remove from previews
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
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
      formData.append("locationType", product.locationType);
      formData.append("condition", product.condition);
      formData.append("category", product.category);

      // Append existing image URLs (if any)
      product.images.forEach((img) => {
        if (typeof img === 'string' || img.url) {
          formData.append("existingImages", img.url || img);
        }
      });

      // Append new images
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
        toast.success("Product updated successfully!");
        navigate("/profile");
      } else {
        setError(data.message || "Error updating product.");
        toast.error(data.message || "Error updating product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Error updating product. Please try again.");
      toast.error("Error updating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Edit Product</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold px-3 py-2"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold px-3 py-2"
                  required
                />
              </div>

              {/* Location and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={product.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location Type</label>
                  <select
                    name="locationType"
                    value={product.locationType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold px-3 py-2"
                    required
                  >
                    <option value="">Select Location Type</option>
                    <option value="On-Campus">On-Campus</option>
                    <option value="nearby">Nearby Area</option>
                  </select>
                </div>
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold px-3 py-2"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Study Essentials">Study Essentials</option>
                    <option value="Room & Living">Room & Living</option>
                    <option value="Tech & Accessories">Tech & Accessories</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Condition</label>
                  <select
                    name="condition"
                    value={product.condition}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-semibold px-3 py-2"
                    required
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Acceptable">Used - Acceptable</option>
                  </select>
                </div>
              </div>

              {/* Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images (Max 5, each under 15MB)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    multiple
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;