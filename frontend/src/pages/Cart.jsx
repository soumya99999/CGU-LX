import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import emptyCartImage from '../assets/empty-cart.jpg'; // Import the empty cart image

function Cart() {
  const { items } = useContext(CartContext);

  // Calculate the total price of all items in the cart
  const totalPrice = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleBuyNow = () => {
    // Add your buy now logic here
    alert('Thank you for your purchase!');
  };

  const handleContinueShopping = () => {
    // Redirect or navigate to the shopping page
    alert('Continue shopping!');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Your Cart</h1>
      {items.length > 0 ? (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.product._id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-base md:text-lg">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">Price: ${item.product.price}</p>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  <p className="text-gray-800 font-medium text-sm md:text-base">
                    Total: <span className="text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Total:</h2>
              <p className="text-xl md:text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Buy Now
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <img
            src={emptyCartImage}
            alt="Empty Cart"
            className="w-40 h-40 md:w-48 md:h-48"
          />
          <p className="text-gray-600 text-center text-lg md:text-xl">Your cart is empty.</p>
          <button
            onClick={handleContinueShopping}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;