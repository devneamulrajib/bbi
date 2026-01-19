import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Edit2, MapPin, Phone, User, Truck, Info } from 'lucide-react';

const PlaceOrder = () => {
  const { 
      navigate, backendUrl, token, cartItems, setCartItems, 
      getCartAmount, delivery_fee, products, userData, currency,
      discountAmount 
  } = useContext(ShopContext);
  
  // Single state object capable of handling both flows
  const [formData, setFormData] = useState({
      name: '',
      phone: '',
      address: '', // For Guest (Full address string)
      // For Logged In User (Structured)
      firstName: '', lastName: '', street: '', city: '', state: '', zipcode: '', country: 'Bangladesh', email: ''
  });

  const [isEditing, setIsEditing] = useState(true);

  // Load User Data if logged in
  useEffect(() => {
      if (token && userData) {
          setFormData(prev => ({
              ...prev,
              firstName: userData.name ? userData.name.split(" ")[0] : '',
              lastName: userData.name && userData.name.split(" ").length > 1 ? userData.name.split(" ")[1] : '',
              email: userData.email || '',
              phone: userData.phone || '',
              // Structured Address
              street: userData.address?.street || '',
              city: userData.address?.city || '',
              state: userData.address?.state || '',
              zipcode: userData.address?.zipcode || '',
              country: 'Bangladesh',
              // Display Address
              address: `${userData.address?.street || ''}, ${userData.address?.city || ''}`
          }));
          setIsEditing(false);
      }
  }, [token, userData]);

  const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
          // Prepare Order Items
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

          const subTotal = getCartAmount();
          const finalAmount = Math.max(0, subTotal + delivery_fee - discountAmount);

          // LOGIC SPLIT: GUEST vs LOGGED IN
          if (!token) {
              // --- GUEST ORDER ---
              const guestOrderData = {
                  items: orderItems,
                  amount: finalAmount,
                  name: formData.name,
                  phone: formData.phone,
                  address: {
                      street: formData.address, // Using the textarea as the main street address
                      city: "-", 
                      state: "-",
                      zipcode: "-",
                      country: "Bangladesh",
                      phone: formData.phone 
                  }
              };

              const response = await axios.post(backendUrl + '/api/order/guest', guestOrderData);
              if (response.data.success) {
                  setCartItems({});
                  // Redirect to Tracking Page
                  navigate('/order-tracking'); 
                  toast.success("Order Placed! Use your phone number to track.");
              } else {
                  toast.error(response.data.message);
              }

          } else {
              // --- LOGGED IN ORDER (Standard) ---
              // Use structured data for logged in users
              let addressData = {
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  email: formData.email,
                  street: formData.street,
                  city: formData.city,
                  state: formData.state,
                  zipcode: formData.zipcode,
                  country: 'Bangladesh',
                  phone: formData.phone
              };

              let orderData = {
                  address: addressData,
                  items: orderItems,
                  amount: finalAmount 
              }
              const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
              if (response.data.success) {
                  setCartItems({});
                  navigate('/my-orders');
                  toast.success("Order Placed Successfully");
              } else {
                  toast.error(response.data.message);
              }
          }

      } catch (error) {
          console.log(error);
          toast.error(error.message);
      }
  }

  const subTotal = getCartAmount();
  const total = Math.max(0, subTotal + delivery_fee - discountAmount);

  return (
      <form onSubmit={onSubmitHandler} className='container mx-auto px-4 py-10 min-h-[80vh] flex flex-col sm:flex-row justify-between gap-10 pt-5 sm:pt-14 border-t'>
          
          {/* LEFT SIDE: FORM */}
          <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
              <div className='flex justify-between items-center mb-2'>
                  <div className='text-xl sm:text-2xl font-bold text-[#233a95]'>
                      {token ? "DELIVERY INFORMATION" : "QUICK CHECKOUT"}
                  </div>
                  {token && !isEditing && (
                      <button type="button" onClick={() => setIsEditing(true)} className='text-sm text-blue-600 border px-3 py-1 rounded-full hover:bg-blue-50 transition'>
                          <Edit2 size={14} /> Edit
                      </button>
                  )}
              </div>

              {/* GUEST FORM (Simplified) */}
              {!token ? (
                   <div className='flex flex-col gap-5 animate-fade-in p-6 border border-gray-200 rounded-xl bg-white shadow-sm'>
                       <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex gap-2 items-start">
                           <Info size={16} className="mt-0.5 shrink-0"/>
                           <p>You are ordering as a Guest. No account required. <br/>You can track your order using your <b>Mobile Number</b>.</p>
                       </div>
                       
                       {/* Name */}
                       <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                           <input required onChange={onChangeHandler} name='name' value={formData.name} className='border border-gray-300 rounded-lg py-3 pl-10 pr-4 w-full focus:outline-blue-500 transition' type="text" placeholder='Your Name' />
                       </div>

                       {/* Phone */}
                       <div className="relative">
                           <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                           <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded-lg py-3 pl-10 pr-4 w-full focus:outline-blue-500 transition' type="text" placeholder='Mobile Number (e.g. 017...)' />
                       </div>

                       {/* Full Address */}
                       <div className="relative">
                           <MapPin className="absolute left-3 top-4 text-gray-400" size={18} />
                           <textarea required onChange={onChangeHandler} name='address' value={formData.address} className='border border-gray-300 rounded-lg py-3 pl-10 pr-4 w-full focus:outline-blue-500 h-32 resize-none transition' placeholder='Enter Full Delivery Address (House No, Road No, Area, City)'></textarea>
                       </div>
                   </div>
              ) : (
                  // LOGGED IN USER FORM (Detailed)
                  !isEditing ? (
                      <div className='bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col gap-2'>
                           <p className='font-bold text-lg text-gray-800'>{formData.firstName} {formData.lastName}</p>
                           <p className='text-gray-600'>{formData.street}, {formData.city}</p>
                           <p className='text-gray-600'>{formData.state} - {formData.zipcode}</p>
                           <p className='text-gray-600 font-medium mt-2 flex items-center gap-2'><Phone size={14}/> {formData.phone}</p>
                      </div>
                  ) : (
                      <div className='flex flex-col gap-4 animate-fade-in'>
                           <div className='flex gap-3'>
                               <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='First name' />
                               <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='Last name' />
                           </div>
                           <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="email" placeholder='Email address' />
                           <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='Street' />
                           <div className='flex gap-3'>
                              <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='City' />
                              <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='State' />
                           </div>
                           <div className='flex gap-3'>
                              <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='Zipcode' />
                              <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='Phone' />
                           </div>
                           <button type="button" onClick={() => setIsEditing(false)} className='bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition w-max px-8 self-end text-sm'>Save Address</button>
                      </div>
                  )
              )}
          </div>

          {/* RIGHT SIDE: CART TOTALS */}
          <div className='mt-8 w-full sm:max-w-[480px]'>
              <div className='mt-8'>
                  <div className='text-2xl font-bold mb-3 text-[#233a95]'>ORDER SUMMARY</div>
                  <div className='flex flex-col gap-2 mt-2 text-sm'>
                      <div className='flex justify-between py-2 border-b'>
                          <p>Subtotal</p>
                          <p>{currency}{subTotal}.00</p>
                      </div>
                      <div className='flex justify-between py-2 border-b'>
                          <p>Shipping</p>
                          <p>{delivery_fee === 0 ? "Free" : `${currency}${delivery_fee}.00`}</p>
                      </div>
                      {discountAmount > 0 && (
                          <div className='flex justify-between py-2 border-b text-green-600 font-medium'>
                              <p>Discount</p>
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
                  <div className='text-2xl font-bold mb-3 text-[#233a95]'>PAYMENT</div>
                  <div className='flex items-center gap-3 border p-3 px-4 rounded-lg bg-green-50 border-green-200'>
                      <div className='w-4 h-4 bg-green-500 rounded-full shadow'></div>
                      <p className='text-gray-800 text-sm font-bold'>CASH ON DELIVERY</p>
                  </div>
                  
                  <button type='submit' className='w-full mt-8 bg-[#D51243] text-white py-4 rounded-full font-bold hover:bg-red-700 transition shadow-lg flex justify-center items-center gap-2 transform active:scale-95'>
                      <Truck size={20}/>
                      {token ? "PLACE ORDER" : "CONFIRM ORDER"}
                  </button>
              </div>
          </div>
      </form>
  )
}

export default PlaceOrder;