import { useState } from "react";

export const Select = ({ children, className = "" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      {children}
    </div>
  );
};

export const SelectTrigger = ({ value, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {value || "Select an option"}
      <span className="ml-2">&#9662;</span> {/* Dropdown arrow */}
    </button>
  );
};

export const SelectContent = ({ isOpen, children, className = "" }) => {
  return isOpen ? (
    <div className={`absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 ${className}`}>
      {children}
    </div>
  ) : null;
};

export const SelectItem = ({ value, onSelect, className = "" }) => {
  return (
    <div
      onClick={() => onSelect(value)}
      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
    >
      {value}
    </div>
  );
};

export const SelectValue = ({ value }) => <span>{value}</span>;
