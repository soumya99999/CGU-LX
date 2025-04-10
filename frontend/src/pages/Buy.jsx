import { useEffect, useState, useContext } from "react";
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { CartContext } from '../contexts/CartContext';
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Filter from "../components/Filter"

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
          <DialogContent className="w-full max-w-[95vw] md:max-w-[850px] h-[90vh] sm:h-[80vh] border border-gray-200 rounded-2xl p-4 sm:p-6 overflow-hidden bg-white mt-16 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Image */}
              <div className="relative flex justify-center items-center">
                <motion.img
                  key={currentImageIndex}
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain sm:object-cover rounded-xl"
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
                  style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
                >
                  {product.description}
                </motion.p>

                <span className="text-lg sm:text-xl font-bold text-black">
                   ₹{product.price.toLocaleString("en-IN")}
                </span>

                {/* WhatsApp CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                >
                  <Button 
                    className="w-full bg-green-500 text-white text-sm sm:text-lg flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl shadow-lg hover:scale-105 hover:bg-green-600 transition-transform duration-200"
                    onClick={() => {
                      try {
                        console.log('Product data:', product);
                        const sellerPhone = product.seller?.phone || product.phone || product.contact;
                        console.log('Found phone number:', sellerPhone);
                        if (!sellerPhone) {
                          alert('Seller contact information is not available');
                          return;
                        }
                        const cleanPhone = sellerPhone.replace(/[^0-9]/g, '');
                        const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                        console.log('Formatted phone number:', formattedPhone);
                        const message = `Hi, I'm interested in buying ${product.name} for ₹${product.price}. Is it still available?`;
                        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
                        console.log('WhatsApp URL:', whatsappUrl);
                        window.open(whatsappUrl, '_blank');
                      } catch (error) {
                        console.error('Error opening WhatsApp:', error);
                        alert('Unable to open WhatsApp. Please try again later.');
                      }
                    }}
                  >
                    <FaWhatsapp className="h-5 sm:h-6 w-5 sm:w-6" />
                    Let’s Chat & Seal the Deal 💬
                  </Button>
                </motion.div>
              </div>
            </div>
          </DialogContent>
        </motion.div>
      </Dialog>
    )}
  </AnimatePresence>
)



const Buy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const [filters, setFilters] = useState({
    locationType: "",
    condition: "",
    category: "",
    priceRange: "",
  });

  useEffect(() => {
    console.log("Filters updated:", filters);
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    if (selectedProduct) setCurrentImageIndex(0);
  }, [selectedProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    console.log("Fetching products with query:", queryParams.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/filter?${queryParams.toString()}`);
      const data = await response.json();
      console.log("Fetched Products:", data);

      if (data.success) {
        if (data.products.length === 0) {
          console.warn("No products found");
        }
        setProducts(data.products);
      } else {
        setProducts([]);
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProductClick = async (product) => {
    setSelectedProduct(product);
  
    try {
      await fetch(`${API_BASE_URL}/api/products/${product._id}/click`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating click count:", error);
    }
  };
  
  

  const handleFilterChange = (newFilters) => {
    console.log("Filters received from Filter component:", newFilters);
    setFilters(newFilters);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="mb-6">
        <Filter onFilterChange={handleFilterChange} />
      </div>
  
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-4 border-t-transparent border-green-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div
                  className="w-full h-40 sm:h-52 rounded-xl overflow-hidden relative"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {hoveredProduct === product._id ? (
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 1500 }}
                      loop
                      className="w-full h-full"
                    >
                      {product.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt={`${product.name} ${index}`}
                            className="w-full h-40 sm:h-52 object-cover rounded-xl transition-all duration-300"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 sm:h-52 object-cover rounded-xl transition-transform duration-300"
                    />
                  )}
                </div>
  
                <div className="mt-3 sm:mt-4 space-y-1">
                  <h3 className="text-md sm:text-lg font-semibold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                  <span className="text-lg sm:text-xl font-bold text-green-700 block">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md inline-block">
                    ₹0 platform fee <span className="text-[10px]">EarlyBirdOffer</span>
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-80">
              <p className="text-gray-700 text-lg font-medium">
                No products found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      )}
  
      {selectedProduct && (
        <ProductDialog 
          product={{ ...selectedProduct, images: selectedProduct.images }} 
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
