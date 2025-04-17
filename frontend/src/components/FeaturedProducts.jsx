import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductDialog } from "./productDialog";
import { Button } from '../ui/button';


const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

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
        Top Picks
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {products.map((product) => (
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
        ))}
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

export default FeaturedProducts;