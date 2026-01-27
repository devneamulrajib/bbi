import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets' 
import { Bell, LogOut, LayoutDashboard, Settings, X, ShoppingBag } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../App' 

const Navbar = ({ setToken, token }) => {
    
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    
    const [adminData, setAdminData] = useState({
        name: 'Admin',
        image: ''
    });

    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const navigate = useNavigate();

    // --- Helper: Robust Image URL Generator ---
    const getImageUrl = (img) => {
        if (!img) return assets.profile_icon;
        
        // If it's a Cloudinary/External URL, use it directly
        if (img.startsWith('http') || img.startsWith('https') || img.startsWith('blob:')) {
            return img;
        }

        // If it's a local filename, prepend backend URL + /images/
        // Matches the 'app.use' line we added in server.js
        return `${backendUrl}/images/${img}`; 
    }

    // --- 1. Fetch Notifications ---
    const fetchNotifications = async () => {
        const authToken = token || localStorage.getItem('token');
        if (!authToken) return;

        try {
            const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token: authToken } });
            
            if (response.data.success) {
                const allOrders = response.data.orders || response.data.data || [];
                const newOrders = allOrders.filter(o => o.status && o.status.trim() === 'Order Placed');
                newOrders.sort((a,b) => new Date(b.date) - new Date(a.date));
                setNotifications(newOrders);
            }
        } catch (error) {
            // console.log("Notification fetch error");
        }
    };

    // --- 2. Fetch Admin Profile Info ---
    const fetchAdminInfo = async () => {
        const authToken = token || localStorage.getItem('token');
        if (!authToken) return;

        try {
            // We use ?t=Date.now() to trick the browser into ignoring the cache and downloading the new image
            const response = await axios.get(backendUrl + '/api/user/profile?t=' + Date.now(), { headers: { token: authToken } });
            if (response.data.success) {
                const userData = response.data.user || response.data.userData;
                if (userData) {
                    setAdminData(userData);
                }
            }
        } catch (error) {
            console.error("Profile load failed", error);
        }
    };

    // --- 3. Effects ---
    useEffect(() => {
        fetchNotifications();
        fetchAdminInfo();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 10000);

        return () => clearInterval(interval);
    }, [token]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logoutHandler = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/login'); 
    }

    return (
        <div className='flex items-center justify-between py-3 px-[4%] bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100'>
            {/* Logo Section */}
            <Link to='/' className='flex items-center gap-2'>
                <img 
                    src={assets.logo} 
                    className='w-[max(10%,80px)] cursor-pointer' 
                    alt="Logo" 
                />
            </Link>

            {/* Right Side Icons */}
            <div className='flex items-center gap-4 md:gap-6'>
                
                {/* --- NOTIFICATION BELL --- */}
                <div className='relative' ref={notifRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 transition rounded-full hover:bg-gray-100 ${showNotifications ? 'text-green-600 bg-gray-50' : 'text-gray-600'}`}
                    >
                        <Bell size={22} />
                        {notifications.length > 0 && (
                            <span className='absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-pulse shadow-sm border border-white'>
                                {notifications.length}
                            </span>
                        )}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className='absolute right-[-60px] md:right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden'>
                            <div className='p-3 border-b bg-gray-50 flex justify-between items-center'>
                                <h3 className='font-bold text-gray-700 text-sm'>Notifications</h3>
                                <button onClick={()=>setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className='max-h-72 overflow-y-auto custom-scrollbar'>
                                {notifications.length > 0 ? notifications.map((order, index) => (
                                    <Link to="/orders" key={index} onClick={()=>setShowNotifications(false)} className='block p-3 border-b hover:bg-green-50 transition group'>
                                        <div className='flex items-start gap-3'>
                                            <div className='bg-green-100 p-2 rounded-full text-green-600 mt-1'><ShoppingBag size={14} /></div>
                                            <div>
                                                <p className='text-sm font-semibold text-gray-800'>New Order</p>
                                                <p className='text-xs text-gray-500'>{order.items.length} Items</p>
                                            </div>
                                        </div>
                                    </Link>
                                )) : <div className='p-8 text-center text-gray-400 text-sm'>No pending orders.</div>}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- PROFILE DROPDOWN --- */}
                <div className='relative' ref={dropdownRef}>
                    <div 
                        onClick={() => setShowDropdown(!showDropdown)} 
                        className='flex items-center gap-3 cursor-pointer select-none p-1 pr-2 rounded-full hover:bg-gray-50 transition'
                    >
                        {/* ROBUST IMAGE RENDERING */}
                        <img 
                            src={adminData?.image ? getImageUrl(adminData.image) : assets.profile_icon} 
                            onError={(e) => {
                                // If image fails, revert to default icon immediately
                                e.target.onerror = null; 
                                e.target.src = assets.profile_icon
                            }} 
                            className='w-9 h-9 rounded-full object-cover border border-gray-200' 
                            alt="Admin" 
                        />
                        <div className='hidden md:block text-left'>
                            <p className='text-sm font-bold text-gray-700 leading-none'>
                                {adminData?.name || 'Admin'}
                            </p>
                            <p className='text-[10px] text-gray-500 mt-0.5'>Administrator</p>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className='absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 origin-top-right'>
                            <div className='px-4 py-2 border-b mb-1 md:hidden'>
                                <p className='text-sm font-bold text-gray-800'>{adminData?.name || 'Admin'}</p>
                            </div>
                            <Link to="/" onClick={() => setShowDropdown(false)} className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 transition'>
                                <LayoutDashboard size={16} /> <span>Dashboard</span>
                            </Link>
                            <Link to="/profile" onClick={() => setShowDropdown(false)} className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 transition'>
                                <Settings size={16} /> <span>Edit Profile</span>
                            </Link>
                            <div className='border-t my-1 mx-2'></div>
                            <button onClick={logoutHandler} className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left rounded-md'>
                                <LogOut size={16} /> <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar