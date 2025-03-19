const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 text-center py-6 border-t border-gray-700 absolute bottom-0 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:flex sm:justify-between sm:items-center">
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} CGU Marketplace | CV Raman Global University</p>
                <nav className="flex justify-center space-x-6 mt-3 sm:mt-0">
                    <a href="/about" className="text-gray-400 hover:text-white transition">About</a>
                    <a href="/terms" className="text-gray-400 hover:text-white transition">Terms</a>
                    <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
                    <a href="mailto:cgumarketplace@gmail.com" className="text-gray-400 hover:text-white transition">Contact</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
