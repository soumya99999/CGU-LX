import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { categories } from "../constants/category"; // Adjust the import path as necessary
import '../custom-css/Category.css';

export default function CategorySection() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -8 },
    tap: { scale: 0.98 },
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-0 sm:py-12 lg:py-0"> {/* Reduced overall padding */}
    {/* --- Heading --- */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      // Smaller base text size, scales up
      className="text-md sm:text-4xl lg:text-5xl font-bold text-center mt-2 mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
    >
      Your campus, Your Marketplace !
    </motion.h2>

    {/* --- Grid Container --- */}
    {/* Mobile: 3 columns (tiny items). Scales up. Smaller gaps needed */}
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }} // Adjusted initial animation
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }} // Faster transition/delay
          // Apply hover only on non-mobile OR use different variants for mobile interaction if desired
          whileHover={!isMobile ? "hover" : undefined}
          whileTap="tap"
          variants={cardVariants}
          // Aspect square kept for uniform grid. Rounded corners reduced slightly.
          className="relative aspect-square rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => !category.comingSoon && category.href && navigate(category.href)}
        >
          {/* --- Background Image & Gradient --- */}
          <div className="absolute inset-0">
            <img
              src={category.image}
              alt={category.title} // Use descriptive alt text
              // Object-cover still works well here
              // Reduced transition duration, disable hover scale on image itself if variant handles it
              className="w-full h-full object-cover transition-transform duration-300"
              loading="lazy"
            />
            {/* Gradient Overlay - Consider making it stronger on small sizes if text is hard to read */}
            <div className={`absolute inset-0 bg-gradient-to-b ${category.color || 'from-black/70 to-transparent'}`} />
          </div>

          {/* --- Content Container --- */}
          {/* Drastically reduced padding on mobile. Justify content differently maybe? */}
          {/* Centering content might be better for thumb size */}
          <div className="relative h-full flex flex-col justify-end items-center p-1.5 sm:p-2 md:p-3 lg:p-4 text-white text-center">

            {/* Icon: Hidden on mobile, small on sm, larger later */}
            {category.icon && (
              <category.icon className="hidden sm:block w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 absolute top-2 left-2 sm:top-3 sm:left-3 lg:top-4 lg:left-4 text-white/80" />
            )}

            {/* Coming Soon Badge: Tiny, positioned absolutely, hidden on mobile */}
            {category.comingSoon && (
                <span className="hidden sm:inline-block absolute top-1 right-1 sm:top-2 sm:right-2 px-1 sm:px-1.5 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-[8px] sm:text-[10px] font-medium text-black/80">
                  Soon
                </span>
            )}

            {/* Text Content Area (only title visible on mobile) */}
            <div className="space-y-1">
              {/* Title: Very small on mobile, centered */}
              <h3 className="text-[15px] leading-tight sm:text-xl md:text-xl  lg:text-5xl font-semibold sm:font-bold tracking-tight drop-shadow-sm">
                {category.title}
              </h3>

              {/* Description: Hidden on mobile and sm screens */}
              <p className="hidden md:block text-[10px] lg:text-lg leading-snug text-white/80 max-w-full">
                {category.description}
              </p>
            </div>
          </div>

          {/* --- Interactive Overlays --- */}
          {/* Simplified border, maybe remove on mobile? */}
          <div className="absolute inset-0 border border-white/5 sm:border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl group-hover:border-white/20 transition-all pointer-events-none" />
          {/* Noise opacity reduced */}
          {/* <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" /> */}
        </motion.div>
      ))}
    </div>
  </section>
  );
}