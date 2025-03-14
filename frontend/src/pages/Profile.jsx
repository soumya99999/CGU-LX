import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil } from "lucide-react"; 

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
  const [isEditingSemester, setIsEditingSemester] = useState(false);
  const [newSemester, setNewSemester] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState("male");
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
        // const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
        //           headers: { Authorization: `Bearer ${token}` },
        // });
  
        if (data.success) {
          const storedAvatar = localStorage.getItem("avatar");
          setUser((prevUser) => ({
            ...prevUser,
            ...data.user,
            avatar: storedAvatar || data.user.avatar || "adventurer", 
          }));
          setAvatarCategory(data.user.gender === "female" ? "female" : "male");
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
  

  const handleSemesterUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User not authenticated.");
        return;
      }
  
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        { semester: newSemester },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // const { data } = await axios.put(
      //   "http://localhost:5000/api/auth/profile",
      //   { semester: newSemester },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
  
      if (data.success) {
        setUser((prevUser) => ({ ...prevUser, semester: newSemester }));
        setIsEditingSemester(false);
        console.log("Semester updated successfully!");
      } else {
        console.error("Failed to update semester.");
      }
    } catch (error) {
      console.error("Error updating semester:", error.message);
    }
  };
  

  const handleAvatarChange = async (avatar) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_BASE_URL}/api/auth/profile`,
        { avatar },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // const { data } = await axios.put(
      //   "http://localhost:5000/api/auth/profile",
      //   { avatar },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
  
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
  

  const getAvatarUrl = (avatarName) => {
    return `https://api.dicebear.com/7.x/${avatarName}/svg?seed=${user.name}`;
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full max-w-md backdrop-blur-md text-center">
        {/* <h1 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Your Profile</h1> */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Hi, {user.name || "Guest"}! 👋</h2>

        {/* Avatar Section */}
        <div className="relative inline-block mb-4">
          <img
            src={getAvatarUrl(user.avatar)}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg"
          />
          <button
            onClick={() => setShowAvatarModal(true)}
            className="absolute bottom-1 right-1 bg-gray-200 p-1 rounded-full shadow-md hover:bg-gray-300"
          >
            <Pencil size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Avatar Selection Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Choose Your Avatar</h3>

              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => setAvatarCategory("male")}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    avatarCategory === "male" ? "bg-blue-600 text-white" : "bg-gray-300"
                  }`}
                >
                  Male Avatars
                </button>
                <button
                  onClick={() => setAvatarCategory("female")}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    avatarCategory === "female" ? "bg-pink-600 text-white" : "bg-gray-300"
                  }`}
                >
                  Female Avatars
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {(avatarCategory === "male" ? maleAvatars : femaleAvatars).map((avatar) => (
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
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
              >
                Cancel
              </button>
              
            </div>
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
          </div>
        </div>
        {/* Editable Semester Field */}
        <div className="bg-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <span className="text-gray-700 font-medium">Semester: </span>
            {isEditingSemester ? (
              <input
                type="text"
                value={newSemester}
                onChange={(e) => setNewSemester(e.target.value)}
                className="border border-gray-400 p-1 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <span className="text-gray-900">{user.semester || "Not provided"}</span>
            )}
          </div>
          <button
            onClick={() => {
              if (isEditingSemester) handleSemesterUpdate();
              setIsEditingSemester(!isEditingSemester);
            }}
            className="text-blue-500 font-semibold hover:underline transition duration-200"
          >
            {isEditingSemester ? "Save" : "Edit"}
          </button>
        </div>

      </div>
    </div>
  );
};
export default Profile;
