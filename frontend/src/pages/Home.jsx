import React, { useState } from "react";
import ProductList from "../components/ProductList";
import Carousel from "../components/Carousel";
import Buy from "./Buy";

function Home() {


    return (
        <div className="app-content">
            {/* Carousel Section */}
            <Carousel />
            {/* <EarlyBirdCarousel /> */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-0 ">Featured Products</h1>
            </div>
            {/* Featured Products Section */}
            <div>
                {/* <ProductList products={products} /> */}
                <Buy/>
            </div>
        </div>
    );
}

export default Home;
