import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
    Package, MapPin, Phone, CheckCircle, DollarSign, 
    Navigation, RefreshCw, LogOut 
} from 'lucide-react'

const Dashboard = ({ token, setToken }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Helper to get Rider ID from Token
    const getRiderId = () => {
        if(!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).id;
        } catch (e) {
            return null;
        }
    }

    const fetchOrders = async () => {
        const riderId = getRiderId();
        if(!riderId) return;

        try {
            setLoading(true);
            const response = await axios.post(backendUrl + '/api/user/rider/orders', { riderId });
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Mark as Delivered
    const completeDelivery = async (orderId) => {
        if(!window.confirm("Confirm delivery completion?")) return;
        try {
            const res = await axios.post(backendUrl + '/api/user/rider/status', { orderId, status: 'Delivered' });
            if(res.data.success) {
                toast.success("Order Delivered!");
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Collect Cash
    const collectPayment = async (orderId) => {
        if(!window.confirm("Have you collected the cash? This cannot be undone.")) return;
        try {
            const res = await axios.post(backendUrl + '/api/user/rider/pay', { orderId });
            if(res.data.success) {
                toast.success("Payment Collected!");
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = () => {
        setToken('');
        localStorage.removeItem('token');
    }

    useEffect(() => {
        if(token) fetchOrders();
    }, [token])

    return (
        <div className='min-h-screen bg-gray-100 pb-20'>
            
            {/* Header */}
            <div className='bg-green-700 text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center'>
                <h2 className='text-lg font-bold flex items-center gap-2'>
                    <Package /> My Deliveries
                </h2>
                <div className='flex gap-4'>
                    <button onClick={fetchOrders} className='p-2 bg-green-800 rounded-full hover:bg-green-600'>
                        <RefreshCw size={20} />
                    </button>
                    <button onClick={logout} className='p-2 bg-red-600 rounded-full hover:bg-red-500'>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className='p-4 flex flex-col gap-4'>
                {loading ? (
                    <p className='text-center text-gray-500 mt-10'>Loading assignments...</p>
                ) : orders.length === 0 ? (
                    <div className='text-center mt-20 text-gray-400'>
                        <Package size={48} className='mx-auto mb-2 opacity-50'/>
                        <p>No active deliveries assigned.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                            
                            {/* Card Header */}
                            <div className='bg-gray-50 p-3 border-b flex justify-between items-center'>
                                <span className='font-mono font-bold text-gray-700'>#{order._id.slice(-6).toUpperCase()}</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className='p-4 flex flex-col gap-3'>
                                {/* Address */}
                                <div className='flex gap-3'>
                                    <MapPin className='text-red-500 mt-1 flex-shrink-0' size={20} />
                                    <div>
                                        <p className='font-bold text-gray-800'>{order.address.firstName} {order.address.lastName}</p>
                                        <p className='text-sm text-gray-600'>{order.address.street}, {order.address.city}</p>
                                        
                                        {/* Google Maps Link */}
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address.street + " " + order.address.city)}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className='text-blue-600 text-xs flex items-center gap-1 mt-1 font-medium'
                                        >
                                            <Navigation size={12}/> Open in Maps
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className='flex gap-3 items-center'>
                                    <Phone className='text-green-500 flex-shrink-0' size={20} />
                                    <a href={`tel:${order.address.phone}`} className='text-gray-800 font-medium hover:text-green-600'>
                                        {order.address.phone}
                                    </a>
                                </div>

                                {/* Payment Info */}
                                <div className='bg-gray-100 p-3 rounded-lg flex justify-between items-center mt-2'>
                                    <div>
                                        <p className='text-xs text-gray-500 uppercase'>Total Amount</p>
                                        <p className='text-xl font-bold text-gray-800'>Tk {order.amount}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.payment ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                    }`}>
                                        {order.payment ? 'PAID' : order.paymentMethod === 'COD' ? 'Collect Cash' : 'Unpaid'}
                                    </div>
                                </div>
                            </div>

                            {/* Actions (Only if not delivered) */}
                            {order.status !== 'Delivered' && (
                                <div className='p-3 border-t grid grid-cols-2 gap-3'>
                                    {!order.payment && (
                                        <button 
                                            onClick={() => collectPayment(order._id)}
                                            className='flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-lg font-bold hover:bg-yellow-600 transition'
                                        >
                                            <DollarSign size={18} /> Cash
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => completeDelivery(order._id)}
                                        className={`flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition ${order.payment ? 'col-span-2' : ''}`}
                                    >
                                        <CheckCircle size={18} /> Delivered
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Dashboard