import { useEffect, useState, useContext } from "react";
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'ui/card';
import { Avatar, AvatarImage, AvatarFallback } from 'ui/avatar';
import { Button } from 'ui/button';
import { Alert, AlertTitle, AlertDescription } from 'ui/alert';
import { Badge } from 'ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'ui/dialog';
import { CartContext } from '../contexts/CartContext'; // Adjust path as needed
import { Toaster } from 'ui/toaster'; // Assuming you have this component

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useContext(CartContext); // Use CartContext

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-lg mt-10">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  function StarRating({ rating }) {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const ProductDialog = ({ product }) => (
    <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="relative">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-[300px] object-cover rounded-lg"
            />
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
            {product.discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating || 4.5} />
              <span className="text-sm text-gray-600">
                ({(product.reviews?.length || 0).toLocaleString()} reviews)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm whitespace-pre-line">{product.description}</p>
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-4 max-h-40 overflow-y-auto">
                <h3 className="font-semibold text-gray-700">Reviews</h3>
                {product.reviews.map((review, index) => (
                  <div key={index} className="flex items-center gap-3 mt-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.userAvatar} alt={review.userName} />
                      <AvatarFallback>{review.userName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{review.userName}</div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Shield className="w-4 h-4" />Warranty</div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4" />Free Delivery</div>
              <div className="flex items-center gap-2"><RotateCcw className="w-4 h-4" />7 Day Return</div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Featured Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Card 
                key={product._id} 
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentImageIndex(0);
                }}
              >
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description.split('\n')[0]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative group">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 space-y-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="bg-white hover:bg-gray-100 shadow-md"
                        onClick={(e) => e.stopPropagation()} // Placeholder until wishlist is added
                      >
                        <Heart className="h-5 w-5 text-red-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="bg-white hover:bg-gray-100 shadow-md"
                        onClick={(e) => e.stopPropagation()} // Placeholder until share is added
                      >
                        <Share2 className="h-5 w-5 text-gray-600" />
                      </Button>
                    </div>
                    {product.discount > 0 && (
                      <Badge variant="destructive" className="absolute top-4 left-4">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <StarRating rating={product.rating || 4.5} />
                    <span className="text-sm text-gray-600">
                      ({(product.reviews?.length || 0).toLocaleString()} reviews)
                    </span>
                  </div>
                  {product.reviews && product.reviews.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-700">Reviews</h3>
                      {product.reviews.slice(0, 1).map((review, index) => (
                        <div key={index} className="flex items-center gap-3 mt-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={review.userAvatar} alt={review.userName} />
                            <AvatarFallback>{review.userName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">{review.userName}</div>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
                    <div className="flex items-center gap-1"><Shield className="h-4 w-4" />Warranty</div>
                    <div className="flex items-center gap-1"><Truck className="h-4 w-4" />Free Delivery</div>
                    <div className="flex items-center gap-1"><RotateCcw className="h-4 w-4" />7 Day Return</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products available.
            </p>
          )}
        </div>
      </div>
      {selectedProduct && <ProductDialog product={selectedProduct} />}
      <Toaster />
    </div>
  );
};

export default Buy;