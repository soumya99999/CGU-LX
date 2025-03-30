import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const maleAvatars = [
  "adventurer",
  "bottts",
  "micah",
  "thumbs",
  "big-ears"
];

const femaleAvatars = [
  "fun-emoji", 
  "big-smile",        
  "lorelei",          
  "croodles",         
  "pixel-art-neutral" 
];

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    course: "",
    semester: "",
    avatar: localStorage.getItem("avatar") || "adventurer",
  });

  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState("male");
  const [listedProducts, setListedProducts] = useState([]);
  const [activeImages, setActiveImages] = useState({}); // Added missing state
  const [editingSemester, setEditingSemester] = useState(false);
  const [semesterValue, setSemesterValue] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
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
      await axios.put(`${API_BASE_URL}/api/auth/profile`, { avatar }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser((prev) => ({ ...prev, avatar }));
      localStorage.setItem("avatar", avatar);
    } catch (error) {
      console.error("Error updating avatar:", error.message);
    } finally {
      setShowAvatarModal(false);
    }
  };
  const handleSemesterChange = (e) => {
    setSemesterValue(e.target.value);
  };

  const saveSemester = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/profile`, 
        { semester: semesterValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        setUser((prev) => ({ ...prev, semester: semesterValue }));
        setEditingSemester(false);
        toast.success("Semester updated successfully!");
      } else {
        throw new Error("Failed to update semester");
      }
    } catch (error) {
      console.error("Error updating semester:", error);
      toast.error("Failed to update semester");
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

            <div className="relative flex flex-col items-center">
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

            {/* Avatar Modal (Above Profile Section) */}
{showAvatarModal && (
  <div className="absolute top-0 right-0 bg-white p-3 rounded-lg shadow-lg w-48 z-50">
    <h3 className="text-sm font-semibold mb-2 text-center">Choose Avatar</h3>

    <div className="flex justify-center gap-2 mb-3">
      <button
        onClick={() => setAvatarCategory("male")}
        className={`px-2 py-1 rounded-md text-xs font-medium ${
          avatarCategory === "male" ? "bg-blue-600 text-white" : "bg-gray-300"
        }`}
      >
        Male
      </button>
      <button
        onClick={() => setAvatarCategory("female")}
        className={`px-2 py-1 rounded-md text-xs font-medium ${
          avatarCategory === "female" ? "bg-pink-600 text-white" : "bg-gray-300"
        }`}
      >
        Female
      </button>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {(avatarCategory === "male" ? maleAvatars : femaleAvatars).map((avatar) => (
        <img
          key={avatar}
          src={getAvatarUrl(avatar)}
          alt={avatar}
          className="w-12 h-12 rounded-md cursor-pointer hover:scale-105 transition"
          onClick={() => handleAvatarChange(avatar)}
        />
      ))}
    </div>

    <button
      onClick={() => setShowAvatarModal(false)}
      className="mt-3 bg-gray-500 text-white px-3 py-1 text-xs rounded-md hover:bg-gray-700 w-full"
    >
      Close
    </button>
  </div>
)}


               {/* Profile Details */}
               <div className="space-y-3 text-left">
                      <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                        <span className="text-gray-700 font-medium">Name: </span>
                        <span className="text-gray-900">{user.name || "Not provided"}</span>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                        <span className="text-gray-700 font-medium">Phone: </span>
                        <span className="text-gray-900">{user.phone || "Not provided"}</span>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                        <span className="text-gray-700 font-medium">Course: </span>
                        <span className="text-gray-900">{user.course || "Not provided"}</span>
                      </div>

                      <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                        <span className="text-gray-700 font-medium">Semester: </span>
                        {editingSemester ? (
                          <input
                            type="text"
                            value={semesterValue}
                            onChange={handleSemesterChange}
                            onBlur={saveSemester}
                            autoFocus
                          />
                        ) : (
                          <span>
                            {user.semester} 
                            <Pencil size={16} className="inline cursor-pointer" onClick={() => { setEditingSemester(true); setSemesterValue(user.semester); }} />
                          </span>
                        )}
                      </div>
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
                    <div
                  className="w-full h-40 sm:h-52 rounded-xl overflow-hidden relative"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {hoveredProduct === product._id ? (
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 1000 }}
                      loop
                      className="w-full h-40 sm:h-52"
                    >
                      {product.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt={`${product.name} ${index}`}
                            className="w-full h-40 sm:h-52 object-cover rounded-xl"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 sm:h-52 object-cover rounded-xl"
                    />
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
    </div>
  );
};

export default Profile;