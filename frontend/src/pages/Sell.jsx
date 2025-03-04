import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../firebase/firebaseConfig"; // Ensure Firebase is correctly initialized

const Sell = () => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        address: "",
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setProduct({ ...product, images: files });

        // Free memory of previous URLs before creating new ones
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const uploadImagesToFirebase = async (files) => {
        const storage = getStorage(app);
        try {
            const urls = await Promise.all(
                files.map(async (file) => {
                    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
                    await uploadBytes(storageRef, file);
                    return await getDownloadURL(storageRef);
                })
            );
            return urls;
        } catch (error) {
            console.error("Image upload error:", error);
            throw new Error("Failed to upload images. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.name || !product.price || !product.description || !product.address || product.images.length === 0) {
            alert("Please fill in all fields and upload at least one image.");
            return;
        }

        setLoading(true); // Show loading state

        try {
            const imageUrls = await uploadImagesToFirebase(product.images);

            const productData = {
                name: product.name,
                price: product.price,
                description: product.description,
                address: product.address,
                images: imageUrls,
            };

            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to list product.");
            }

            alert("Product listed successfully!");
            setProduct({ name: "", price: "", description: "", address: "", images: [] });
            setImagePreviews([]);

        } catch (error) {
            console.error("Error submitting product:", error);
            alert(error.message);
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-blue-600">Sell Your Item</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-5">
                
                <label className="block mb-2 font-semibold">Product Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={product.name} 
                    onChange={handleChange} 
                    className="w-full border px-3 py-2 rounded" 
                    required 
                />

                <label className="block mt-4 mb-2 font-semibold">Price ($):</label>
                <input 
                    type="number" 
                    name="price" 
                    value={product.price} 
                    onChange={handleChange} 
                    className="w-full border px-3 py-2 rounded" 
                    required 
                />

                <label className="block mt-4 mb-2 font-semibold">Description:</label>
                <textarea 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                    className="w-full border px-3 py-2 rounded" 
                    required 
                ></textarea>
                
                <label className="block mt-4 mb-2 font-semibold">Address:</label>
                <input 
                    type="text" 
                    name="address" 
                    value={product.address} 
                    onChange={handleChange} 
                    className="w-full border px-3 py-2 rounded" 
                    required 
                />

                <label className="block mt-4 mb-2 font-semibold">Upload Images (Max 5):</label>
                <input 
                    type="file" 
                    onChange={handleImageChange} 
                    className="w-full border px-3 py-2 rounded" 
                    multiple 
                    accept="image/*"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                    {imagePreviews.map((src, index) => (
                        <img key={index} src={src} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    ))}
                </div>

                <button 
                    type="submit" 
                    className={`mt-5 w-full py-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "List Product"}
                </button>
            </form>
        </div>
    );
};

export default Sell;
