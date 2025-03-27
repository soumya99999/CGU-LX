import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const images = ["/temp01.png", "/temmp02.png"];

const Carousel = () => {
  return (
    <div className="relative w-screen overflow-hidden rounded-lg">
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
          className="w-full h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[65vh] xl:h-[75vh]"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-contain sm:object-cover transition-opacity duration-700 ease-in-out"
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
