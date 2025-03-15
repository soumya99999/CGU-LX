import { useEffect, useState, useContext } from "react";
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { CartContext } from '../contexts/CartContext';
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useContext(CartContext);
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);

  const ProductDialog = ({ product }) => (
    <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
      <AnimatePresence>
      <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[60vw] 2xl:w-[50vw] max-w-[1300px] bg-white/95 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 max-h-[90vh] overflow-y-auto">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6">
            
            {/* Product Image */}
            <div className="relative">
              <motion.img
                key={currentImageIndex}
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full max-h-[250px] sm:max-h-[350px] md:h-[500px] object-cover rounded-xl shadow-md"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
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
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-black leading-tight"
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

              <span className="text-lg sm:text-2xl font-bold text-black">₹{product.price}</span>

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
      </AnimatePresence>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div key={product._id} whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-lg cursor-pointer" onClick={() => setSelectedProduct(product)}>
              <img src={product.images[0]} alt={product.name} className="w-full h-72 object-cover rounded-lg" />
              <h3 className="mt-4 text-xl font-medium text-gray-900">{product.name}</h3>
              <span className="text-lg text-gray-700">₹{product.price}</span>
            </motion.div>
          ))}
        </div>
      )}
      {selectedProduct && <ProductDialog product={selectedProduct} />}
    </div>
  );
};

export default Buy;
