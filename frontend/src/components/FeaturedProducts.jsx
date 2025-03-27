import { useEffect, useState, useContext } from "react";
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { CartContext } from '../contexts/CartContext';
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; 

const ProductDialog = ({ product, onClose, currentImageIndex, nextImage, prevImage }) => (
  <AnimatePresence>
    {product && (
      <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
        {/* Background Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Dialog Container */}
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <DialogContent className="w-[90vw] max-w-[90vw] h-[75vh] max-h-[75vh] bg-white/95 rounded-2xl shadow-2xl overflow-y-auto p-4 sm:p-6 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Image */}
              <div className="relative flex justify-center items-center">
                <motion.img
                  key={currentImageIndex}
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full max-h-[250px] sm:max-h-[350px] md:max-h-[500px] object-cover rounded-xl shadow-md"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={prevImage} 
                      className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:scale-110"
                    >
                      <ChevronLeft className="w-5 md:w-6 h-5 md:h-6 text-gray-700" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={nextImage} 
                      className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:scale-110"
                    >
                      <ChevronRight className="w-5 md:w-6 h-5 md:h-6 text-gray-700" />
                    </Button>
                  </>
                )}
              </div>
              
              {/* Product Details */}
              <div className="flex flex-col space-y-3 sm:space-y-5">
                <motion.h2 
                  className="text-lg sm:text-xl md:text-2xl font-semibold text-black leading-tight"
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {product.name}
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-sm sm:text-base"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                >
                  {product.description}
                </motion.p>
                <span className="text-lg sm:text-xl font-bold text-black">₹{product.price}</span>
                {/* WhatsApp CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                >
                  <Button 
                    className="w-full bg-green-500 text-white text-sm sm:text-lg flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl shadow-lg hover:scale-105 hover:bg-green-600 transition-transform duration-200"
                    onClick={() => {
                      if (!product.seller?.phone) {
                        alert('Seller contact unavailable');
                        return;
                      }
                      const message = encodeURIComponent(`Hello, I'm interested in buying ${product.name}. Is it available?`);
                      const whatsappURL = `https://wa.me/${product.seller.phone}?text=${message}`;
                      window.open(whatsappURL, '_blank');
                    }}
                  >
                    <FaWhatsapp className="h-5 sm:h-6 w-5 sm:w-6" />
                    Chat on WhatsApp to Buy
                  </Button>
                </motion.div>
              </div>
            </div>
          </DialogContent>
        </motion.div>
      </Dialog>
    )}
  </AnimatePresence>
);

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Reset currentImageIndex when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) setCurrentImageIndex(0);
  }, [selectedProduct]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);

  return (
    <div className="min-h-screen p-6">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Featured Products Heading */}
          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              Latest
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {products.sort(() => 0.5 - Math.random()).slice(0, 8).map((product) => (
              <motion.div 
                key={product._id} 
                whileHover={{ scale: 1 }} 
                className="bg-white p-3 rounded-3xl border cursor-pointer" 
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.images[0]} alt={product.name} className="w-full h-52 object-cover rounded-xl" />
                <h3 className="mt-4 text-sm font-bold text-gray-400">{product.name}</h3>
                <h3 className="mt-1 text-md text-gray-900 truncate whitespace-nowrap overflow-hidden">{product.description}</h3>
                <h3 className="mt-1 text-sm font-medium text-gray-400">{product.address}</h3>
                <span className="text-xl font-bold text-gray-700">₹{product.price}</span> 
                <div>
                  <span className="text-xs font-bold text-green-700">₹0 platform fee (EarlyBirdOffer)</span> 
                </div>
              </motion.div>
            ))}
          </div>

          {/* Explore More Button - Navigate to Buy Page */}
          <div className="flex justify-center mt-10">
            <button 
              className="bg-black hover:bg-gray-500 text-white font-medium px-20 py-2 rounded-md transition-all hover:scale-95"
              onClick={() => navigate("/buy")} // Navigate to Buy Page
            >
              Explore More
            </button>
          </div>
        </>
      )}

      {/* Product Dialog */}
      {selectedProduct && (
        <ProductDialog 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          currentImageIndex={currentImageIndex} 
          nextImage={nextImage} 
          prevImage={prevImage} 
        />
      )}
    </div>
  );
  
};

export default Buy;
