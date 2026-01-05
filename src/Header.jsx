import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { 
  ShieldCheck, Search, User, ShoppingBag, Menu, ChevronDown, ChevronRight, 
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat, Flame, FolderOpen, LogOut
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { categories, getCartCount, token, setToken, navigate, config } = useContext(ShopContext);

  const isActive = (path) => location.pathname === path;

  // --- LOGOUT FUNCTION ---
  const logout = () => {
      localStorage.removeItem('token');
      setToken("");
      navigate('/login');
  }

  // --- HELPER: Slug Generator ---
  const createSlug = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/&/g, '').replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '-');
  };

  // --- HELPER: Icon Selector ---
  const getCategoryIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('fruit') || lowerName.includes('vegetable')) return Apple;
    if (lowerName.includes('meat') || lowerName.includes('seafood')) return Beef;
    if (lowerName.includes('breakfast') || lowerName.includes('dairy')) return Egg;
    if (lowerName.includes('beverage') || lowerName.includes('drink')) return Coffee;
    if (lowerName.includes('bread') || lowerName.includes('bakery')) return Cookie;
    if (lowerName.includes('frozen')) return Snowflake;
    if (lowerName.includes('snack') || lowerName.includes('biscuit')) return Candy;
    if (lowerName.includes('grocery')) return Wheat;
    return FolderOpen;
  };

  return (
    // STICKY WRAPPER: Locks header to top
    <div className="sticky top-0 z-50 bg-white shadow-sm w-full">
      
      {/* Top Bar */}
      <div className="bg-[#233a95] text-white text-center py-2 text-sm font-medium hidden md:block">
        Due to the <span className="font-bold">COVID 19</span> epidemic, orders may be processed with a slight delay
      </div>

      {/* Info Bar */}
      <div className="border-b border-gray-100 hidden md:block bg-white">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-2"><ShieldCheck size={16} /> <span>100% Secure delivery</span></div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1"><span>Need help? Call Us:</span> <span className="text-blue-600 font-bold">{config?.footer?.phone || "+ 0020 500"}</span></div>
        </div>
      </div>

      {/* Logo & Search */}
      <div className="container mx-auto px-4 py-6 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* DYNAMIC LOGO (Increased Size) */}
          <Link to="/" className="text-center md:text-left min-w-max">
            {config?.logo ? (
                // UPDATED SIZE: h-14 on mobile, h-20 on desktop
                <img src={config.logo} alt="Logo" className="h-14 md:h-20 object-contain" />
            ) : (
                <>
                    <h1 className="text-4xl font-bold text-black tracking-tight">bacola</h1>
                    <p className="text-xs text-gray-400 mt-1">Online Grocery Shopping Center</p>
                </>
            )}
          </Link>

          <div className="w-full md:max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center px-4 py-3 border border-gray-200">
            <input type="text" placeholder="Search for products..." className="bg-transparent flex-grow outline-none text-gray-600 placeholder-gray-400"/>
            <Search className="text-gray-500 cursor-pointer" size={20} />
          </div>

          <div className="flex items-center gap-5 min-w-max">
             
             {/* USER ACCOUNT */}
             {token ? (
                 <div className='group relative'>
                    <Link to="/my-profile">
                        <div className="rounded-full border border-gray-300 p-2 cursor-pointer hover:bg-blue-50 transition bg-blue-50 border-blue-200">
                            <User size={24} className="text-blue-600" />
                        </div>
                    </Link>
                    {/* Dropdown Menu */}
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-lg border border-gray-100'>
                            <p className='text-xs text-gray-400 mb-1 uppercase'>Account</p>
                            <Link to="/my-profile" className='cursor-pointer hover:text-[#233a95] font-medium text-sm flex items-center gap-2'>
                                <User size={14}/> Profile
                            </Link>
                            <hr className='border-gray-100 my-1'/>
                            <p onClick={logout} className='cursor-pointer hover:text-red-500 font-medium text-sm flex items-center gap-2'>
                                <LogOut size={14}/> Logout
                            </p>
                        </div>
                    </div>
                 </div>
             ) : (
                 <Link to="/login">
                   <div className="rounded-full border border-gray-300 p-2 cursor-pointer hover:bg-blue-50 transition group">
                     <User size={24} className="text-gray-700 group-hover:text-blue-600" />
                   </div>
                 </Link>
             )}

            <div className="font-bold text-gray-900 hidden sm:block">$0.00</div>
            
            {/* CART LINK */}
            <Link to='/cart'>
                <div className="relative bg-orange-100 rounded-full p-3 cursor-pointer hover:bg-orange-200">
                    <ShoppingBag size={20} className="text-red-500" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">{getCartCount()}</span>
                </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 relative z-50 h-14">
            
            {/* Dropdown Button */}
            <div className="group relative w-full lg:w-auto h-full flex items-center">
                <button className="w-full lg:w-64 bg-[#2bbef9] hover:bg-[#209dd0] text-white px-6 py-3 rounded-full flex items-center justify-between font-bold transition shadow-sm h-10">
                <div className="flex items-center gap-3"><Menu size={20} /><span>ALL CATEGORIES</span></div><ChevronDown size={16} />
                </button>
                <div className="hidden group-hover:block absolute top-full left-0 w-full lg:w-64 bg-white border border-gray-200 shadow-xl rounded-xl pt-2 pb-2 mt-2">
                <ul className="flex flex-col max-h-[400px] overflow-y-auto">
                    {categories.length > 0 ? categories.map((cat, index) => {
                    const IconComponent = getCategoryIcon(cat.name);
                    const slugLink = `/category/${createSlug(cat.name)}`;
                    return (
                        <Link key={index} to={slugLink}>
                        <li className="group/item flex items-center justify-between px-6 py-3 hover:text-[#2bbef9] cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-4 text-gray-500 group-hover/item:text-[#2bbef9]">
                            <IconComponent size={20} strokeWidth={1.5} />
                            <span className="font-medium text-sm text-gray-700 group-hover/item:text-[#2bbef9] capitalize">{cat.name}</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                        </li>
                        </Link>
                    )
                    }) : <li className="px-6 py-3 text-sm text-gray-400">Loading categories...</li>}
                </ul>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-wrap items-center gap-5 text-xs font-bold uppercase text-gray-600 w-full lg:w-auto tracking-wide">
                <Link to="/" className={`px-2 py-1 ${isActive('/') ? 'text-blue-600 font-bold' : 'hover:text-blue-500'}`}>HOME</Link>
                <div className="flex items-center gap-2 text-black cursor-default"><span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1 animate-pulse shadow-sm tracking-wide"><Flame size={10} fill="currentColor" /> POPULAR</span></div>
                {categories.slice(0, 3).map((cat, idx) => (
                <Link key={idx} to={`/category/${createSlug(cat.name)}`} className={`flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 hover:border-[#2bbef9] hover:text-[#2bbef9] bg-white transition-all`}><span className='uppercase'>{cat.name}</span></Link>
                ))}
                <Link to="/blog" className={`hover:text-blue-500 ml-2 ${isActive('/blog') ? 'text-blue-600 font-bold' : ''}`}>BLOG</Link>
                <Link to="/contact" className={`hover:text-blue-500 ${isActive('/contact') ? 'text-blue-600 font-bold' : ''}`}>CONTACT</Link>
            </nav>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Header;