import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash } from "lucide-react"; // Import Trash icon for delete functionality

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
    phone: "",
    course: "",
    semester: "",
    avatar: localStorage.getItem("avatar") || "adventurer",
  });
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState("male");
  const [listedProducts, setListedProducts] = useState([]); // State for user's listed products
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
        // Fetch user profile
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          const storedAvatar = localStorage.getItem("avatar");
          setUser((prevUser) => ({
            ...prevUser,
            ...data.user,
            avatar: storedAvatar || data.user.avatar || "adventurer", 
          }));
          setAvatarCategory(data.user.gender === "female" ? "female" : "male");

          // Fetch user's listed products
          const { data: productsData } = await axios.get(`${API_BASE_URL}/api/products/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("Products Data:", productsData); // Debugging log

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
        localStorage.setItem("avatar", avatar); // Store it in localStorage
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
        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const getAvatarUrl = (avatarName) => {
    return `https://api.dicebear.com/7.x/${avatarName}/svg?seed=${user.name}`;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
<div className="flex min-h-xl bg-white p-10 gap-6 ">
      {/* Profile Card */}
      <div className="w-1/3 p-6 bg-white rounded-3xl  border-2 border-black text-center">
        <div className="relative inline-block mb-4">
          <img
            src={getAvatarUrl(user.avatar)}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg"
          />
          <button
            onClick={() => setShowAvatarModal(true)}
            className="absolute bottom-2 right-2 bg-gray-200 p-1.5 rounded-full shadow-md hover:bg-gray-300 transition"
          >
            <Pencil size={18} className="text-gray-700" />
          </button>
        </div>

        {showAvatarModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Choose Your Avatar</h3>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => setAvatarCategory('male')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    avatarCategory === 'male' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  Male Avatars
                </button>
                <button
                  onClick={() => setAvatarCategory('female')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    avatarCategory === 'female' ? 'bg-pink-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                >
                  Female Avatars
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(avatarCategory === 'male' ? maleAvatars : femaleAvatars).map((avatar) => (
                  <img
                    key={avatar}
                    src={getAvatarUrl(avatar)}
                    alt={avatar}
                    className="w-20 h-20 rounded-lg cursor-pointer hover:scale-110 transition"
                    onClick={() => handleAvatarChange(avatar)}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 w-full transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-left text-gray-800 mb-0">{user.name || 'Guest'}</h2>
        <p className="text-gray-500 text-left text-xs mb-4">*Your profile is only visible to you.</p>

        <div className="space-y-3 text-left">
          {[['Name', user.name], ['Phone', user.phone], ['Course', user.course], ['Semester', user.semester]].map(
            ([label, value]) => (
              <div key={label} className="bg-gray-100 p-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">{label}: </span>
                <span className="text-gray-900">{value || 'Not provided'}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Listed Products */}
      <div className="w-2/3 p-6 bg-white rounded-3xl border-2 border-black text-center h-[75vh] overflow-y-auto no-scrollbar">
          
        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Listed Items</h3>
        {listedProducts.length === 0 ? (
          <p className="text-gray-500">You have no listed items.</p>
        ) : (
          <div className="space-y-4">
            {listedProducts.map((product) => (
              <div key={product._id} className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{product.name}</h4>
                  <p className="text-gray-600">₹{product.price}</p>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <div className="bg-gray-100 border border-red-600 text-red px-4 py-1.5 rounded-full text-sm font-medium  hover:bg-gray-300 transition duration-200 hover:scale-95">
                    <span className=" text-sm"> mark as sold </span>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;