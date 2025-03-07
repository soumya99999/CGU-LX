import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === parseInt(id));

  if (!product) {
    return (
      <p className="text-red-600 text-center mt-10 text-xl font-semibold">
        ⚠ Product not found.
      </p>
    );
  }

  // Replace the phone number with your WhatsApp number.
  const handleWhatsAppChat = () => {
    const phoneNumber = "1234567890";
    const message = `Hello, I'm interested in ${product.name}. Please provide more details.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-black">
      {/* Left Side: Main Product Image and Optional Thumbnails */}
      <div className="md:w-1/2 flex flex-col items-center p-4">
        <div className="w-full md:w-4/5 lg:w-3/4 mb-4">
          <img
            className="w-full h-auto object-cover rounded-lg border border-gray-200 shadow-md transition-transform duration-500 hover:scale-105"
            src={product.image}
            alt={product.name}
          />
        </div>
        {product.thumbnails && product.thumbnails.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.thumbnails.map((thumb, index) => (
              <img
                key={index}
                src={thumb}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-16 h-16 object-cover rounded border border-gray-300 cursor-pointer transition-transform hover:scale-110"
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Product Information */}
      <div className="md:w-1/2 p-8 flex flex-col space-y-6">
        <h2 className="text-4xl font-bold">{product.name}</h2>

        {/* Pricing Section */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-semibold text-green-700">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-xl line-through text-gray-500">₹{product.originalPrice}</span>
          )}
          {product.discount && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
              {product.discount} OFF
            </span>
          )}
        </div>

        {/* Ratings Section */}
        {product.rating && (
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 fill-current ${
                    i < product.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.757 4.635 1.122 6.545z" />
                </svg>
              ))}
            </div>
            {product.reviews && (
              <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
            )}
          </div>
        )}

        <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            className="bg-green-600 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-md transition hover:bg-green-700 hover:scale-105"
            onClick={handleWhatsAppChat}
          >
            💬 Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
