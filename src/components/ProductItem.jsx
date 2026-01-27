import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, sizes }) => {
  
  const { currency, addToCart, removeFromCart, cartItems } = useContext(ShopContext);

  // --- FIX START ---
  // The cartItems[id] is an object (e.g., { Standard: 2, Large: 1 }), not a single number.
  // We need to sum up the values to get the total count for this product.
  const cartData = cartItems[id];
  let cartCount = 0;

  if (cartData) {
    if (typeof cartData === 'object') {
      // Sum up quantities of all sizes
      cartCount = Object.values(cartData).reduce((total, qty) => total + qty, 0);
    } else {
      // Fallback if it is just a number
      cartCount = cartData;
    }
  }

  // Determine the default size to use for Add/Remove actions
  const defaultSize = sizes && sizes.length > 0 ? sizes[0] : 'Standard';
  // --- FIX END ---

  const handleAdd = () => {
    addToCart(id, defaultSize);
  };

  const handleRemove = () => {
    // Ensure we remove the specific size we added
    removeFromCart(id, defaultSize);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col justify-between h-full border border-gray-100">
      
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block overflow-hidden cursor-pointer h-48 flex items-center justify-center mb-4 relative group">
        <img 
          src={image[0]} 
          alt={name} 
          className="h-full object-contain group-hover:scale-110 transition-transform duration-500" 
        />
      </Link>

      <div className="flex-grow">
        {/* Title */}
        <Link to={`/product/${id}`} className="text-gray-800 font-bold text-sm sm:text-base hover:text-blue-600 transition block mb-1 truncate">
          {name}
        </Link>
        
        {/* Stock Status */}
        <p className="text-green-500 text-[10px] font-bold uppercase mb-2">IN STOCK</p>

        {/* Rating Stars */}
        <div className="flex text-yellow-400 text-xs mb-3">
           <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-200">★</span>
           <span className="text-gray-400 ml-1">(1)</span>
        </div>
        
        {/* Price */}
        <p className="text-red-500 font-bold text-lg mb-4">
          {currency}{price}
        </p>
      </div>

      {/* --- BUTTONS --- */}
      <div>
        {cartCount === 0 ? (
          // 1. "ADD TO CART" Button
          <button 
            onClick={handleAdd}
            className="w-full border border-blue-500 text-blue-500 font-bold text-sm py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300 uppercase tracking-wide"
          >
            Add to Cart
          </button>
        ) : (
          // 2. Active State (Counter)
          <div className="w-full bg-[#233a95] text-white flex items-center justify-between rounded-full py-2 px-4 shadow-md">
             <button 
               onClick={handleRemove} 
               className="text-lg font-bold hover:text-gray-300 px-2"
             >−</button>
             
             <span className="font-bold text-sm">
               {cartCount} in Cart
             </span>
             
             <button 
               onClick={handleAdd} 
               className="text-lg font-bold hover:text-gray-300 px-2"
             >+</button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductItem;