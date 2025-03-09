import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    course: "",
    semester: "",
    email: "",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          ...data,
          profilePicture: data.profilePicture || getDiceBearAvatar(data.email),
        });
        setEditedUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setEditedUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value || "",
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/auth/profile", editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(editedUser);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-purple-300 p-6">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full max-w-md backdrop-blur-md relative transition-all hover:scale-105">
        
        {/* Welcome Message */}
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-2">
          Welcome to your profile!
        </h1>

        {/* Greeting */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Hi, {user.name || "Guest"}! 👋
        </h2>
        <p className="text-center text-gray-600 mb-4 italic">{message}</p>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={user.profilePicture || getDiceBearAvatar(user.email)}
            alt="Profile"
            className="w-28 h-28 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform"
          />
        </div>

        {/* Profile Info */}
        <div className="space-y-3">
          {["name", "phone", "course", "semester"].map((field) => (
            <div key={field} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm transition-all hover:bg-gray-200">
              <span className="text-gray-700 font-medium capitalize">{field}:</span>
              <span className="text-gray-900">{user[field] || "Not provided"}</span>
              <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                <Pencil size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              {["name", "phone", "course", "semester"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700 capitalize">{field}:</label>
                  <input
                    type="text"
                    name={field}
                    value={editedUser[field] || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/** 🐣 Generate Cute Avatar */
const getDiceBearAvatar = (email) => {
  const seed = email ? encodeURIComponent(email) : "default";
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=ffd5dc,d1d4f9,c0aede&radius=50`;
};

export default Profile;