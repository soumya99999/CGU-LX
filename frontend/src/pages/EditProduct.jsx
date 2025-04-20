import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
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

  // Toast configuration
  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      style: {
        background: '#ff4444',
        color: '#fff',
        fontWeight: 'bold',
        padding: '16px',
        borderRadius: '8px'
      },
      duration: 4000
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      style: {
        background: '#4BB543',
        color: '#fff',
        fontWeight: 'bold',
        padding: '16px',
        borderRadius: '8px'
      },
      duration: 3000
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Please login to continue");
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setProduct(data.product);
          setImagePreviews(data.product.images.map(img => img.url || img));
          // showSuccess("Product loaded successfully");
        } else {
          showError(data.message || "Failed to load product");
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Error loading product";
        showError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 15 * 1024 * 1024; // 15MB

    if (!files.length) return;

    if (files.length + imagePreviews.length > 5) {
      showError(`Maximum 5 images allowed (you have ${imagePreviews.length})`);
      e.target.value = "";
      return;
    }

    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      showError("Each image must be under 15MB");
      e.target.value = "";
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    setNewImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...previews]);
    showSuccess(`Added ${files.length} image(s)`);
  };

  const handleRemoveImage = (index) => {
    const isExistingImage = index < product.images.length;
    
    if (isExistingImage) {
      // Remove from existing images
      setProduct(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      // Remove from new images
      const newIndex = index - product.images.length;
      setNewImages(prev => prev.filter((_, i) => i !== newIndex));
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    showSuccess("Image removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    const requiredFields = [
      { field: "name", message: "Product name is required" },
      { field: "price", message: "Price is required" },
      { field: "description", message: "Description is required" },
      { field: "address", message: "Address is required" },
      { field: "locationType", message: "Location type is required" },
      { field: "category", message: "Category is required" },
      { field: "condition", message: "Condition is required" },
    ];

    for (const { field, message } of requiredFields) {
      if (!product[field]) {
        showError(message);
        setLoading(false);
        return;
      }
    }

    if (isNaN(product.price)) {
      showError("Price must be a number");
      setLoading(false);
      return;
    }

    if (imagePreviews.length === 0) {
      showError("Please upload at least one image");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Session expired. Please login again");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      
      // Add product data
      Object.entries(product).forEach(([key, value]) => {
        if (key !== 'images') {
          formData.append(key, value);
        }
      });

      // Add existing images as JSON string
const existingImages = product.images
.filter(img => imagePreviews.includes(img.url || img))
.map(img => img.url || img);

formData.append("existingImages", JSON.stringify(existingImages));
      // Add new images
      newImages.forEach(img => {
        formData.append("images", img);
      });

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
        showSuccess("Product updated successfully!");
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        throw new Error(data.message || "Failed to update product");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Error updating product";
      showError(errorMsg);
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
      <Toaster />
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Edit Product</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name*</label>
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
                  <label className="block text-sm font-medium text-gray-700">Price (₹)*</label>
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
                <label className="block text-sm font-medium text-gray-700">Description*</label>
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
                  <label className="block text-sm font-medium text-gray-700">Address*</label>
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
                  <label className="block text-sm font-medium text-gray-700">Location Type*</label>
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
                  <label className="block text-sm font-medium text-gray-700">Category*</label>
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
                    <option value="Mobility & Transport">Mobility & Transport</option>
                    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Condition*</label>
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
                  Product Images* (Max 5, each under 15MB)
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
                  <p className="mt-2 text-sm text-gray-500">
                    {imagePreviews.length}/5 images uploaded
                  </p>
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
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : "Update Product"}
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