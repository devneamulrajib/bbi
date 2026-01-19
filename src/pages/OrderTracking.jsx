import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { Search, Package, Clock, CheckCircle, Truck } from 'lucide-react';

const OrderTracking = () => {
    const { backendUrl, currency } = useContext(ShopContext);
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/order/track', { phone });
            if (response.data.success) {
                setOrders(response.data.data.reverse()); // Show newest first
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    return (
        <div className="min-h-[70vh] container mx-auto px-4 py-10 pt-20">
            <div className="max-w-xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold text-[#233a95] mb-4">Track Your Order</h2>
                <p className="text-gray-500 mb-6">Enter the mobile number you used during checkout to see your order status.</p>
                
                <form onSubmit={handleTrack} className="flex gap-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter Mobile Number (e.g. 017...)" 
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#233a95] shadow-sm"
                    />
                    <button disabled={loading} className="bg-[#233a95] text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition">
                        {loading ? 'Searching...' : 'Track'}
                    </button>
                </form>
            </div>

            <div className="max-w-2xl mx-auto">
                {searched && orders.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <Package size={48} className="mx-auto mb-2 opacity-50"/>
                        <p>No orders found for this number.</p>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
                            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    <span className="font-bold text-gray-800">Date:</span> {new Date(order.date).toLocaleDateString()}
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase
                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {order.status === 'Delivered' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                                    {order.status}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <div className="flex flex-col gap-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-dashed pb-2 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">{item.quantity} x</span>
                                                <span className="text-gray-800 font-medium">{item.name}</span>
                                                <span className="text-gray-400 text-xs">({item.size})</span>
                                            </div>
                                            <div className="font-semibold text-gray-700">
                                                {currency}{item.price * item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <Truck size={16} /> {order.paymentMethod}
                                    </div>
                                    <div className="text-lg font-bold text-[#233a95]">
                                        Total: {currency}{order.amount}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;