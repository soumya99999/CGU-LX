import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

const maleAvatars = [
  "adventurer",  // Explorer, warrior-like  
  "bottts",      // Futuristic robot (can resemble a superhero)  
  "micah",       // Expressive male faces  
  "thumbs",      // Quirky male gestures  
  "big-ears"     // Cartoon-style faces  
];

const femaleAvatars = [
  "fun-emoji", 
  "big-smile",        // Soft, friendly cartoon style  
  "lorelei",          // Fantasy-themed female avatars  
  "croodles",         // Cute, friendly cartoon faces  
  "pixel-art-neutral" // Cute, pixel-style feminine faces  
];

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    course: "",
    semester: "",
    hostelite: "No",
    avatar: localStorage.getItem("avatar") || "adventurer",
  });
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState("male");
  const [listedProducts, setListedProducts] = useState([]);
  const [activeImages, setActiveImages] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          const storedAvatar = localStorage.getItem("avatar");
          setUser((prevUser) => ({
            ...prevUser,
            ...data.user,
            bio: data.user.bio || "",
            avatar: storedAvatar || data.user.avatar || "adventurer",
          }));
          setAvatarCategory(data.user.gender === "female" ? "female" : "male");

          const { data: productsData } = await axios.get(`${API_BASE_URL}/api/products/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (productsData.success) {
            setListedProducts(productsData.products);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (listedProducts.length > 0) {
      const initialActiveImages = {};
      listedProducts.forEach(product => {
        initialActiveImages[product._id] = 0;
      });
      setActiveImages(initialActiveImages);
    }
  }, [listedProducts]);

  const handleAvatarChange = async (avatar) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        { avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUser((prevUser) => ({ ...prevUser, avatar }));
        localStorage.setItem("avatar", avatar);
      }
    } catch (error) {
      console.error("Error updating avatar:", error.message);
    } finally {
      setShowAvatarModal(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${API_BASE_URL}/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setListedProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error("Failed to delete product");
    }
  };

  const toggleSold = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE_URL}/api/products/${productId}/toggle-sold`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setListedProducts(prevProducts => {
          const updatedProducts = prevProducts.map(product =>
            product._id === productId
              ? { ...product, isSold: !product.isSold }
              : product
          );
          const updatedProduct = updatedProducts.find(p => p._id === productId);
          toast.success(updatedProduct.isSold ? "Product marked as sold" : "Product marked as unsold");
          return updatedProducts;
        });
      }
    } catch (error) {
      console.error("Error toggling sold status:", error);
      toast.error(error.response?.data?.message || "Failed to update sold status");
    }
  };

  const handleEditField = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveField = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        { [editingField]: editValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUser(prev => ({ ...prev, [editingField]: editValue }));
        setEditingField(null);
        toast.success("Updated successfully!");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("Failed to update");
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.delete(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("avatar");
          toast.success("Account deleted successfully");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account");
      }
    }
  };

  const getAvatarUrl = (avatarName) => {
    return `https://api.dicebear.com/7.x/${avatarName}/svg?seed=${user.name}`;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-xl bg-white p-4 md:p-10 gap-6">
      {/* Profile Section */}
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-2xl border-2 overflow-hidden h-full">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-8">Profile</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-3">
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-0 right-0 bg-gray-200 p-1.5 rounded-full shadow-md hover:bg-gray-300 transition"
                >
                  <Pencil size={18} className="text-gray-700" />
                </button>
              </div>
              <span className="text-xs text-gray-500 break-all text-center mb-3">{user.email}</span>

              <div className="w-full">
                <div className="mb-3">
                  <h3 className="text-md text-gray-500">Name</h3>
                  <p className="text-xl font-semibold">{user.name}</p>
                </div>

                <div className="mb-3">
                  <h3 className="text-md text-gray-500">Course</h3>
                  <p className="text-xl">{user.course || "Not provided"}</p>
                </div>

                <div className="mb-3">
                  <h3 className="text-md text-gray-500">Semester</h3>
                  <p className="text-xl">{user.semester || "Not provided"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Button
                  className="bg-black transition-all duration-500 ease-out hover:scale-95 hover:bg-gray-700 text-white w-full text-sm py-1 h-auto"

                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listed Products */}
      <div className="w-full md:w-2/3 ">
        <div className="bg-white rounded-2xl border-2 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Listings</h2>
              <span className="bg-blue-100 text-blue-800 text-lg font-medium px-2.5 py-0.5 rounded-full">
                {listedProducts.length} Items
              </span>
            </div>

            <div className="max-h-[600px] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listedProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg overflow-hidden bg-white"
                  >
                    <div className="relative aspect-square">
                      {/* Main Image */}
                      <div className="w-full h-full">
                        <img
                          src={product.images[activeImages[product._id] || 0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Thumbnail Navigation */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {product.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImages(prev => ({
                                ...prev,
                                [product._id]: index
                              }))}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                activeImages[product._id] === index 
                                  ? 'bg-blue-500' 
                                  : 'bg-white border border-gray-300 hover:bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>

                      <div className="mt-2 flex justify-between items-center">
                        <p className="font-bold text-sm">₹{product.price}</p>
                        <p className="text-xs text-gray-500">{product.address}</p>
                      </div>

                      <div className="mt-3 flex items-center justify-between ">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Mark as Sold</span>
                          <Switch
                            checked={product.isSold}
                            onCheckedChange={() => toggleSold(product._id)}
                            className="scale-75"
                          />
                        </div>

                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => navigate(`/edit-product/${product._id}`)}
                                >
                                  <Pencil className="h-3 w-3" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit listing</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-red-500"
                                  onClick={() => handleDeleteProduct(product._id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete listing</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowAvatarModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;