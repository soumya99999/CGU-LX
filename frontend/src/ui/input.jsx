import React from "react";

const Input = ({ type = "text", placeholder, value, onChange, className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded-md p-2 w-full ${className}`}
    />
  );
};

export default Input; // ✅ Ensure this export is present
