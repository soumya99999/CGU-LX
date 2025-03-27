import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { AuthContext } from "../contexts/AuthContext";

const countryOptions = [
  { name: "India", code: "+91", pattern: /^[6-9]\d{9}$/ },
  { name: "Nepal", code: "+977", pattern: /^\d{10}$/ },
  { name: "USA", code: "+1", pattern: /^\d{10}$/ },
  { name: "UK", code: "+44", pattern: /^\d{10}$/ },
  { name: "Australia", code: "+61", pattern: /^\d{9}$/ },
  { name: "Bangladesh", code: "+880", pattern: /^\d{10}$/ },
  { name: "Japan", code: "+81", pattern: /^\d{9,10}$/ },
  { name: "France", code: "+33", pattern: /^\d{9}$/ },
  { name: "Germany", code: "+49", pattern: /^\d{10}$/ },
  { name: "Other", code: "", pattern: /^.*$/ }
];

const Register = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    course: "",
    semester: ""
  });
  const [country, setCountry] = useState("India");
  const [countryCode, setCountryCode] = useState("+91");
  const [customCountryCode, setCustomCountryCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    const foundCountry = countryOptions.find(c => c.name === selectedCountry);
    if (foundCountry) {
      setCountryCode(foundCountry.code);
    }
    if (selectedCountry !== "Other") {
      setCustomCountryCode("");
    }
  };

  const validatePhoneNumber = () => {
    const selectedPattern = country === "Other" ? /^.*$/ : countryOptions.find(c => c.name === country)?.pattern;
    if (selectedPattern && !selectedPattern.test(formData.phone)) {
      setError(`Invalid phone number format for ${country}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const response = await signInWithGoogle(true, {
        course: formData.course,
        semester: formData.semester
      });

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      if (response?.success) {
        toast.success("Registration successful!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Google registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        course: formData.course,
        semester: formData.semester
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success("Registration successful!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Create Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-2 items-center mb-6">
          <select
            value={country}
            onChange={handleCountryChange}
            className="border p-2 rounded w-full md:w-2/5"
          >
            {countryOptions.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          {country === "Other" ? (
            <input
              type="text"
              placeholder="+ Country Code"
              value={customCountryCode}
              onChange={(e) => setCustomCountryCode(e.target.value)}
              className="border p-2 rounded w-full md:w-1/4"
            />
          ) : (
            <span className="border p-2 rounded w-full md:w-1/4 text-center bg-gray-100">
              {countryCode}
            </span>
          )}

          <input
            type="text"
            placeholder="WhatsApp Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleRegister}
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
