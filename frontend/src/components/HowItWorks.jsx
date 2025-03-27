import { Link } from "react-router-dom";
import { FaUserCheck, FaSearch, FaUpload, FaHandshake } from "react-icons/fa";

const HowItWorks = ({ isAuthenticated }) => {
  return (
    <div className="max-w-5xl min-h-screen mx-auto p-6 pt-10 space-y-12">
      
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-black tracking-wide">
          How It Works
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          A simple and secure way to buy and sell within your campus community.
        </p>
      </div>

      {/* Step-by-Step Guide */}
      <div className="space-y-8 ">
        <h2 className="text-3xl font-bold text-black text-center">
          Follow These Easy Steps
        </h2>

        <div className="space-y-8">
          {[
            { icon: <FaUserCheck className="text-black text-4xl" />, title: "Sign Up & Verify", desc: "Create an account using your university email for a secure experience." },
            { icon: <FaSearch className="text-black text-4xl" />, title: "Browse Listings", desc: "Find what you need from various products on campus." },
            { icon: <FaUpload className="text-black text-4xl" />, title: "Sell an Item", desc: "Selling something? List your item in just a few clicks." },
            { icon: <FaHandshake className="text-black text-4xl" />, title: "Connect & Trade", desc: "Chat with buyers/sellers, meet safely, and complete the deal." },
          ].map(({ icon, title, desc }, index) => (
            <div key={index} className="flex items-center space-x-6">
              <div className="flex-shrink-0">{icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-white from-blue-600 to-blue-800 text-black text-center py-10 rounded-3xl border-2 border-black relative">
        <h3 className="text-3xl font-semibold">Start Buying & Selling Today!</h3>
        <p className="text-gray-600">Join CGU Marketplace and make campus transactions hassle-free.</p>
        
        <div className="mt-4 flex justify-center space-x-4">
          <Link to="/buy" className="inline-block bg-black text-white font-bold py-3 px-8 mt-4 rounded-lg hover:bg-gray-700 hover:scale-95 transition-all duration-200">
            Browse Listings
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HowItWorks;
