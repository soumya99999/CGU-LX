import { Link } from "react-router-dom";
import aboutImage from "../assets/banner.webp";
import missionImage from "../assets/mission.jpg";
import offerImage from "../assets/offer.jpg";

const About = () => {
  return (
    <div className="max-w-6xl min-h-screen mx-auto p-6 pt-5 space-y-12">
    {/* // <div className="max-w-6xl min-h-screen mx-auto p-6 pt-5 space-y-12 font-lora"> */}


      {/* Banner Section */}
      <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-2xl">
        <img
          src={aboutImage}
          alt="About CGU Marketplace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-wide">
            About Us
          </h1>
        </div>
      </div>

      {/* Introduction */}
      <p className="text-gray-700 text-lg text-center px-4 leading-relaxed">
        Finding the right buyer or seller on campus is often{" "}
        <strong className="text-blue-600">challenging</strong>. We created{" "}
        <a href="/" className="font-semibold text-blue-500 hover:underline">
          CGUMarketplace
        </a>
        —a <strong className="text-blue-600">dedicated platform</strong> built
        by students, for students, to make campus transactions{" "}
        <strong className="text-blue-600">easier, safer, and efficient.</strong>
      </p>

      {/* Mission Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-100 p-8 rounded-lg shadow-lg">
        <img
          src={missionImage}
          alt="Mission"
          className="w-full md:w-1/3 rounded-lg object-cover shadow-md transition-transform hover:scale-105 duration-300"
        />
        <div className="md:w-2/3 space-y-3">
          <h2 className="text-3xl font-bold text-blue-600">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We aim to <strong className="text-blue-600">bridge the gap</strong>{" "}
            between buyers and sellers within the{" "}
            <strong className="text-blue-600">university community</strong>. Our
            goal is to create a{" "}
            <strong className="text-blue-600">
              trusted, student-friendly marketplace
            </strong>{" "}
            where transactions are smooth and hassle-free.
          </p>
        </div>
      </div>

      {/* Offerings */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-blue-600">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            [
              "A Centralized Platform",
              "Say goodbye to scattered listings. Everything you need is in one place.",
            ],
            [
              "A Trusted Community",
              "Only verified students can buy and sell, ensuring security.",
            ],
            [
              "Easy & Fast Transactions",
              "List items in seconds and find buyers effortlessly.",
            ],
            [
              "Safe & Transparent Deals",
              "Verified profiles, reviews, and fair pricing ensure trust.",
            ],
          ].map(([title, desc], index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center transition-transform hover:scale-105 duration-300"
            >
              <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
              <p className="text-gray-600 text-sm mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why We Built This Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-100 p-8 rounded-lg shadow-lg">
        <div className="md:w-2/3 space-y-3">
          <h2 className="text-3xl font-bold text-blue-600">
            Why We Built CGU Marketplace
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We <strong className="text-blue-600">faced these challenges</strong>{" "}
            firsthand, and instead of waiting for a solution, we decided to{" "}
            <strong className="text-blue-600">build one</strong>. CGU
            Marketplace is a{" "}
            <strong className="text-blue-600">
              community-driven initiative
            </strong>{" "}
            to help students save money, reduce waste, and make campus life{" "}
            <strong className="text-blue-600">more convenient</strong>.
          </p>
        </div>
        <img
          src={offerImage}
          alt="Why We Built"
          className="w-full md:w-1/3 rounded-lg object-cover shadow-md transition-transform hover:scale-105 duration-300"
        />
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-10 rounded-lg shadow-lg relative">
        <h3 className="text-3xl font-semibold">Join the Marketplace Today!</h3>
        <p className="mt-2 text-gray-200">
          Be a part of the community and start buying & selling today.
        </p>
        <Link
          to="https://www.instagram.com/cgumarketplace/"
          className="inline-block bg-white text-blue-700 font-bold py-3 px-8 mt-4 rounded-lg hover:bg-gray-200 transition-all duration-300"
        >
          Join Us
        </Link>
      </div>
    </div>
  );
};

export default About;
