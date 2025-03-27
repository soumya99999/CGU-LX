import { Link } from "react-router-dom";
import { Mail, Instagram, Linkedin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-10 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="pl-4 md:pl-14">
            <h3 className="font-semibold text-2xl mb-4 text-gray-300">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About CGU Marketplace</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How it works</Link></li>
              <li><Link to="/community-guidelines" className="hover:text-white transition">Community guidelines</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy policy</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="pl-4 md:pl-10">
            <h3 className="font-semibold text-2xl mb-4 text-gray-300">Contact</h3>
            <ul className="space-y-2 text-sm">
              {/* <li><Link to="/help-center" className="hover:text-white transition">Help center</Link></li> */}
              {/* <li><Link to="/support-team" className="hover:text-white transition">Support team</Link></li> */}
              <li><a href="https://discord.gg/4DTwc5N9JC" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Report an issue</a></li>
              {/* <li><Link to="/feedback" className="hover:text-white transition">Feedback</Link></li> */}
              <li><a href="mailto:cgumarketplace@gmail.com" className="hover:text-white transition">Contact us</a></li>
            </ul>
            
          </div>

          {/* Social & Join Us */}
          <div className="pl-4 md:pl-6">
            <h3 className="font-semibold text-2xl mb-4 text-gray-300">Join Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white transition">Create an account</Link></li>
              {/* <li><Link to="/become-seller" className="hover:text-white transition">Become a seller</Link></li> */}
              {/* <li><Link to="/campus-ambassador" className="hover:text-white transition">Campus ambassador program</Link></li> */}
              <li><a href="mailto:cgumarketplace@gmail.com" className="hover:text-white transition">Partner with us</a></li>
              <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSe26ntKVM0Qpz3qqKRviWWoXSATwerifrsdVOPDZ4DsjmGofA/viewform?usp=sharing" className="hover:text-white transition">Careers</a></li>
            </ul>

            {/* Social Media Icons */}
            {/* <div className="mt-6 flex space-x-4">
              <a href="mailto:cgumarketplace@gmail.com" className="hover:text-white transition"><Mail size={30} /></a>
              <a href="https://instagram.com/cgumarketplace" className="hover:text-white transition"><Instagram size={30} /></a>
              <a href="https://www.linkedin.com/company/cgu-marketplace/" className="hover:text-white transition"><Linkedin size={30} /></a>
              <a href="https://discord.gg/4DTwc5N9JC" className="hover:text-white transition"><FaDiscord size={30} /></a>

            </div> */}
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-600 text-center text-xs">
        {/* Social Media Icons */}
        <div className="mt-6 flex justify-center space-x-4">
          <a href="mailto:cgumarketplace@gmail.com" className="hover:text-white transition"><Mail size={30} /></a>
          <a href="https://instagram.com/cgumarketplace" className="hover:text-white transition"><Instagram size={30} /></a>
          <a href="https://www.linkedin.com/company/cgu-marketplace/" className="hover:text-white transition"><Linkedin size={30} /></a>
          <a href="https://discord.gg/4DTwc5N9JC" className="hover:text-white transition"><FaDiscord size={30} /></a>
        </div>
        <p className="text-xs mt-4">© {new Date().getFullYear()} CGU Marketplace. All rights reserved.</p>
      </div>

      </div>
    </footer>
  );
};

export default Footer;
