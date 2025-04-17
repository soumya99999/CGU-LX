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
      <header className="flex items-center justify-between mb-8 sm:mb-10">
        <h2 className="text-4xl font-semibold text-gray-900">Latest Products</h2>
        <span className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 rounded-full">
          Just Arrived
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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

            <h3 className="mt-3 text-lg font-bold text-black">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500 truncate">{product.description}</p>
            <p className="mt-2 text-lg font-bold text-gray-700">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs font-semibold text-green-700">
              ₹0 platform fee <span className="ml-1">(EarlyBirdOffer)</span>
            </p>
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
