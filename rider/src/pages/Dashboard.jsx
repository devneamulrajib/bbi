import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
    Package, MapPin, Phone, CheckCircle, DollarSign, 
    Navigation, RefreshCw, User, Truck, Clock, 
    ChevronDown, ChevronUp, LogOut
} from 'lucide-react'

const Dashboard = ({ token, setToken }) => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('active') // 'active', 'history', 'profile'
    const [expandedOrderId, setExpandedOrderId] = useState(null)
    // ADDED: State to hold rider name
    const [riderName, setRiderName] = useState(localStorage.getItem('riderName') || 'Rider')
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Stats Calculations
    const totalEarnings = orders.filter(o => o.status === 'Delivered').reduce((acc, curr) => acc + curr.amount, 0);
    const completedRides = orders.filter(o => o.status === 'Delivered').length;

    // Fetch Orders
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/order/rider/list', {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Network Error or API not ready");
        } finally {
            setLoading(false);
        }
    }

    // Update Status
    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await axios.post(backendUrl + '/api/order/rider/status', { orderId, status: newStatus }, { headers: { token } });
            if(res.data.success) {
                toast.success(`Status updated to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Collect Cash Payment
    const markPaid = async (orderId) => {
        if(!window.confirm("Confirm Cash Collection? This cannot be undone.")) return;
        try {
            const res = await axios.post(backendUrl + '/api/order/payment', { orderId }, { headers: { token } });
            if(res.data.success) {
                toast.success("Payment Collected!");
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const toggleExpand = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    }

    useEffect(() => {
        if(token) fetchOrders();
    }, [token])

    // --- SUB-COMPONENTS ---

    const OrderCard = ({ order, isHistory }) => (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all duration-300'>
            {/* Header */}
            <div className='bg-gray-50 p-4 flex justify-between items-center border-b border-gray-100'>
                <div className='flex items-center gap-2'>
                    <div className={`p-2 rounded-full ${order.payment ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        <DollarSign size={16} />
                    </div>
                    <div>
                        <p className='font-bold text-gray-800 text-sm'>ID: {order._id.slice(-6).toUpperCase()}</p>
                        <p className='text-xs text-gray-500'>{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Delivered' ? 'bg-green-500 text-white' : 
                    order.status === 'Out for delivery' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                    {order.status}
                </span>
            </div>

            {/* Content */}
            <div className='p-4'>
                {/* Customer Details */}
                <div className='flex justify-between items-start mb-4'>
                    <div>
                        <h4 className='font-bold text-gray-800 text-lg'>{order.address.firstName} {order.address.lastName}</h4>
                        <div className='flex items-start gap-2 text-gray-500 text-sm mt-1'>
                            <MapPin size={14} className='mt-1 flex-shrink-0' />
                            <p>{order.address.street}, {order.address.city}, {order.address.zipcode}</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <a href={`tel:${order.address.phone}`} className='p-2 bg-green-50 rounded-full text-green-600 border border-green-200 hover:bg-green-100'>
                            <Phone size={18} />
                        </a>
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address.street + " " + order.address.city)}`}
                            target="_blank" 
                            rel="noreferrer"
                            className='p-2 bg-blue-50 rounded-full text-blue-600 border border-blue-200 hover:bg-blue-100'
                        >
                            <Navigation size={18} />
                        </a>
                    </div>
                </div>

                {/* Amount & Items Toggle */}
                <div className='flex justify-between items-center bg-gray-50 p-3 rounded-lg'>
                    <div>
                        <p className='text-xs text-gray-500'>Order Amount</p>
                        <p className='font-bold text-xl text-gray-800'>Tk {order.amount}</p>
                    </div>
                    <button onClick={() => toggleExpand(order._id)} className='flex items-center gap-1 text-sm text-gray-600 hover:text-black'>
                        {order.items.length} Items {expandedOrderId === order._id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                </div>

                {/* Expanded Product List */}
                {expandedOrderId === order._id && (
                    <div className='mt-3 border-t pt-3'>
                        {order.items.map((item, idx) => (
                            <div key={idx} className='flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0'>
                                <span className='text-gray-700'>{item.name} x{item.quantity}</span>
                                <span className='font-medium text-gray-900'>{item.size}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {!isHistory && (
                <div className='p-4 pt-0 grid grid-cols-2 gap-3'>
                    <button 
                        disabled={order.payment}
                        onClick={() => markPaid(order._id)}
                        className={`py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                            order.payment 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                    >
                        {order.payment ? <CheckCircle size={18} /> : <DollarSign size={18} />}
                        {order.payment ? 'Paid' : 'Collect Cash'}
                    </button>

                    {order.status !== 'Delivered' ? (
                        <button 
                            onClick={() => updateStatus(order._id, 'Delivered')}
                            className='bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 flex items-center justify-center gap-2'
                        >
                            <Truck size={18} /> Mark Delivered
                        </button>
                    ) : (
                        <div className='bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2'>
                            <CheckCircle size={18} /> Completed
                        </div>
                    )}
                </div>
            )}
        </div>
    )

    // --- MAIN RENDER ---

    return (
        <div className='min-h-screen bg-gray-50 pb-24 font-sans'>
            
            {/* Top Bar */}
            <div className='bg-black text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-10'>
                <div className='flex justify-between items-center mb-6'>
                    <div>
                        {/* CHANGED: Uses riderName variable */}
                        <h1 className='text-2xl font-bold'>Hello, {riderName} 👋</h1>
                        <p className='text-gray-400 text-sm'>Let's deliver some happiness!</p>
                    </div>
                    <button onClick={fetchOrders} className='p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition'>
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-gray-800 p-3 rounded-xl'>
                        <p className='text-gray-400 text-xs uppercase tracking-wider'>Today's Earnings</p>
                        <p className='text-2xl font-bold text-green-400'>Tk {totalEarnings}</p>
                    </div>
                    <div className='bg-gray-800 p-3 rounded-xl'>
                        <p className='text-gray-400 text-xs uppercase tracking-wider'>Completed</p>
                        <p className='text-2xl font-bold text-blue-400'>{completedRides} <span className='text-xs text-gray-500 font-normal'>Orders</span></p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className='p-4 max-w-2xl mx-auto'>
                
                {/* ACTIVE TAB */}
                {activeTab === 'active' && (
                    <div className='fade-in'>
                        <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Truck className='text-black' size={20} /> Active Deliveries
                        </h3>
                        {orders.filter(o => o.status !== 'Delivered').length === 0 ? (
                            <div className='text-center py-20 text-gray-400'>
                                <Package size={64} className='mx-auto mb-4 opacity-20' />
                                <p>No pending deliveries. You're all caught up!</p>
                            </div>
                        ) : (
                            orders.filter(o => o.status !== 'Delivered').map(order => (
                                <OrderCard key={order._id} order={order} isHistory={false} />
                            ))
                        )}
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className='fade-in'>
                         <h3 className='font-bold text-gray-800 mb-4 flex items-center gap-2'>
                            <Clock className='text-black' size={20} /> Past Deliveries
                        </h3>
                        {orders.filter(o => o.status === 'Delivered').map(order => (
                            <OrderCard key={order._id} order={order} isHistory={true} />
                        ))}
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className='bg-white rounded-xl shadow-sm p-6 fade-in'>
                        <div className='text-center mb-6'>
                            <div className='w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center'>
                                <User size={40} className='text-gray-500' />
                            </div>
                            <h2 className='text-xl font-bold'>{riderName}</h2>
                            <p className='text-gray-500'>Delivery Partner</p>
                        </div>
                        
                        <div className='space-y-4'>
                            <div className='p-4 bg-gray-50 rounded-lg'>
                                <p className='text-xs text-gray-400'>Status</p>
                                <p className='font-bold text-green-600 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span> Online
                                </p>
                            </div>
                            
                            <button 
                                onClick={() => { 
                                    setToken(''); 
                                    localStorage.removeItem('token'); 
                                    localStorage.removeItem('riderName'); // Clear name on logout
                                }}
                                className='w-full py-3 bg-red-50 text-red-600 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 transition'
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Bottom Navigation Bar */}
            <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-2 pb-safe flex justify-around items-center z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]'>
                <button 
                    onClick={() => setActiveTab('active')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'active' ? 'text-black' : 'text-gray-400'}`}
                >
                    <Truck size={24} strokeWidth={activeTab === 'active' ? 2.5 : 2} />
                    <span className='text-[10px] font-bold mt-1'>Active</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'history' ? 'text-black' : 'text-gray-400'}`}
                >
                    <Clock size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
                    <span className='text-[10px] font-bold mt-1'>History</span>
                </button>

                <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'profile' ? 'text-black' : 'text-gray-400'}`}
                >
                    <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
                    <span className='text-[10px] font-bold mt-1'>Profile</span>
                </button>
            </div>
        </div>
    )
}

export default Dashboard