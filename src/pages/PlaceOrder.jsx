import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit2, CheckCircle, MapPin, Phone, Mail, User } from 'lucide-react';

const PlaceOrder = () => {
  const { 
      navigate, backendUrl, token, cartItems, setCartItems, 
      getCartAmount, delivery_fee, products, userData, currency,
      discountAmount // <--- IMPORTED DISCOUNT STATE
  } = useContext(ShopContext);
  
  const [formData, setFormData] = useState({
      firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  });

  const [isEditing, setIsEditing] = useState(true);

  // Security & Data Loading Logic
  useEffect(() => {
      if (!token) {
          navigate('/login');
          return;
      }
      
      if (userData) {
          const hasAddress = userData.address && userData.address.street;
          
          setFormData({
              firstName: userData.name ? userData.name.split(" ")[0] : '',
              lastName: userData.name && userData.name.split(" ").length > 1 ? userData.name.split(" ")[1] : '',
              email: userData.email || '',
              phone: userData.phone || '',
              street: userData.address?.street || '',
              city: userData.address?.city || '',
              state: userData.address?.state || '',
              zipcode: userData.address?.zipcode || '',
              country: userData.address?.country || ''
          });

          if (hasAddress) {
              setIsEditing(false);
          }
      }
  }, [token, userData, navigate]);

  const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
          let orderItems = [];
          for (const items in cartItems) {
              for (const item in cartItems[items]) {
                  if (cartItems[items][item] > 0) {
                      const itemInfo = products.find(product => product._id === items);
                      if (itemInfo) {
                          const itemCopy = JSON.parse(JSON.stringify(itemInfo));
                          itemCopy.size = item;
                          itemCopy.quantity = cartItems[items][item];
                          orderItems.push(itemCopy);
                      }
                  }
              }
          }

          // CALCULATE FINAL AMOUNT
          // Subtotal + Delivery - Discount (Ensure it doesn't go below 0)
          const subTotal = getCartAmount();
          const finalAmount = Math.max(0, subTotal + delivery_fee - discountAmount);

          let orderData = {
              address: formData,
              items: orderItems,
              amount: finalAmount 
          }

          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
          
          if (response.data.success) {
              setCartItems({}); // Clear Cart
              navigate('/my-profile'); // Redirect
              toast.success("Order Placed Successfully");
          } else {
              toast.error(response.data.message);
          }

      } catch (error) {
          console.log(error);
          toast.error(error.message);
      }
  }

  if (!token) return <div className='min-h-[60vh] flex items-center justify-center text-gray-500'>Redirecting...</div>;

  // Calculation for Display
  const subTotal = getCartAmount();
  const total = Math.max(0, subTotal + delivery_fee - discountAmount);

  return (
      <form onSubmit={onSubmitHandler} className='container mx-auto px-4 py-10 min-h-[80vh] flex flex-col sm:flex-row justify-between gap-10 pt-5 sm:pt-14 border-t'>
          
          {/* LEFT SIDE: DELIVERY INFO */}
          <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
              <div className='flex justify-between items-center mb-2'>
                  <div className='text-xl sm:text-2xl font-bold text-[#233a95]'>DELIVERY INFORMATION</div>
                  {!isEditing && (
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(true)} 
                        className='text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold border px-3 py-1 rounded-full hover:bg-blue-50 transition'
                      >
                          <Edit2 size={14} /> Edit
                      </button>
                  )}
              </div>

              {!isEditing ? (
                  <div className='bg-gray-50 border border-gray-200 rounded-xl p-6 relative group transition-all'>
                      <div className='absolute top-4 right-4 text-green-500'><CheckCircle size={24} /></div>
                      <div className='flex items-start gap-3 mb-3'>
                          <User className='text-gray-400 mt-1' size={18} />
                          <div><p className='font-bold text-gray-800 text-lg'>{formData.firstName} {formData.lastName}</p></div>
                      </div>
                      <div className='flex items-start gap-3 mb-3'>
                          <MapPin className='text-gray-400 mt-1' size={18} />
                          <div className='text-gray-600 text-sm leading-relaxed'>
                              <p>{formData.street}</p>
                              <p>{formData.city}, {formData.state} {formData.zipcode}</p>
                              <p>{formData.country}</p>
                          </div>
                      </div>
                      <div className='flex items-center gap-3 mb-2'><Phone className='text-gray-400' size={18} /><p className='text-gray-600 text-sm'>{formData.phone}</p></div>
                      <div className='flex items-center gap-3'><Mail className='text-gray-400' size={18} /><p className='text-gray-600 text-sm'>{formData.email}</p></div>
                  </div>
              ) : (
                  <div className='flex flex-col gap-4 animate-fade-in'>
                      <div className='flex gap-3'>
                          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="text" placeholder='First name' />
                          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="text" placeholder='Last name' />
                      </div>
                      <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="email" placeholder='Email address' />
                      <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="text" placeholder='Street' />
                      <div className='flex gap-3'>
                          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="text" placeholder='City' />
                          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="text" placeholder='State' />
                      </div>
                      <div className='flex gap-3'>
                          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="number" placeholder='Zipcode' />
                          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="text" placeholder='Country' />
                      </div>
                      <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-blue-500' type="number" placeholder='Phone' />
                      <button type="button" onClick={() => setIsEditing(false)} className='bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition w-max px-8 self-end text-sm'>Save Address</button>
                  </div>
              )}
          </div>

          {/* RIGHT SIDE: CART TOTALS & PAYMENT */}
          <div className='mt-8 w-full sm:max-w-[480px]'>
              <div className='mt-8'>
                  <div className='text-2xl font-bold mb-3 text-[#233a95]'>CART TOTALS</div>
                  <div className='flex flex-col gap-2 mt-2 text-sm'>
                      <div className='flex justify-between py-2 border-b'>
                          <p>Subtotal</p>
                          <p>{currency}{subTotal}.00</p>
                      </div>
                      <div className='flex justify-between py-2 border-b'>
                          <p>Shipping Fee</p>
                          <p>{delivery_fee === 0 ? "Free" : `${currency}${delivery_fee}.00`}</p>
                      </div>
                      
                      {/* DISCOUNT ROW */}
                      {discountAmount > 0 && (
                          <div className='flex justify-between py-2 border-b text-green-600 font-medium'>
                              <p>Coupon Discount</p>
                              <p>- {currency}{discountAmount}.00</p>
                          </div>
                      )}

                      <div className='flex justify-between py-2 font-bold text-lg text-gray-800'>
                          <p>Total</p>
                          <p>{currency}{total}.00</p>
                      </div>
                  </div>
              </div>

              <div className='mt-12'>
                  <div className='text-2xl font-bold mb-3 text-[#233a95]'>PAYMENT METHOD</div>
                  <div className='flex gap-3 flex-col lg:flex-row'>
                      <div className='flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg bg-green-50 border-green-200 shadow-sm'>
                          <p className={`min-w-4 h-4 border rounded-full bg-green-500 shadow`}></p>
                          <p className='text-gray-800 text-sm font-bold'>CASH ON DELIVERY</p>
                      </div>
                  </div>
                  <div className='w-full text-end mt-8'>
                      <button type='submit' className='bg-[#D51243] text-white px-16 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg transform hover:-translate-y-1'>PLACE ORDER</button>
                  </div>
              </div>
          </div>
      </form>
  )
}

export default PlaceOrder