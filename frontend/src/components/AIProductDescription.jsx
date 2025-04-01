import React, { useState } from 'react';

const AIProductDescription = ({ onSaveDescription }) => {
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState({
    title: '',
    features: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Controls dialog visibility

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Function to generate description using AI
  const generateDescription = async () => {
    setLoading(true);
    try {
      const featuresArray = product.features.split(',').map((feature) => feature.trim());

      const response = await fetch(`${API_BASE_URL}/api/ai/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.title,
          features: featuresArray,
        }),
      });

      const data = await response.json();
      if (data.description) {
        setProduct({ ...product, description: data.description });
      } else {
        alert('Failed to generate description');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Error generating description');
    }
    setLoading(false);
  };

  // Close dialog function
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-xs p-4 rounded-lg shadow-lg space-y-4">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={closeDialog}
                className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
              >
                &times;
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Product Title</label>
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter title"
              />
            </div>

            {/* Features Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Product Features</label>
              <textarea
                name="features"
                value={product.features}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="List features"
              />
            </div>

            {/* Generate Description Button */}
            <div>
              <button
                type="button"
                onClick={generateDescription}
                className="w-full py-2 px-3 bg-blue-500 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {/* Description Output */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Generated Description</label>
              <textarea
                name="description"
                value={product.description}
                readOnly
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Generated description will appear here"
              />
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => {
                  onSaveDescription(product.description);
                  closeDialog();
                }}
                className="px-3 py-1 bg-blue-600 text-white font-medium rounded-md shadow-md 
                  hover:bg-blue-700 transition duration-200 transform hover:scale-105 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
              >
                Use AI
              </button>
              <button
                onClick={closeDialog}
                className="px-3 py-1 bg-white text-blue-600 font-medium rounded-md border border-blue-600 shadow-md 
                  hover:bg-blue-100 transition duration-200 transform hover:scale-105 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIProductDescription;
