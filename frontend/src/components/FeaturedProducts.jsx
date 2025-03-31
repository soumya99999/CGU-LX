import { useEffect, useState, useContext } from "react";
import { useAuth } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { MessageSquare, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


const ProductDialog = ({ products, initialProduct, onClose }) => {
  const [mainProduct, setMainProduct] = useState(initialProduct);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [maxVisible, setMaxVisible] = useState(window.innerWidth < 900 ? 2 : 4);
  const { user } = useAuth();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

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

  const prevCarouselImage = () => {
    if (carouselStartIndex > 0) {
      setCarouselStartIndex(prev => prev - 1);
    }
  };

  const nextCarouselImage = () => {
    if (carouselStartIndex + maxVisible < mainProduct.images.length) {
      setCarouselStartIndex(prev => prev + 1);
    }
  };

  const handleWhatsAppClick = () => {
    if (!user) {
      navigate("/login");
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
  };

  useEffect(() => {
    const handleResize = () => {
      setMaxVisible(window.innerWidth < 900 ? 2 : 4);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleImages = mainProduct?.images?.slice(carouselStartIndex, carouselStartIndex + maxVisible) || [];

  if (!mainProduct) return null;

  return (
    <AnimatePresence>
      <Dialog open={!!mainProduct} onOpenChange={(open) => !open && onClose()}>
        <motion.div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 pt-24"
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 20 }}
          transition={{ duration: 0.35, ease: "anticipate" }}
        >
          <DialogContent className="w-full max-w-[95vw] md:max-w-[850px] h-[90vh] sm:h-[80vh] border border-gray-200 rounded-2xl p-4 sm:p-6 overflow-hidden bg-white mt-16">

            <button 
              onClick={onClose}
              className="absolute right-4 top-4 z-50 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex flex-col sm:flex-row h-full gap-4 sm:gap-6">
              {/* Left Section */}
              <div className="flex flex-col-reverse sm:flex-row h-[60%] sm:h-full w-full sm:w-1/2 gap-2">
                {/* Thumbnails */}
                <div className="hidden sm:flex flex-col items-center space-y-2 w-20">
                  {mainProduct.images.length > maxVisible && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={prevCarouselImage}
                      className="bg-white p-1 rounded-full hover:bg-gray-50"
                      disabled={carouselStartIndex === 0}
                    >
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    </Button>
                  )}

                  <div className="flex flex-col items-center space-y-2 overflow-y-auto scrollbar-hide">
                    {visibleImages.map((image, index) => (
                      <motion.button
                        key={index}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index + carouselStartIndex 
                            ? 'border-blue-500' 
                            : 'border-transparent'
                        }`}
                        onClick={() => setCurrentImageIndex(index + carouselStartIndex)}
                      >
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>

                  {mainProduct.images.length > maxVisible && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={nextCarouselImage}
                      className="bg-white p-1 rounded-full hover:bg-gray-50"
                      disabled={carouselStartIndex + maxVisible >= mainProduct.images.length}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    </Button>
                  )}
                </div>

                {/* Main Image */}
                <div className="relative flex-1 h-full">
                  <motion.img
                    key={currentImageIndex}
                    src={mainProduct.images[currentImageIndex]}
                    alt={mainProduct.name}
                    className="w-full h-full object-contain sm:object-cover rounded-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col justify-between flex-1 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {mainProduct.name}
                  </h2>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                    ₹{Number(mainProduct.price).toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {timeAgo(mainProduct.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {mainProduct.description}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  {/* <Button
                    className="w-full bg-green-100 hover:bg-green-200 text-green-800 h-12 rounded-lg"
                    onClick={() => addToCart(mainProduct)}
                  >
                    Add to Cart
                  </Button> */}
                  
                  <Button
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 h-12 rounded-lg flex items-center gap-2"
                    onClick={handleWhatsAppClick}
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </motion.div>
      </Dialog>
    </AnimatePresence>
  );
};

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [API_BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-6xl font-semibold text-gray-900">
          Featured Products
        </h2>

        {/* "New Arrivals" Tag */}
        <span className="px-4 py-2 text-sm sm:text-base font-medium bg-blue-100 text-blue-800 rounded-full">
          New Arrivals
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {products.slice(0, 8).map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ y: -4 }}
            className="group bg-white p-3 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="aspect-square overflow-hidden rounded-xl">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            
            <div className="mt-4 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <h3 className="mt text-xs sm:text-md text-gray-500 truncate overflow-hidden">
                  {product.description}
                </h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-medium text-green-600">
                  Free Platform Fee
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8 sm:mt-12">
        <Button
          className="px-8 py-4 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-sm"
          onClick={() => navigate("/buy")}
        >
          View All Products
        </Button>
      </div>

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
