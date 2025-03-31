import { useNavigate } from "react-router-dom";
import { ShoppingCart, DollarSign, HelpCircle, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const categories = [
  {
    id: "buy",
    title: "BUY",
    description: "Discover unique items from your campus community",
    icon: ShoppingCart,
    color: "from-pink-500/20 to-pink-700/30",
    href: "/buy",
    image: "/2.png",
  },
  {
    id: "sell",
    title: "SELL",
    description: "Turn your pre-loved items into campus cash",
    icon: IndianRupee,
    color: "from-blue-500/20 to-blue-700/30",
    href: "/sell",
    image: "/4.png",
  },
  {
    id: "request",
    title: "REQUEST",
    description: "Seek what you need, find campus solutions",
    icon: HelpCircle,
    color: "from-purple-500/20 to-purple-700/30",
    comingSoon: true,
    image: "/6.png",
  },
];

export default function CategorySection() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -8 },
    tap: { scale: 0.98 },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
      >
        Explore Your <span className="text-blue-500">CGU</span><span className="text-yellow-500">Marketplace</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.15 }}
            whileHover={!isMobile ? "hover" : undefined}
            whileTap="tap"
            variants={cardVariants}
            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => !category.comingSoon && category.href && navigate(category.href)}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <img
                src={category.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-b ${category.color}`} />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-6 sm:p-8 text-white">
              <div className="flex justify-between items-start">
                <category.icon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5] text-white/90" />
                {category.comingSoon && (
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-black/90">
                    Coming Soon
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {category.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-white/90 max-w-[80%]">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Interactive Overlay */}
            <div className="absolute inset-0 border-2 border-white/10 rounded-2xl group-hover:border-white/20 transition-all" />
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        @media (max-width: 640px) {
          .aspect-square {
            aspect-ratio: 1/1;
            height: auto;
          }
        }
      `}</style>
    </section>
  );
}