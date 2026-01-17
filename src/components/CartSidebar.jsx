import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    products,
    updateQuantity, // We will use this to delete (set qty to 0)
    getCartAmount,
    getCartCount,
    currency,
    config,
    verifyPromo,
    discountAmount,
    delivery_fee
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [showPromoField, setShowPromoField] = useState(false);

  // Helper: Flatten cart items for rendering
  const getCartList = () => {
    let list = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const product = products.find((p) => p._id === itemId);
          if (product) {
            list.push({ ...product, size, qty: cartItems[itemId][size] });
          }
        }
      }
    }
    return list;
  };

  const cartList = getCartList();
  const totalAmount = getCartAmount();
  const totalItems = getCartCount();
  const freeDeliveryThreshold = config?.delivery?.freeDeliveryThreshold || 500; 
  const remainingForFree = freeDeliveryThreshold - totalAmount;

  const handleApplyPromo = async () => {
    if(!promoCodeInput) return;
    const success = await verifyPromo(promoCodeInput);
    if(success) setPromoCodeInput("");
  };

  return (
    <>
      {/* =========================================================
          1. FLOATING STICKY BASKET (Visible when CLOSED)
         ========================================================= */}
      {!isCartOpen && totalItems > 0 && (
        <div 
          onClick={() => setIsCartOpen(true)}
          className="fixed top-[45%] right-0 z-[1000] cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.15)] transform transition-transform hover:scale-105"
        >
          <div className="bg-[#6d28d9] text-white p-3 rounded-tl-md flex flex-col items-center justify-center min-w-[70px]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             </svg>
             <span className="text-xs font-bold">{totalItems} ITEMS</span>
          </div>
          <div className="bg-white text-[#6d28d9] p-2 rounded-bl-md text-center border-l-2 border-b-2 border-[#6d28d9] font-bold text-sm min-w-[70px]">
             {currency}{totalAmount}
          </div>
        </div>
      )}

      {/* =========================================================
          2. SIDEBAR DRAWER (Visible when OPEN)
         ========================================================= */}
      <div className={`fixed inset-0 z-[9999] overflow-hidden ${isCartOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}>
        
        {/* Dark Overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsCartOpen(false)}
        ></div>

        {/* Sidebar Panel */}
        <div className={`absolute inset-y-0 right-0 flex max-w-full pointer-events-none transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="pointer-events-auto w-screen max-w-md bg-[#f9fafb] shadow-2xl flex flex-col h-full">
            
            {/* HEADER */}
            <div className="bg-[#4c1d95] text-white px-5 py-4 flex justify-between items-center shadow-md">
               <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-lg font-bold">{totalItems} Items</span>
               </div>
               <button onClick={() => setIsCartOpen(false)} className="text-white/80 hover:text-white px-3 py-1">Close</button>
            </div>

            {/* FREE DELIVERY MESSAGE */}
            {totalItems > 0 && (
              <div className="bg-[#fff1f2] px-5 py-3 border-b border-pink-100">
                  {remainingForFree > 0 ? (
                      <p className="text-sm text-gray-700 text-center">
                        Add <span className="text-[#db2777] font-bold">{currency}{remainingForFree}</span> more for <span className="font-bold text-green-600">FREE Delivery!</span>
                      </p>
                  ) : (
                      <p className="text-sm text-green-700 font-bold text-center">
                        ✓ Free Delivery Unlocked!
                      </p>
                  )}
              </div>
            )}

            {/* SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {cartList.map((item, index) => (
                <div key={index} className="flex items-center gap-3 py-4 border-b border-gray-100 last:border-0 relative group">
                   
                   {/* Qty Buttons */}
                   <div className="flex flex-col items-center bg-gray-50 rounded-lg shadow-sm border border-gray-200 w-8">
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, item.qty + 1)}
                        className="text-gray-500 hover:text-[#6d28d9] w-full h-8 flex items-center justify-center"
                      >
                         ▲
                      </button>
                      <span className="text-xs font-bold text-gray-900">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.size, item.qty - 1)}
                        className="text-gray-500 hover:text-[#6d28d9] w-full h-8 flex items-center justify-center"
                      >
                         ▼
                      </button>
                   </div>

                   {/* Image */}
                   <div className="h-16 w-16 flex-shrink-0 bg-gray-50 rounded p-1">
                      <img src={item.image[0]} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                   </div>

                   {/* Info */}
                   <div className="flex-1 min-w-0 pr-6"> {/* Added padding right to avoid text hitting delete btn */}
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>
                      <div className="mt-1 font-bold text-gray-900 text-sm">
                         {currency}{item.price * item.qty}
                      </div>
                   </div>

                   {/* --- NEW: DELETE BUTTON --- */}
                   <button 
                     onClick={() => updateQuantity(item._id, item.size, 0)} // Setting quantity to 0 removes it
                     className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                     title="Remove Item"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>
              ))}

              {cartList.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <p>Your bag is empty</p>
                 </div>
              )}
            </div>

            {/* BOTTOM SECTION */}
            <div className="bg-white p-5 border-t border-gray-200 shadow-lg z-10">
              {/* Promo Code */}
              <div className="mb-4">
                 {!showPromoField ? (
                    <button onClick={() => setShowPromoField(true)} className="flex items-center text-sm font-semibold text-[#db2777]">
                       + Have a promo code?
                    </button>
                 ) : (
                    <div className="flex gap-2">
                       <input 
                          type="text" placeholder="Enter code"
                          className="flex-1 bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm"
                          value={promoCodeInput} onChange={(e) => setPromoCodeInput(e.target.value)}
                       />
                       <button onClick={handleApplyPromo} className="bg-black text-white px-3 text-sm rounded">Apply</button>
                       <button onClick={() => setShowPromoField(false)} className="text-gray-400 text-lg">×</button>
                    </div>
                 )}
              </div>

              {/* Checkout Btn */}
              <button 
                 onClick={() => { setIsCartOpen(false); navigate('/place-order'); }}
                 className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white py-3 rounded-lg flex justify-between px-6 font-bold shadow-md"
              >
                 <span>Place Order</span>
                 <span className="bg-black/20 px-2 py-0.5 rounded text-sm">{currency}{totalAmount - discountAmount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;