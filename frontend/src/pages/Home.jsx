import React from "react";
import Carousel from "../components/Carousel";
import Buy from "./Buy";
import FeaturedProducts from "../components/FeaturedProducts.jsx"; // Import FeaturedProducts

function Home() {
    return (
        <div className="text-gray-900 font-sans min-h-screen px-4 flex flex-col items-center">
            {/* Carousel Section */}
            <section>
                <Carousel />
            </section>

            {/* Featured Products Section */}
            <FeaturedProducts /> {/* Now it's a separate component */}

            <Buy />
        </div>
    );
}

export default Home;
