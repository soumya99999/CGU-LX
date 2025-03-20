import { Link } from "react-router-dom";
import { Mail, Instagram } from "lucide-react"; // ✅ Import icons

const Footer = () => {
  return (
    <footer className=" mt-20 bg-gray-800 text-gray-400 text-center py-6 border-t-4 border-gray-400 absolute bottom-0 w-full rounded-t-3xl ">
      <div className="max-w-7xl mx-auto px-1 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} CGUMarketplace
        </p>
        
        {/* Navigation Links */}
        <nav className="flex space-x-6 mt-3 sm:mt-0">
          <Link to="/About" className="text-gray-400 hover:text-white transition">About</Link>
          <Link to="/terms" className="text-gray-400 hover:text-white transition">Terms</Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy</Link>
        </nav>

        {/* Contact Section (Separated) */}
        <div className="mt-4 sm:mt-0 flex flex-col items-center  sm:items-start">
          <span className="text-gray-400 font-semibold">Contact Us</span>
          <div className="flex space-x-4 mt-2">
            <a href="mailto:cgumarketplace@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Mail size={20} />
            </a>
            <a href="https://instagram.com/cgumarketplace" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
