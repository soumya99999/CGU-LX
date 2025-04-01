import { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; 
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; 
import AIProductDescription from '../components/AIProductDescription';
import { X } from "lucide-react"; 

const Sell = () => {
  const { user } = useAuth(); // Get logged-in user details
  const navigate = useNavigate(); // For redirecting after listing
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    locationType: "", // On Campus or Nearby
    address: "", // Address field added
    category: "", // Study Essentials, Room & Living, Tech & Accessories, Health & Fitness
    condition: "", // New, Like New, Used
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For displaying error messages
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const [showAIForm, setShowAIForm] = useState(false);

  const handleSaveDescription = (description) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description, // Update only the description field
    }));
    setShowAIForm(false); // Close AI generator dialog
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
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
    if (images.length + validFiles.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }
  
    // Update state with new images and previews
    const newImages = [...images, ...validFiles];
    const newPreviews = [...imagePreviews, ...validFiles.map((file) => URL.createObjectURL(file))];
  
    setImages(newImages);
    setImagePreviews(newPreviews);
  
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} image(s) added successfully!`);
    }
  };
  
  
  
  // Function to remove an image
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
  
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user || !user._id) { // Ensure user is logged in and has an _id
      toast.error("User not logged in");
      setLoading(false);
      return;
    }

    if (
      !product.name ||
      !product.price ||
      !product.description ||
      !product.locationType ||
      !product.address || // Validate address field
      !product.category ||
      !product.condition ||
      images.length === 0
    ) {
      toast.error("Please fill in all fields and upload at least one image.");
      setLoading(false);
      return;
    }
    if (isNaN(product.price) || Number(product.price) <= 0) {
      toast.error("Price must be greater than zero.");
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
      formData.append("locationType", product.locationType);
      formData.append("address", product.address); // Add address field
      formData.append("category", product.category);
      formData.append("condition", product.condition);
      formData.append("seller", user._id); // Add seller field
      images.forEach((image) => formData.append("images", image));
      console.log("Images to send:", images);


      const response = await fetch(`${API_BASE_URL}/api/products/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Product listed successfully!");

        setTimeout(() => {
          setProduct({
            name: "",
            price: "",
            description: "",
            locationType: "",
            address: "",
            category: "",
            condition: "",
          });
          setImages([]);
          setImagePreviews([]);
          navigate("/profile");
        }, 3000); // Redirect to profile page
      } else {
        const data = await response.json();
        toast.error(data.message || "Error listing product");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Error listing product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Sell an Item</h1>
        <label className="text-lg text-gray-400">
          List your item for sale to CGU people.
        </label>

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl border border-black">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Set a price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {["Study Essentials", "Room & Living", "Tech & Accessories", "Health & Fitness"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  name="condition"
                  value={product.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Used - Acceptable">Used - Acceptable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={product.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your address"
                />
            </div>
              

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Type</label>
                <select
                  name="locationType"
                  value={product.locationType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location Type</option>
                  <option value="On-Campus">On-Campus</option>
                  <option value="nearby">nearby</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>

  {/* Textarea for manual + AI-generated descriptions */}
  <textarea
    name="description"
    value={product.description}
    onChange={handleChange} // Allows manual input
    rows="5"
    className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500"
    placeholder="Describe your product in detail or use AI to generate it"
  />

  {/* AI Generate Button */}
  <button
    type="button"
    onClick={() => setShowAIForm(true)}
    className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
  >
    Generate with AI
  </button>

  {/* AI Generator Dialog (Fixed Extra Box Issue) */}
  {showAIForm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      {/* Close Button (Now inside the modal) */}
      <button
        onClick={() => setShowAIForm(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
      >
        ✖
      </button>

      {/* AI Description Component */}
      <AIProductDescription onSaveDescription={handleSaveDescription} />
    </div>
  </div>
)}

</div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Max 5)</label>
                <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all hover:scale-95 hover:border-blue-500">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="absolute opacity-0 cursor-pointer"
                    multiple
                    accept="image/*"
                  />
                  <span className="text-gray-500 text-center">
                    Drag & drop images or click to upload
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Select the images.
                    </label>
                  </span>

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
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-white rounded-md border border-blue-300 shadow-md transition-all duration-300 ease-in-out hover:scale-90 hover:bg-blue-300 hover:shadow-lg text-black py-4 px-6 rounded-lg font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
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