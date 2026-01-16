import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { Package, User, MapPin, LogOut, Heart, ShoppingCart } from 'lucide-react' // Added Heart
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const MyProfile = () => {
    const { token, setToken, backendUrl, navigate, currency, products, addToCart, wishlist, addToWishlist } = useContext(ShopContext);
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');

    // Fetch Data
    useEffect(() => {
        if(!token) { navigate('/login'); return; }

        const loadData = async () => {
            try {
                // Get Profile
                const uRes = await axios.get(backendUrl + '/api/user/profile', { headers: { token } });
                if(uRes.data.success) setUserData(uRes.data.userData);

                // Get Orders
                const oRes = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
                if(oRes.data.success) setOrders(oRes.data.orders.reverse());
            } catch (e) { console.error(e) }
        }
        loadData();
    }, [token]);

    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        navigate('/login');
    }

    if(!userData) return <div className='p-10 text-center'>Loading Dashboard...</div>

    // Filter Products for Wishlist
    const wishlistProducts = products.filter(p => wishlist.includes(p._id));

    return (
        <div className='container mx-auto px-4 py-10 min-h-[60vh]'>
            <h1 className='text-3xl font-bold text-[#233a95] mb-8'>My Account</h1>
            
            <div className='flex flex-col md:flex-row gap-8'>
                {/* Sidebar */}
                <div className='w-full md:w-1/4'>
                    <div className='bg-white border rounded-xl p-4 flex flex-col gap-2'>
                        <button onClick={()=>setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeTab==='orders'?'bg-blue-50 text-blue-600 font-bold':'text-gray-600 hover:bg-gray-50'}`}>
                            <Package size={20}/> My Orders
                        </button>
                        <button onClick={()=>setActiveTab('wishlist')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeTab==='wishlist'?'bg-blue-50 text-blue-600 font-bold':'text-gray-600 hover:bg-gray-50'}`}>
                            <Heart size={20}/> My Wishlist ({wishlist.length})
                        </button>
                        <button onClick={()=>setActiveTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeTab==='profile'?'bg-blue-50 text-blue-600 font-bold':'text-gray-600 hover:bg-gray-50'}`}>
                            <User size={20}/> Profile Settings
                        </button>
                        <button onClick={logout} className='flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-500 hover:bg-red-50'>
                            <LogOut size={20}/> Logout
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='w-full md:w-3/4'>
                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <div className='flex flex-col gap-4'>
                            {orders.map((order, i) => (
                                <div key={i} className='border rounded-xl p-6 bg-white shadow-sm'>
                                    <div className='flex justify-between items-center border-b pb-4 mb-4'>
                                        <div><p className='font-bold text-lg'>Order #{order._id.slice(-6)}</p><p className='text-sm text-gray-500'>{new Date(order.date).toDateString()}</p></div>
                                        <div className='text-right'><p className={`font-bold ${order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>{order.status}</p><p className='text-xs text-gray-500'>{order.paymentMethod}</p></div>
                                    </div>
                                    <div className='flex flex-col gap-2 mb-4'>
                                        {order.items.map((item, idx)=>(<div key={idx} className='flex justify-between text-sm text-gray-700'><span>{item.name} x {item.quantity} ({item.size})</span><span>{currency}{item.price}</span></div>))}
                                    </div>
                                    <div className='flex justify-between items-center pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-3 rounded-b-xl'>
                                        <span className='font-bold text-gray-600'>Amount Due:</span><span className='text-xl font-bold text-red-500'>{currency}{order.amount}</span>
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && <p className='text-gray-500'>No orders found.</p>}
                        </div>
                    )}

                    {/* WISHLIST TAB (NEW) */}
                    {activeTab === 'wishlist' && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {wishlistProducts.map((item, i) => (
                                <div key={i} className='border rounded-xl p-4 bg-white hover:shadow-lg transition relative group'>
                                    <button onClick={()=>addToWishlist(item._id)} className='absolute top-2 right-2 text-red-500 hover:text-gray-400 p-2 bg-white rounded-full shadow'><Heart size={16} fill="currentColor"/></button>
                                    <Link to={`/product/${item._id}`}><img src={item.image[0]} className="h-32 w-full object-contain mb-4"/></Link>
                                    <h4 className='font-bold text-sm mb-1 truncate'>{item.name}</h4>
                                    <div className='flex justify-between items-center mt-2'>
                                        <span className='text-[#D51243] font-bold'>{currency}{item.price}</span>
                                        <button onClick={()=>addToCart(item._id, item.sizes?.[0]||'Standard')} className='bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-600 hover:text-white transition'><ShoppingCart size={16}/></button>
                                    </div>
                                </div>
                            ))}
                            {wishlistProducts.length === 0 && <p className='text-gray-500 col-span-full text-center py-10'>Your wishlist is empty.</p>}
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className='bg-white border rounded-xl p-8'>
                            <h3 className='font-bold text-xl mb-6'>Profile Information</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                <div><p className='text-sm text-gray-500'>Name</p><p className='font-bold'>{userData.name}</p></div>
                                <div><p className='text-sm text-gray-500'>Email</p><p className='font-bold'>{userData.email}</p></div>
                                <div><p className='text-sm text-gray-500'>Phone</p><p className='font-bold'>{userData.phone}</p></div>
                            </div>
                            <div className='border-t pt-6'>
                                <h4 className='font-bold mb-4 flex items-center gap-2'><MapPin size={18}/> Address</h4>
                                <p>{userData.address.street}, {userData.address.city}, {userData.address.state} {userData.address.zipcode}, {userData.address.country}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default MyProfile