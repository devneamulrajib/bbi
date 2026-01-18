import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Bell, User, LogOut, LayoutDashboard, Settings } from 'lucide-react'

const Navbar = ({ setToken }) => {
    
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const logoutHandler = () => {
        setToken('');
        navigate('/login'); // Optional, if you have a specific login route
    }

    return (
        <div className='flex items-center justify-between py-3 px-[4%] bg-white shadow-sm sticky top-0 z-50'>
            {/* Logo Section */}
            <Link to='/' className='flex items-center gap-2'>
                <img 
                    src={assets.logo} 
                    className='w-[max(10%,80px)] cursor-pointer' 
                    alt="Logo" 
                />
            </Link>

            {/* Right Side Icons */}
            <div className='flex items-center gap-6'>
                
                {/* Notification Bell with Badge */}
                <div className='relative cursor-pointer text-gray-600 hover:text-green-600 transition'>
                    <Bell size={22} />
                    <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full'>1</span>
                </div>

                {/* Profile Dropdown */}
                <div className='relative' ref={dropdownRef}>
                    <div 
                        onClick={() => setShowDropdown(!showDropdown)} 
                        className='flex items-center gap-2 cursor-pointer'
                    >
                        <img 
                            src={assets.profile_icon || "https://via.placeholder.com/40"} // Use asset or placeholder
                            className='w-10 h-10 rounded-full object-cover border-2 border-gray-100 hover:border-green-500 transition' 
                            alt="Admin" 
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className='absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right'>
                            
                            <Link 
                                to="/" 
                                onClick={() => setShowDropdown(false)}
                                className='flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition'
                            >
                                <LayoutDashboard size={18} />
                                <span>Dashboard</span>
                            </Link>
                            
                            <Link 
                                to="/profile" 
                                onClick={() => setShowDropdown(false)}
                                className='flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition'
                            >
                                <Settings size={18} />
                                <span>Edit Profile</span>
                            </Link>
                            
                            <div className='border-t my-1'></div>
                            
                            <button 
                                onClick={logoutHandler}
                                className='w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition text-left'
                            >
                                <LogOut size={18} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar