import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, userData } = useContext(ShopContext);
    
    // Auto-fill from user profile if available
    const [formData, setFormData] = useState({
        firstName: userData?.name?.split(" ")[0] || '',
        lastName: userData?.name?.split(" ")[1] || '',
        email: userData?.email || '',
        street: userData?.address?.street || '',
        city: userData?.address?.city || '',
        state: userData?.address?.state || '',
        zipcode: userData?.address?.zipcode || '',
        country: userData?.address?.country || '',
        phone: userData?.phone || ''
    });

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
                        const itemInfo = structuredClone(products.find(product => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            let orderData = {
                userId: userData?._id, // Will be handled by token in backend middleware usually, but good to have context
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            // Cash on Delivery
            const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
            if (response.data.success) {
                setCartItems({});
                navigate('/my-profile'); // Go to dashboard after order
                toast.success("Order Placed Successfully");
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='container mx-auto px-4 py-10 min-h-[80vh] flex flex-col sm:flex-row justify-between gap-10 pt-5 sm:pt-14 border-t'>
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl font-bold my-3 text-[#233a95]'>DELIVERY INFORMATION</div>
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
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-2 px-3.5 w-full' type="number" placeholder='Phone' />
            </div>

            {/* Right Side */}
            <div className='mt-8 w-full sm:max-w-[480px]'>
                <div className='mt-8'>
                    <div className='text-2xl font-bold mb-3 text-[#233a95]'>CART TOTALS</div>
                    <div className='flex flex-col gap-2 mt-2 text-sm'>
                        <div className='flex justify-between py-2 border-b'>
                            <p>Subtotal</p>
                            <p>${getCartAmount()}.00</p>
                        </div>
                        <div className='flex justify-between py-2 border-b'>
                            <p>Shipping Fee</p>
                            <p>$10.00</p>
                        </div>
                        <div className='flex justify-between py-2 font-bold text-lg'>
                            <p>Total</p>
                            <p>${getCartAmount() + 10}.00</p>
                        </div>
                    </div>
                </div>

                <div className='mt-12'>
                    <div className='text-2xl font-bold mb-3 text-[#233a95]'>PAYMENT METHOD</div>
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer rounded bg-gray-50'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full bg-green-400`}></p>
                            <p className='text-gray-700 text-sm font-bold mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-[#D51243] text-white px-16 py-3 rounded font-bold hover:bg-red-700'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder