import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence, useScroll, useSpring, useAnimationControls } from "framer-motion";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { scrollY } = useScroll();
  const scaleX = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const cartControls = useAnimationControls();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    if (items.length > 0) {
      cartControls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
      });
    }
  }, [items.length]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuVariants = {
    open: { 
      opacity: 1,
      y: 0,
      transition: { 
        type: "ease",  // Use ease instead of spring
        duration: 0.2,  // Shorter duration for faster animation
        when: "beforeChildren",
        staggerChildren: 0.05 
      }
    },
    closed: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.1,  // Even faster close duration
        when: "afterChildren"
      }
    }
  };
  

const itemVariants = {
  open: { opacity: 1, x: 0, transition: { duration: 0.08 } }, 
  closed: { opacity: 0, x: -5, transition: { duration: 0.08 } } // Faster transition
};

  

  return (
    <motion.nav
      className="fixed top-0 w-full z-[1000] border-b border-blue-300"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Main navigation"
    >

      <motion.div
        className={`backdrop-blur-lg border-b ${
          isScrolled 
            ? "bg-white/90 border-gray-200 shadow-sm"
            : "bg-white/50 border-transparent"
        } transition-all duration-300`}
      >
        <div className="max-w-8xl mx-auto px-6 py-2.5 sm:py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 0.95 }} 
              whileTap={{ scale: 1.05 }}
              role="banner"
            >
              <Link 
                to="home" 
                className="flex items-center space-x-3"
                aria-label="Home page"
              >
                <motion.img
                  src={require("../logo1.png")}
                  alt="CGU Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"  // Adjusted the size for smaller screens
                  whileHover={{ rotate: [0, -15, 15, 0] }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  drag
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  dragElastic={0.5}
                />
                <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent">
                  <span className="text-yellow-600">CGU</span>
                  <span className="text-blue-600">Marketplace</span>
                </span>
              </Link>
            </motion.div>


            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div className="flex space-x-8">
                {['home','buy', 'sell'].map((path) => (
                  <motion.div
                    key={path}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 1.05 }}
                  >
                    <Link
                      to={`/${path}`}
                      className="relative text-lg font-semibold text-gray-700 hover:text-black px-1 py-2"
                      aria-current={location.pathname === `/${path}` ? "page" : undefined}

                    >
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: location.pathname.includes(path) ? '100%' : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* User Section */}
              <div className="flex items-center space-x-6 ml-4">

              {user ? (
  <motion.div className="relative group" whileHover={{ scale: 1.05 }} role="menu">
    <Link to="/profile" className="flex items-center space-x-4 cursor-pointer">
      <div className="h-10 w-10 rounded-full flex items-center justify-center text-black border-2 border-black font-bold">
        {user.displayName?.[0]?.toUpperCase() || 'U'}
      </div>
      <span className="text-gray-700 font-medium truncate max-w-[120px]">
        Hi, {user.displayName?.split(' ')[0] || 'User'}
      </span>
    </Link>
    
    {/* Profile Dropdown */}
    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-50 origin-top-right transform-gpu scale-95 group-hover:scale-100 focus-within:opacity-100">
      <div className="p-2">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-50 font-medium text-red-600 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? 'Logging Out...' : 'Log Out'}
        </button>
      </div>
    </div>
  </motion.div>
) : (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <button
      onClick={() => navigate("/login")}
      className="px-5 py-2.5 bg-black text-white font-semibold rounded-lg  hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Sign in"
    >
      Login
    </button>
  </motion.div>
)}

              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-8 h-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden fixed top-20 inset-x-4 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200"
              role="menu"
            >
              <div className="p-6 space-y-4">
                {['home','buy', 'sell', 'profile'].map((path) => (
                  <motion.div
                    key={path}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                  <Link
                    to={`/${path}`}
                    className="block px-6 py-4 text-xl font-medium text-gray-700 hover:text-black rounded-xl hover:bg-gray-50"
                    aria-current={location.pathname.includes(path) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)} // Close menu on click
                  >
                    {path.charAt(0).toUpperCase() + path.slice(1)}
                  </Link>

                  </motion.div>
                ))}
                
                {user ? (
                  <motion.div
                    className="pt-4 border-t border-gray-200"
                    variants={itemVariants}
                  >
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full px-6 py-4 text-xl font-medium text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      {isLoggingOut ? 'Logging Out...' : 'Log Out'}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div variants={itemVariants}>
                  <button
                    onClick={() => {
                      navigate("/login"); // Correct the path to /home
                      setMenuOpen(false); // Close the menu when logging in
                    }}
                    className="px-5 py-2.5 bg-black text-white font-semibold rounded-lg  hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Sign in"
                  >
                    Login
                  </button>

                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;