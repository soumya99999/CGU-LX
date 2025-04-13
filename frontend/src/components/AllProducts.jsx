import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { X, ChevronUp, ChevronDown } from "lucide-react";

export const AllProducts = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [carouselStartIndex, setCarouselStartIndex] = useState(0);
    const [maxVisible, setMaxVisible] = useState(window.innerWidth < 900 ? 2 : 4);

    // Handle window resize to adjust maxVisible thumbnails
    useEffect(() => {
        const handleResize = () => {
            setMaxVisible(window.innerWidth < 900 ? 2 : 4);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Navigate carousel up
    const prevCarouselImage = () => {
        if (carouselStartIndex > 0) {
            setCarouselStartIndex((prev) => prev - 1);
        }
    };

    // Navigate carousel down
    const nextCarouselImage = () => {
        if (carouselStartIndex + maxVisible < product.images.length) {
            setCarouselStartIndex((prev) => prev + 1);
        }
    };

    // Calculate visible images for the carousel
    const visibleImages = product?.images?.slice(
        carouselStartIndex,
        carouselStartIndex + maxVisible
    ) || [];

    return (
        <AnimatePresence>
            {product && (
                <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
                    {/* Background Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Dialog Container */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 pt-24"
                        initial={{ opacity: 0, scale: 0.98, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 20 }}
                        transition={{ duration: 0.35, ease: "anticipate" }}
                    >
                        <DialogContent className="w-full max-w-[95vw] md:max-w-[900px] h-[90vh] sm:h-[85vh] md:h-[80vh] border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden bg-white mt-16 shadow-2xl">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 z-50 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Main Content */}
                            <div className="flex flex-col md:flex-row h-full gap-4 sm:gap-6 md:gap-8">
                                {/* Image Section */}
                                <div className="flex flex-col-reverse md:flex-row h-[50%] md:h-full gap-2 md:gap-4 flex-1">
                                    {/* Thumbnails */}
                                    <div className="hidden md:flex flex-col items-center space-y-2 w-20">
                                        {product.images.length > maxVisible && (
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

                                        <div className="flex flex-col items-center space-y-2 overflow-y-auto scrollbar-hide max-h-[calc(100%-48px)]">
                                            {visibleImages.map((image, index) => (
                                                <motion.button
                                                    key={index}
                                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${currentImageIndex === index + carouselStartIndex
                                                            ? "border-blue-500"
                                                            : "border-transparent"
                                                        }`}
                                                    onClick={() =>
                                                        setCurrentImageIndex(index + carouselStartIndex)
                                                    }
                                                >
                                                    <img
                                                        src={image}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>

                                        {product.images.length > maxVisible && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={nextCarouselImage}
                                                className="bg-white p-1 rounded-full hover:bg-gray-50"
                                                disabled={
                                                    carouselStartIndex + maxVisible >= product.images.length
                                                }
                                            >
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Main Image */}
                                    <div className="relative flex-1 h-full">
                                        <motion.img
                                            key={currentImageIndex}
                                            src={product.images[currentImageIndex]}
                                            alt={product.name}
                                            className="w-full h-full object-contain rounded-xl"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="flex flex-col justify-between flex-1 gap-4 sm:gap-6">
                                    <div className="space-y-3 sm:space-y-4">
                                        <motion.h2
                                            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {product.name}
                                        </motion.h2>
                                        <motion.p
                                            className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1, duration: 0.4 }}
                                            style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
                                        >
                                            {product.description}
                                        </motion.p>
                                        <motion.span
                                            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15, duration: 0.4 }}
                                        >
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </motion.span>
                                    </div>

                                    {/* WhatsApp CTA */}
                                    <motion.div
                                        className="flex flex-col gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                    >
                                        <Button
                                            className="w-full bg-green-500 text-white text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl shadow-lg hover:scale-105 hover:bg-green-600 transition-transform duration-200"
                                            onClick={() => {
                                                try {
                                                    console.log("Product data:", product);
                                                    const sellerPhone = product.seller?.phone || product.phone || product.contact;
                                                    console.log("Found phone number:", sellerPhone);
                                                    if (!sellerPhone) {
                                                        alert("Seller contact information is not available");
                                                        return;
                                                    }
                                                    const cleanPhone = sellerPhone.replace(/[^0-9]/g, "");
                                                    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
                                                    console.log("Formatted phone number:", formattedPhone);
                                                    const message = `Hi, I'm interested in buying ${product.name} for ₹${product.price}. Is it still available?`;
                                                    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
                                                    console.log("WhatsApp URL:", whatsappUrl);
                                                    window.open(whatsappUrl, "_blank");
                                                } catch (error) {
                                                    console.error("Error opening WhatsApp:", error);
                                                    alert("Unable to open WhatsApp. Please try again later.");
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
    );
};

export default AllProducts;