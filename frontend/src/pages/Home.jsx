import React from "react";
import Carousel from "../components/Carousel";
import Buy from "./Buy";

function Home() {
    return (
        <div className="bg-gray-100 text-gray-900 font-sans">
            {/* Carousel Section */}
            <section >
                <Carousel />
            </section>
            
            {/* Featured Products Section */}
            <section className="mt-20">
            <h2 className="text-5xl font-bold text-center mt-4 mb-6">Featured Products</h2>
            </section>
            

                    <Buy />

        </div>
    );
}

export default Home;
