import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation styles
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import the AuthContext hook

const desktopImages = ["/temp01.png", "/temmp02.png"];
const mobileImages = ["/mobile01.jpg", "/mobile02.jpg"];

const Carousel = () => {
  const { user } = useAuth(); // Get the user authentication status from context
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;
  const redirectTo = user ? "/buy" : "/login";

  return (
    <div className="relative w-full px-4 sm:px-8 max-w-screen-2xl sm:max-w-[85vw] md:max-w-screen-lg lg:max-w-screen-2xl mx-auto overflow-hidden rounded-xl my-8 group">
      <Link
        to={redirectTo}
        className="block hover:scale-[1.02] md:hover:scale-[0.97] active:scale-[1.01] transition-transform duration-500 ease-out"
      >
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: user ? 2000 : 2500, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{ clickable: true }}
          touchStartPreventDefault={false}
          className="w-full h-[25vh] sm:h-[35vh] md:h-[45vh] lg:h-[55vh] xl:h-[65vh]"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain sm:object-cover md:object-cover transition-opacity duration-700 ease-in-out rounded-xl"
                onError={(e) => {
                  console.error("Image not found:", e.target.src);
                  e.target.src = "/fallback.jpg";
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Link>
    </div>
  );
};

export default Carousel;
