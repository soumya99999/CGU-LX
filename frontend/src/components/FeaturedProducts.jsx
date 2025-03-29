import { useEffect, useState, useContext } from "react";
import { useAuth } from '../contexts/AuthContext'; 

import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { CartContext } from '../contexts/CartContext';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";


const ProductDialog = ({ products, initialProduct, onClose }) => {
  const [mainProduct, setMainProduct] = useState(initialProduct);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  // Calculate time ago (assuming product.createdAt exists)
  const timeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffInMs = now - created;
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Carousel navigation for product images
  const nextCarouselImage = () => {
    const maxVisible = window.innerWidth < 768 ? 2 : 4; // 2 for mobile (<md), 4 for md+
    if (carouselStartIndex + maxVisible < mainProduct.images.length) {
      setCarouselStartIndex((prev) => prev + 1);
    }
  };

  const prevCarouselImage = () => {
    if (carouselStartIndex > 0) {
      setCarouselStartIndex((prev) => prev - 1);
    }
  };

  // Slice the images based on screen size: 2 for mobile, 4 for larger screens
  const [maxVisible, setMaxVisible] = useState(window.innerWidth < 768 ? 2 : 4);

  useEffect(() => {
    const handleResize = () => {
      setMaxVisible(window.innerWidth < 900 ? 2 : 4);
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const visibleImages = mainProduct.images.slice(carouselStartIndex, carouselStartIndex + maxVisible);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <AnimatePresence>
      {mainProduct && (
        <Dialog open={!!mainProduct} onOpenChange={(open) => !open && onClose()}>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Dialog Container */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 mt-20 sm:mt-24"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ duration: 0.35, ease: "anticipate" }}
          >
        <DialogContent className="w-full max-w-[850px] h-[90vh] sm:h-screen border border-gray-200 rounded-2xl p-6 overflow-hidden backdrop-blur-md">


              <div className="flex flex-col sm:flex-row h-full gap-6">
                
                {/* Left Section: Image & Thumbnails */}
                <div className="flex flex-col sm:flex-row h-full w-full sm:w-1/2">
                  {/* Image Container (Fixed Height) */}
                  <div className="flex justify-center items-center p-2 rounded-lg w-full h-[50vh] sm:h-full">
                    <motion.img
                      key={currentImageIndex}
                      src={mainProduct.images[currentImageIndex]}
                      alt={mainProduct.name}
                      className="w-auto h-full max-h-full object-contain rounded-3xl"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>

                  {/* Thumbnails for Desktop */}
                  <div className="hidden sm:flex flex-col items-center space-y-2 ml-2">
                    {mainProduct.images.length > maxVisible && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevCarouselImage}
                        className="bg-white p-2 rounded-full hover:scale-110"
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronUp className="w-6 h-6 text-gray-600" />
                      </Button>
                    )}

                    {/* Thumbnails */}
                    <div className="flex flex-col items-center space-y-2">
                      {visibleImages.map((image, index) => (
                        <motion.div
                          key={index}
                          className="w-[64px] h-[64px] border-2 border-white rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                        </motion.div>
                      ))}
                    </div>

                    {mainProduct.images.length > maxVisible && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextCarouselImage}
                        className="bg-white p-2 rounded-full shadow-md hover:scale-110"
                        disabled={currentImageIndex + maxVisible >= mainProduct.images.length}
                      >
                        <ChevronDown className="w-6 h-6 text-gray-600" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Mobile Thumbnails (Horizontal Scroll) */}
                <div className="sm:hidden flex overflow-x-auto space-x-2 mt-2 pb-2">
                  {visibleImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className="w-[60px] h-[60px] border-2 border-white rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>

                {/* Right Section: Product Info */}
                <div className="flex flex-col justify-between space-y-4 sm:w-1/2">
                  <div>
                    <motion.h2
                      className="text-xl sm:text-2xl font-semibold text-gray-800 leading-tight"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {mainProduct.name}
                    </motion.h2>
                    <motion.p
                      className="text-lg sm:text-xl font-bold text-gray-800 mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                    >
                      ₹{mainProduct.price} • <span className="text-sm text-gray-500">{timeAgo(mainProduct.createdAt)}</span>
                    </motion.p>
                    <motion.p
                      className="text-gray-600 text-sm sm:text-base mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                    >
                      <span className="font-semibold">Description:</span> {mainProduct.description}
                    </motion.p>
                  </div>

                  {/* Message Button */}
                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                  >
                    <Button
  className="bg-yellow-100 text-yellow-700 flex items-center gap-2 hover:bg-yellow-200 shadow-md w-full sm:w-auto"
  onClick={() => {
    if (!user) {
      navigate("/login"); // Redirect to login page if not logged in
      return;
    }
    if (!mainProduct.seller?.phone) {
      alert("Seller contact unavailable");
      return;
    }
    const message = encodeURIComponent(
      `Hello, I'm interested in buying ${mainProduct.name}. Is it available?`
    );
    const whatsappURL = `https://wa.me/${mainProduct.seller.phone}?text=${message}`;
    window.open(whatsappURL, "_blank");
  }}
>
  <MessageSquare className="w-5 h-5 text-yellow-700" />
  Message
</Button>;
                  </motion.div>
                </div>
              </div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};


const Buy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.9)]">
              Latest
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.sort(() => 0.5 - Math.random()).slice(0, 8).map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-50 p-3 rounded-3xl border border-gray-200 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.images[0]} alt={product.name} className="w-full h-52 object-cover rounded-xl" />
                <h3 className="mt-4 text-sm font-bold text-gray-500">{product.name}</h3>
                <h3 className="mt-1 text-md text-gray-800 truncate whitespace-nowrap overflow-hidden">{product.description}</h3>
                <h3 className="mt-1 text-sm font-medium text-gray-500">{product.address}</h3>
                <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
                <div>
                  <span className="text-xs font-bold text-green-600">₹0 platform fee (EarlyBirdOffer)</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              className="bg-black hover:bg-gray-500 text-white font-medium px-20 py-2 rounded-md shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.9)] transition-all hover:scale-95"
              onClick={() => navigate("/buy")}
            >
              Explore More
            </button>
          </div>
        </>
      )}

      {selectedProduct && (
        <ProductDialog
          products={products}
          initialProduct={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Buy;