import { useState } from "react";

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    // name: "",
    locationType: "",
    condition: "",
    category: "",
    priceRange: "",
  });

  const priceRanges = [
    { label: "All Price Ranges", value: "" },
    { label: "₹0 - ₹100", value: "0-100" },
    { label: "₹100 - ₹500", value: "100-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "₹1000 - ₹2000", value: "1000-2000" },
    { label: "₹2000 - ₹5000+", value: "2000-5000" },
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
      console.log(`Filter Updated: ${name} = ${value}`);
      console.log("Current Filters:", updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Filter Products</h2>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Search by Name"
          className="p-2 border rounded-md w-full focus:ring focus:ring-blue-200"
        /> */}

        <select
          name="locationType"
          value={filters.locationType}
          onChange={handleChange}
          className="p-2 border rounded-md w-full focus:ring focus:ring-blue-200"
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
          className="p-2 border rounded-md w-full focus:ring focus:ring-blue-200"
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
          className="p-2 border rounded-md w-full focus:ring focus:ring-blue-200"
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
          className="p-2 border rounded-md w-full focus:ring focus:ring-blue-200"
        >
          {priceRanges.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export default Filter;