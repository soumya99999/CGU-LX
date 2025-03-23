import React from "react";

const Textarea = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <textarea
      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
    />
  );
};

export default Textarea;
