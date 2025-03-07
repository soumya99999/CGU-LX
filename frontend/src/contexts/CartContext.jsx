import { createContext, useState } from 'react';
import { useToast } from '../hooks/use-toast';

export const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { toast } = useToast();

  const addToCart = (product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product._id !== productId)
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist((current) => {
      const isInWishlist = current.includes(productId);
      const newWishlist = isInWishlist
        ? current.filter((id) => id !== productId)
        : [...current, productId];

      toast({
        title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
        description: isInWishlist
          ? "The item has been removed from your wishlist."
          : "The item has been added to your wishlist.",
      });

      return newWishlist;
    });
  };

  const shareProduct = (product) => {
    const shareMessage = `Check out ${product.name} - $${product.price}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: shareMessage,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(shareMessage + "\n" + window.location.href);
        toast({
          title: "Link Copied",
          description: "Product link has been copied to clipboard.",
        });
      });
    } else {
      navigator.clipboard.writeText(shareMessage + "\n" + window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        wishlist,
        toggleWishlist,
        shareProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}