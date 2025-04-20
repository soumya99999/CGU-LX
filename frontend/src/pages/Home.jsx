import React from "react";
import Carousel from "../components/Carousel";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import LatestProducts from "../components/LatestProducts.jsx";

function Home() {
    return (
        <div className="text-gray-900 font-sans min-h-screen px-4 flex flex-col items-center">
            
            <div className="w-full overflow-hidden bg-yellow-50 border-y-2 border-yellow-400 py-3 mb-6 relative">
                <div className="sr-only">
                    Notice: We're improving our image system - some images may not appear temporarily. We're working to fix this!
                </div>
                <div 
                    className="whitespace-nowrap will-change-transform"
                    aria-hidden="true"
                    style={{
                        animation: 'marquee 5s linear infinite',
                    }}
                >
                    <span className="mx-4 text-yellow-800 font-bold inline-block">⚠️ Notice:</span>
                    <span className="text-yellow-700 inline-block">
                        We're improving our image system - some images may not appear temporarily. We're working to fix this!
                    </span>
                    <span className="mx-4 text-yellow-800 font-bold inline-block">⚠️ Notice:</span>
                    <span className="text-yellow-700 inline-block">
                        We're improving our image system - some images may not appear temporarily. We're working to fix this!
                    </span>
                    
                </div>
            </div>

            {/* Carousel Section */}
            <section>
                <Carousel />
            </section>
            
            <section>
                <CategorySection/>
            </section>
            
            {/* Featured Products Section */}
            <FeaturedProducts />
            <LatestProducts/>

            
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .marquee-animation {
                        animation: none !important;
                    }
                    .marquee-content {
                        white-space: normal !important;
                        display: block !important;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;