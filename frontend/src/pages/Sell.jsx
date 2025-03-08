import { useState } from "react";

const Sell = () => {

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        address: "",
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setImages(files);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    address: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Allow up to 5 images
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!product.name || !product.price || !product.description || !product.address || images.length === 0) {
      alert("Please fill in all fields and upload at least one image.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("address", product.address);
    images.forEach((image) => formData.append("images", image));
  
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("Product listed successfully!");
        setProduct({ name: "", price: "", description: "", address: "" });
        setImages([]);
        setImagePreviews([]);
      } else {
        const errorData = await response.json();
        alert(`Error listing product: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error listing product");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600">Sell Your Item</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-5" encType="multipart/form-data">
        <label className="block mb-2 font-semibold">Product Name:</label>
        <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!product.name || !product.price || !product.description || !product.address || images.length === 0) {
            alert("Please fill in all fields and upload at least one image.");
            return;
        }
    
        // ✅ Use FormData to send files properly
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("price", product.price);
        formData.append("description", product.description);
        formData.append("address", product.address);
    
        // ✅ Append each image
        images.forEach((image) => {
            formData.append("images", image);
        });
    
        try {
            const response = await fetch("http://localhost:5000/api/products/create", {
                method: "POST",
                body: formData, // ✅ Don't set `Content-Type` manually (browser sets it for FormData)
            });
    
            if (response.ok) {
                alert("Product listed successfully!");
                setProduct({ name: "", price: "", description: "", address: "" });
                setImages([]);
                setImagePreviews([]);
            } else {
                alert("Error listing product");
            }
        } catch (error) {
            console.error("Error submitting product:", error);
            alert("Error listing product");
        }
    };
    

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-blue-600">Sell Your Item</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-5" encType="multipart/form-data">
                
                <label className="block mb-2 font-semibold">Product Name:</label>
                <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

                <label className="block mt-4 mb-2 font-semibold">Price ($):</label>
                <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

                <label className="block mt-4 mb-2 font-semibold">Description:</label>
                <textarea name="description" value={product.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required></textarea>
                
                <label className="block mt-4 mb-2 font-semibold">Address:</label>
                <input type="text" name="address" value={product.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

                <label className="block mt-4 mb-2 font-semibold">Upload Images (Max 5):</label>
                <input type="file" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" multiple accept="image/*" />

                <div className="mt-3 flex flex-wrap gap-2">
                    {imagePreviews.map((src, index) => (
                        <img key={index} src={src} alt="Preview" className="w-20 h-20 object-cover rounded" />
                    ))}
                </div>

                <button type="submit" className="mt-5 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
                    List Product
                </button>
            </form>
        <label className="block mt-4 mb-2 font-semibold">Price ($):</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

        <label className="block mt-4 mb-2 font-semibold">Description:</label>
        <textarea name="description" value={product.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required></textarea>

        <label className="block mt-4 mb-2 font-semibold">Address:</label>
        <input type="text" name="address" value={product.address} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

        <label className="block mt-4 mb-2 font-semibold">Upload Images (Max 5):</label>
        <input type="file" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" multiple accept="image/*" />

        <div className="mt-3 flex flex-wrap gap-2">
          {imagePreviews.map((src, index) => (
            <img key={index} src={src} alt="Preview" className="w-20 h-20 object-cover rounded" />
          ))}

        </div>

        <button type="submit" disabled={loading} className="mt-5 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Listing Product..." : "List Product"}
        </button>
      </form>
    </div>
  );
};

export default Sell;
