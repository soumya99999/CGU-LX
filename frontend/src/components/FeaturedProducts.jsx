import { useEffect, useState, useContext } from "react";
import { useAuth } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { MessageSquare, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
<<<<<<< HEAD
=======
import { FaWhatsapp } from "react-icons/fa";
>>>>>>> fa10e6326f90fc4c5b7c97b879eddabdfae116e0




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
  
    // Log the user and seller IDs for debugging
    console.log("User ID:", user._id);  // Use user._id here
    console.log("Seller ID:", mainProduct.seller._id);  // Use seller._id here
  
    // Check if the user and seller are both available before comparing
    if (user._id && mainProduct.seller._id) {
      if (user._id === mainProduct.seller._id) {
        // If the user is the seller, do not allow WhatsApp interaction
        toast.error("This is your product.");
        return;
      }
    }
  
    if (!mainProduct.seller?.phone) {
      toast.error("Seller contact unavailable");
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
      <Toaster />
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
          <DialogContent className="w-full max-w-[95vw] md:max-w-[850px] h-[90vh] sm:h-[80vh] border border-gray-200 rounded-2xl p-4 sm:p-6 overflow-hidden bg-white mt-16 ">


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
                <div className="flex flex-col gap-2 mb-10">
                  {/* <Button
                    className="w-full bg-green-100 hover:bg-green-200 text-green-800 h-12 rounded-lg"
                    onClick={() => addToCart(mainProduct)}
                  >
                    Add to Cart
                  </Button> */}
                  
                  <Button
            className="w-full bg-green-100 hover:bg-green-200 text-green-800 h-12 rounded-lg flex items-center gap-2"
            onClick={handleWhatsAppClick}
          >
            <FaWhatsapp className="h-5 sm:h-6 w-5 sm:w-6" />
            {user?._id && mainProduct.seller?._id && user._id === mainProduct.seller._id
              ? "You can't chat with yourself"
              : "Chat via WhatsApp"}
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
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const [filters, setFilters] = useState({
    locationType: "",
    condition: "",
    category: "",
    priceRange: "",
  });
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


  useEffect(() => {
    const fetchProducts = async () => {
      if (!API_BASE_URL) {
        setError("API URL is missing.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const data = await res.json();
        const shuffledProducts = data.sort(() => 0.5 - Math.random()).slice(0, 8);
        setProducts(shuffledProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }
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

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <h2 className="text-4xl sm:text-4xl font-semibold text-gray-900">
          Featured Products
        </h2>
        <span className="px-4 py-2 text-sm sm:text-base font-medium bg-blue-100 text-blue-800 rounded-full">
          New Arrivals
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {products.map((product) => (
<<<<<<< HEAD
          <motion.div
            key={product._id}
            whileHover={{ y: -4 }}
            className="group bg-white p-3 rounded-2xl border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setSelectedProduct(product)}
          >
            {/* <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src={product.images?.[0] || "/fallback-image.jpg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div> */}

<motion.div
                key={product._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-2 sm:p-4 rounded-2xl border cursor-pointer"
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
                      autoplay={{ delay: 1000 }}
                      loop
                      className="w-full h-40 sm:h-52"
                    >
                      {product.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt={`${product.name} ${index}`}
                            className="w-full h-40 sm:h-52 object-cover rounded-xl"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 sm:h-52 object-cover rounded-xl"
                    />
                  )}
                </div>
                <h3 className="mt-1 sm:mt-4 text-md sm:text-md font-bold text-black">{product.name}</h3>
                <h3 className="mt text-xs sm:text-md text-gray-500 truncate overflow-hidden">
                  {product.description}
                </h3>
                {/* <h3 className="mt-1 text-xs sm:text-sm font-medium text-gray-400">{product.address}</h3> */}
                <span className="text-lg sm:text-xl font-bold text-gray-700">₹{product.price.toLocaleString("en-IN")}
                </span>
                <div>
                  <span className="text-xs font-bold text-green-700">
                    ₹0 platform fee (EarlyBirdOffer)
                  </span>
                </div>
              </motion.div>

            {/* <div className="mt-4 space-y-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
=======
              <motion.div
              key={product._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-2 sm:p-4 rounded-2xl border cursor-pointer"
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
                    autoplay={{ delay: 1000 }}
                    loop
                    className="w-full h-40 sm:h-52"
                  >
                    {product.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`${product.name} ${index}`}
                          className="w-full h-40 sm:h-52 object-cover rounded-xl"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-40 sm:h-52 object-cover rounded-xl"
                  />
                )}
              </div>
              <h3 className="mt-1 sm:mt-4 text-md sm:text-md font-bold text-black">{product.name}</h3>
>>>>>>> fa10e6326f90fc4c5b7c97b879eddabdfae116e0
              <h3 className="mt text-xs sm:text-md text-gray-500 truncate overflow-hidden">
                {product.description}
              </h3>
              {/* <h3 className="mt-1 text-xs sm:text-sm font-medium text-gray-400">{product.address}</h3> */}
              <span className="text-lg sm:text-xl font-bold text-gray-700">₹{product.price.toLocaleString("en-IN")}
              </span>
              <div>
                <span className="text-xs font-bold text-green-700">
                  ₹0 platform fee (EarlyBirdOffer)
                </span>
              </div>
<<<<<<< HEAD
            </div> */}
          </motion.div>
=======
            </motion.div>
>>>>>>> fa10e6326f90fc4c5b7c97b879eddabdfae116e0
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
