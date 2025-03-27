import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const images = ["/temp01.png", "/temmp02.png"];

const Carousel = () => {
  return (
    <div className="relative w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-screen-lg lg:max-w-screen-xl mx-auto overflow-hidden rounded-lg">
      <Link
        to="/register"
        className="block hover:scale-[1.02] md:hover:scale-[0.97] active:scale-[1.01] transition-transform duration-500 ease-out"
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          touchStartPreventDefault={false}
          className="w-full h-[25vh] sm:h-[35vh] md:h-[45vh] lg:h-[55vh] xl:h-[65vh]"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain sm:object-cover md:object-cover transition-opacity duration-700 ease-in-out"
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