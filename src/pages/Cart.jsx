import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Trash2, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, getCartAmount, delivery_fee, verifyPromo, discountAmount, couponCode } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [promoInput, setPromoInput] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const product = products.find((p) => p._id === items);
            if (product) {
               tempData.push({ _id: items, size: item, quantity: cartItems[items][item] })
            }
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleCheckout = () => {
      // Changed: Removed the forced Login check so Guest Checkout works
      navigate('/place-order');
  }

  const applyCoupon = () => {
      if(!promoInput) return;
      verifyPromo(promoInput);
  }

  const subTotal = getCartAmount();
  const finalTotal = subTotal + delivery_fee - discountAmount;

  return (
    <div className='container mx-auto px-4 py-10 border-t min-h-[60vh]'>
      <h2 className='text-2xl font-bold mb-8 text-[#233a95]'>Shopping Cart</h2>

      <div className='flex flex-col gap-4'>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          return (
            <div key={index} className='border-b py-4 border-t border-gray-200 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                <div>
                  <p className='text-sm sm:text-lg font-bold text-gray-700'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p className='text-[#D51243] font-bold'>{currency}{productData.price}</p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 text-xs rounded'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-12 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
              <Trash2 onClick={() => updateQuantity(item._id, item.size, 0)} className='w-5 cursor-pointer text-red-500 hover:text-red-700' />
            </div>
          )
        })}
      </div>

      {cartData.length === 0 && (
          <div className="text-center py-20">
              <p className="text-gray-500 text-xl mb-4">Your cart is currently empty.</p>
              <Link to="/" className="bg-[#233a95] text-white px-8 py-3 rounded-full font-bold">Return to Shop</Link>
          </div>
      )}

      {cartData.length > 0 && (
        <div className='flex flex-col-reverse lg:flex-row justify-between gap-12 my-20'>
          
          {/* COUPON SECTION */}
          <div className='flex-1 max-w-[400px]'>
              <div className='bg-gray-50 p-6 rounded-lg'>
                  <p className='text-gray-700 font-bold mb-3 flex items-center gap-2'><Tag size={18}/> Coupon Code</p>
                  <div className='flex gap-2'>
                      <input 
                        type="text" 
                        value={promoInput}
                        onChange={(e)=>setPromoInput(e.target.value)}
                        placeholder='Enter Coupon Code' 
                        className='border rounded px-3 py-2 w-full outline-none uppercase'
                      />
                      <button onClick={applyCoupon} className='bg-black text-white px-4 py-2 rounded text-sm font-bold'>Apply</button>
                  </div>
                  {couponCode && (
                      <div className='mt-3 text-green-600 text-sm font-bold bg-green-50 border border-green-200 p-2 rounded'>
                          Coupon "{couponCode}" Applied! -${discountAmount}
                      </div>
                  )}
              </div>
          </div>

          {/* TOTALS SECTION */}
          <div className='w-full sm:w-[450px]'>
            <div className='w-full'>
              <div className='text-2xl font-bold mb-3 text-[#233a95]'>Cart Totals</div>
              <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between py-2 border-b'>
                  <p>Subtotal</p>
                  <p>{currency} {subTotal}.00</p>
                </div>
                <div className='flex justify-between py-2 border-b'>
                  <p>Shipping Fee</p>
                  <p>{delivery_fee === 0 ? <span className='text-green-600 font-bold'>Free</span> : `${currency} ${delivery_fee}`}</p>
                </div>
                
                {discountAmount > 0 && (
                    <div className='flex justify-between py-2 border-b text-green-600'>
                        <p>Discount</p>
                        <p>- {currency} {discountAmount}</p>
                    </div>
                )}

                <div className='flex justify-between py-2 font-bold text-lg text-gray-800'>
                  <p>Total</p>
                  <p>{currency} {finalTotal < 0 ? 0 : finalTotal}.00</p>
                </div>
              </div>
              <div className='text-end'>
                <button onClick={handleCheckout} className='bg-[#D51243] text-white text-sm my-8 px-8 py-3 rounded font-bold hover:bg-red-700 transition'>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart