import React, { useState } from "react";
import ProductList from "../components/ProductList";
import EarlyBirdCarousel from "../components/EarlyBirdCarousel";

function Home() {
    const [products] = useState([
        { id: 1, name: "Shoes", price: 100, image: "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/t/e/l/8-assg1258o-abros-white-silver-grey-original-imagqzfjpxj2afv2.jpeg?q=70&crop=false", description: "Description for Product 1" },
        { id: 2, name: "Product 2", price: 200, image: "https://via.placeholder.com/150", description: "Description for Product 2" },
        { id: 3, name: "Product 3", price: 300, image: "https://via.placeholder.com/150", description: "Description for Product 3" },
        { id: 3, name: "Product 4", price: 300, image: "https://via.placeholder.com/150", description: "Description for Product 4" }
    ]);

    return (
        <div className="app-content">
            {/* Carousel Section */}
            {/* <Carousel /> */}
            <EarlyBirdCarousel />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Featured Products</h1>
            </div>
            {/* Featured Products Section */}
            <div>
                <ProductList products={products} />
            </div>
        </div>
    );
}

export default Home;
