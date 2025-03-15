import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const images = [
  "/temp01.JPG",
  "/temp02.JPG",
  "/temp03.JPG",
];

const Carousel = () => {
  return (
    <div className="relative w-full  max-w-screen-xl mx-auto overflow-hidden">
  <Link to="/register" className="block hover:scale-[1.02] transition-transform duration-500 ease-out">
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      loop={true}
      navigation={false}
      pagination={{ clickable: true, dynamicBullets: true }}
      className="w-full h-full"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
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
