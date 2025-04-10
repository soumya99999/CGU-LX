import React from "react";
import Carousel from "../components/Carousel";
import CategorySection from "../components/CategorySection";
import Buy from "./Buy";
import FeaturedProducts from "../components/FeaturedProducts.jsx"; // Import FeaturedProducts
import About from "../components/About";
import Terms from "../components/terms";
import Register from "./Register";
import Sell from "./Sell";


function Home() {
    return (
        <div className="text-gray-900 font-sans min-h-screen px-4 flex flex-col items-center">
            {/* Carousel Section */}
            <section>
                <Carousel />
            </section>
            <section>
            <CategorySection/>
            </section>
            {/* Featured Products Section */}
            <FeaturedProducts /> {/* Now it's a separate component */}
            <Register />
            <Buy />
        </div>
    );
}

export default Home;
