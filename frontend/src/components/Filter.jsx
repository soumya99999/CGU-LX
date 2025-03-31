import { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    locationType: "",
    condition: "",
    category: "",
    priceRange: "",
  });
  const [isOpen, setIsOpen] = useState(false);


  const priceRanges = [
    { label: "All Price Ranges", value: "" },
    { label: "₹0 - ₹100", value: "0-100" },
    { label: "₹100 - ₹500", value: "100-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "₹1000 - ₹2000", value: "1000-2000" },
    { label: "₹2000 - ₹5000+", value: "2000-5000+" },
  ];

  const categories = [
    { label: "All Categories", value: "" },
    { label: "Study Essentials", value: "Study Essentials" },
    { label: "Room & Living", value: "Room & Living" },
    { label: "Tech & Accessories", value: "Tech & Accessories" },
    { label: "Health & Fitness", value: "Health & Fitness" },
  ];

  const conditions = [
    { label: "All Conditions", value: "" },
    { label: "New", value: "New" },
    { label: "Like New", value: "Like New" },
    { label: "Used - Good", value: "Used - Good" },
    { label: "Used - Acceptable", value: "Used - Acceptable" },
  ];

  const locations = [
    { label: "All Locations", value: "" },
    { label: "On-Campus", value: "On-Campus" },
    { label: "Nearby", value: "nearby" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setFilters({ locationType: "", condition: "", category: "", priceRange: "" });
    onFilterChange({ locationType: "", condition: "", category: "", priceRange: "" });
  };

  return (
    <div className="relative z-50 w-full mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white p-2 border rounded-md shadow-md flex items-center gap-2 w-full sm:w-auto"
      >
        <FaFilter className="text-gray-700" /> Filter Products
      </button>
      {isOpen && (
        <div className="absolute left-0 top-12 w-full bg-white p-4 rounded-md shadow-lg border flex flex-wrap gap-2 justify-between z-50">
          <select
            name="locationType"
            value={filters.locationType}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring focus:ring-blue-200 flex-1 min-w-[150px]"
          >
            {locations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="condition"
            value={filters.condition}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring focus:ring-blue-200 flex-1 min-w-[150px]"
          >
            {conditions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring focus:ring-blue-200 flex-1 min-w-[150px]"
          >
            {categories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            name="priceRange"
            value={filters.priceRange}
            onChange={handleChange}
            className="p-2 border rounded-md focus:ring focus:ring-blue-200 flex-1 min-w-[150px]"
          >
            {priceRanges.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="p-2 bg-white border rounded-md text-gray-700 hover:bg-gray-100 flex-1 min-w-[150px]"
          >
            Clear Filters
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-700 hover:text-red-500 flex-1 min-w-[150px]"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;
