import { Link } from "react-router-dom";
import aboutImage from "../assets/banner.jpg"; // Add an appropriate image in the assets folder
import missionImage from "../assets/mission.jpg"; // Another image for mission section
import offerImage from "../assets/offer.jpg"; // Another image for offerings

const About = () => {
  return (
    <div className="max-w-5xl min-h-screen mx-auto p-6 pt-5">
      {/* Banner Section */}
      <div className="relative w-full h-60 md:h-80 rounded-lg overflow-hidden shadow-lg">
        <img src={aboutImage} alt="About CGU Marketplace" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">About Us</h1>
        </div>
      </div>

      {/* Introduction */}
      <p className="text-gray-600 mt-8 text-lg text-center">
        Finding the right buyer or seller on campus is often **challenging**. 
        We created <a href="/" className="font-semibold text-blue-500 hover:text-blue-800">CGUMarketplace</a>—a **dedicated platform** built by students, for students, to make campus transactions <span className="font-semibold">easier, safer, and efficient.</span>
      </p>

      {/* Mission Section */}
      <div className="mt-12 flex flex-col md:flex-row items-center gap-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <img src={missionImage} alt="Mission" className="w-full md:w-1/3 rounded-lg object-cover shadow-md" />
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold text-blue-600">Our Mission</h2>
          <p className="text-gray-600 mt-3">
            We aim to **bridge the gap** between buyers and sellers within the **university community**. Our goal is to create a <span className="font-semibold">trusted, student-friendly marketplace</span> where transactions are smooth and hassle-free.
          </p>
        </div>
      </div>

      {/* Offerings */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-blue-600">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Offer Item 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center">
            <h3 className="font-semibold text-gray-800">A Centralized Platform</h3>
            <p className="text-gray-600 text-sm">Say goodbye to scattered listings. Everything you need is in one place.</p>
          </div>
          {/* Offer Item 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center">
            <h3 className="font-semibold text-gray-800">A Trusted Community</h3>
            <p className="text-gray-600 text-sm">Only verified students can buy and sell, ensuring security.</p>
          </div>
          {/* Offer Item 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center">
            <h3 className="font-semibold text-gray-800">Easy & Fast Transactions</h3>
            <p className="text-gray-600 text-sm">List items in seconds and find buyers effortlessly.</p>
          </div>
          {/* Offer Item 4 */}
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center">
            <h3 className="font-semibold text-gray-800">Safe & Transparent Deals</h3>
            <p className="text-gray-600 text-sm">Verified profiles, reviews, and fair pricing ensure trust.</p>
          </div>
        </div>
      </div>

      {/* Why We Built This Section */}
      <div className="mt-12 flex flex-col md:flex-row items-center gap-6 bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold text-blue-600">Why We Built CGU Marketplace</h2>
          <p className="text-gray-600 mt-3">
            We **faced these challenges** firsthand, and instead of waiting for a solution, we decided to **build one**. CGU Marketplace is a **community-driven initiative** to help students save money, reduce waste, and make campus life **more convenient**.
          </p>
        </div>
        <img src={offerImage} alt="Why We Built" className="w-full md:w-1/3 rounded-lg object-cover shadow-md" />
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-blue-600 text-white text-center py-8 rounded-lg shadow-lg relative">
        
        <Link 
          to="https://www.instagram.com/cgumarketplace/" 
          className="inline-block bg-white text-blue-600 font-bold py-3 px-6 mt-4 rounded-lg hover:bg-gray-200 transition-all"
        >
          Join Us
        </Link>
        <p className="mt-2 text-gray-100">Be a part of the community and start buying & selling today!</p>

      </div>
    </div>
  );
};

export default About;
