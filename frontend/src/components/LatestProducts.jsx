import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductDialog } from "./productDialog";
import { Button } from "../ui/button";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const navigate = useNavigate();

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
        const latest = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);

        setProducts(latest);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_BASE_URL]);

  const handleProductClick = async (product) => {
    setSelectedProduct(product);

    try {
      await fetch(`${API_BASE_URL}/api/products/${product._id}/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error updating click count:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin" />
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

  return (
    <section className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-4 sm:mb-4">
      <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // Smaller base text size, scales up
      className="text-md sm:text-4xl lg:text-5xl font-bold text-center lg:mt-8 mb-0 sm:mb-0 lg:mb-0 bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent"
    >
      Latest Products
    </motion.h2>
    <span className="px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm md:px-3 lg:mt-8 md:text-base lg:px-4 lg:text-lg font-medium bg-blue-100 text-blue-800 rounded-full inline-block">
  Just Arrived
</span>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-3 sm:p-4 rounded-2xl border shadow-sm cursor-pointer transition"
            onClick={() => handleProductClick(product)}
          >
            <div
              className="w-full h-44 sm:h-56 rounded-xl overflow-hidden relative"
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {hoveredProduct === product._id ? (
                <Swiper
                  modules={[Autoplay, Pagination]}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 1000 }}
                  loop
                  className="w-full h-44 sm:h-56"
                >
                  {product.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <h3 className="mt-1 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-black truncate whitespace-nowrap overflow-hidden">
                {product.name}
              </h3>


              <h3 className="mt text-xs sm:text-md text-gray-500 truncate whitespace-nowrap overflow-hidden">
                {product.description}
              </h3>

                            {/* <h3 className="mt-1 text-xs sm:text-sm font-medium text-gray-400">{product.address}</h3> */}
                            <span className="text-base sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-700">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

                            <div>
                            <span className="text-xs sm:text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md inline-block">
                ₹0 platform fee <span className="text-[10px] sm:text-xs font-normal">EarlyBirdOffer</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button
          className="px-6 py-3 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
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
    </section>
  );
};

export default LatestProducts;
