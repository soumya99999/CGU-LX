import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion

function FeaturedProducts() {
    const text = "Featured Products";

    const letterAnimation = {
        hidden: { opacity: 0, scale: 0.8, y: 20 }, // Soft zoom-in from below
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { delay: i * 0.03, duration: 0.6, ease: "easeOut" },
        }),
    };

    return (
        <section className="mt-16 text-center">
            <motion.h2
                className="text-4xl sm:text-5xl font-bold mt-4 mb-6 flex justify-center space-x-1 sm:space-x-2"
                initial="hidden"
                animate="visible"
            >
                {text.split("").map((char, index) => (
                    <motion.span
                        key={index}
                        variants={letterAnimation}
                        custom={index}
                        whileHover={{
                            scale: 1.15,
                            y: -2,
                            color: "#ff5733",
                            textShadow: "0px 5px 10px rgba(255,87,51,0.3)", // Soft glow
                            transition: { duration: 0.3, ease: "easeInOut" },
                        }}
                        className="inline-block"
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.h2>
        </section>
    );
}

export default FeaturedProducts;