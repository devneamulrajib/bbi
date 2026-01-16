import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { 
  ShieldCheck, Search, User, ShoppingBag, Menu, ChevronDown, ChevronRight, 
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat, Flame, FolderOpen, LogOut, X
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { categories, getCartCount, token, setToken, navigate, config } = useContext(ShopContext);
  
  // State for Category Dropdown (Mobile Friendly)
  const [showCategories, setShowCategories] = useState(false);
  const catMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const logout = () => {
      localStorage.removeItem('token');
      setToken("");
      navigate('/login');
  }

  const createSlug = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/&/g, '').replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '-');
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catMenuRef.current && !catMenuRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [catMenuRef]);

  // Close dropdown when route changes
  useEffect(() => {
    setShowCategories(false);
  }, [location]);

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm w-full">
      
      {/* 1. Top Bar (Hidden on Mobile) */}
      <div className="bg-[#233a95] text-white text-center py-2 text-sm font-medium hidden md:block">
        Due to the <span className="font-bold">COVID 19</span> epidemic, orders may be processed with a slight delay
      </div>

      {/* 2. Info Bar (Hidden on Mobile) */}
      <div className="border-b border-gray-100 hidden md:block bg-white">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-2"><ShieldCheck size={16} /> <span>100% Secure delivery</span></div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1"><span>Need help? Call Us:</span> <span className="text-blue-600 font-bold">{config?.footer?.phone || "+ 0020 500"}</span></div>
        </div>
      </div>

      {/* 3. MAIN HEADER (Mobile Optimized) */}
      <div className="container mx-auto px-4 py-3 md:py-6 bg-white">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          
          {/* LOGO */}
          <Link to="/" className="shrink-0">
            {config?.logo ? (
                // Increased Size: h-12 on mobile, h-24 on desktop
                <img src={config.logo} alt="Logo" className="h-12 md:h-24 object-contain" />
            ) : (
                <h1 className="text-2xl md:text-4xl font-bold text-black tracking-tight">bacola</h1>
            )}
            <p className="text-xs text-gray-400 mt-1 hidden md:block">Online Grocery Shopping Center</p>
          </Link>

          {/* SEARCH BAR (Flexible Width) */}
          <div className="flex-1 max-w-2xl mx-2 md:mx-auto bg-gray-100 rounded-lg flex items-center px-3 py-2 md:px-4 md:py-3 border border-gray-200">
            <input type="text" placeholder="Search..." className="bg-transparent flex-grow outline-none text-gray-600 placeholder-gray-400 text-xs md:text-base w-full"/>
            <Search className="text-gray-500 cursor-pointer shrink-0" size={18} />
          </div>

          {/* ICONS AREA */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
             
             {/* USER ACCOUNT */}
             {token ? (
                 <div className='group relative'>
                    <Link to="/my-profile">
                        <div className="rounded-full border border-gray-300 p-1.5 md:p-2 cursor-pointer hover:bg-blue-50 transition bg-blue-50 border-blue-200">
                            <User size={20} className="text-blue-600 md:w-6 md:h-6" />
                        </div>
                    </Link>
                    {/* Dropdown Menu */}
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white text-gray-500 rounded shadow-lg border border-gray-100'>
                            <p className='text-xs text-gray-400 mb-1 uppercase'>Account</p>
                            <Link to="/my-profile" className='cursor-pointer hover:text-[#233a95] font-medium text-sm flex items-center gap-2'><User size={14}/> Profile</Link>
                            <hr className='border-gray-100 my-1'/>
                            <p onClick={logout} className='cursor-pointer hover:text-red-500 font-medium text-sm flex items-center gap-2'><LogOut size={14}/> Logout</p>
                        </div>
                    </div>
                 </div>
             ) : (
                 <Link to="/login">
                   <div className="rounded-full border border-gray-300 p-1.5 md:p-2 cursor-pointer hover:bg-blue-50 transition group">
                     <User size={20} className="text-gray-700 md:w-6 md:h-6" />
                   </div>
                 </Link>
             )}

            {/* Price (Hidden on Mobile) */}
            <div className="font-bold text-gray-900 hidden lg:block">$0.00</div>
            
            {/* CART LINK */}
            <Link to='/cart'>
                <div className="relative bg-orange-100 rounded-full p-2 md:p-3 cursor-pointer hover:bg-orange-200">
                    <ShoppingBag size={20} className="text-red-500 md:w-6 md:h-6" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 md:h-5 md:w-5 flex items-center justify-center rounded-full border-2 border-white">
                      {getCartCount()}
                    </span>
                </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. NAVIGATION BAR */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-8 relative z-40">
            
            {/* Dropdown Button Area */}
            <div className="w-full lg:w-auto py-2 lg:py-0" ref={catMenuRef}>
                {/* Toggle Button */}
                <button 
                  onClick={() => setShowCategories(!showCategories)} 
                  className="w-full lg:w-64 bg-[#2bbef9] hover:bg-[#209dd0] text-white px-4 py-2.5 lg:py-3 rounded-full flex items-center justify-between font-bold transition shadow-sm text-sm md:text-base"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <Menu size={18} /><span>ALL CATEGORIES</span>
                  </div>
                  {showCategories ? <X size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Dropdown Menu */}
                <div className={`${showCategories ? 'block' : 'hidden'} absolute top-full left-0 w-full lg:w-64 bg-white border border-gray-200 shadow-xl rounded-xl pt-2 pb-2 mt-1 z-50`}>
                  <ul className="flex flex-col max-h-[60vh] overflow-y-auto">
                      {categories.length > 0 ? categories.map((cat, index) => {
                      const IconComponent = getCategoryIcon(cat.name);
                      const slugLink = `/category/${createSlug(cat.name)}`;
                      return (
                          <Link key={index} to={slugLink} onClick={() => setShowCategories(false)}>
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

            {/* Nav Links (Cleaned: Only Home, Blog, Contact) */}
            <nav className="flex items-center gap-4 md:gap-6 text-xs font-bold uppercase text-gray-600 w-full lg:w-auto tracking-wide overflow-x-auto whitespace-nowrap pb-2 lg:pb-0 hide-scrollbar">
                <Link to="/" className={`hover:text-blue-500 ${isActive('/') ? 'text-blue-600' : ''}`}>HOME</Link>
                <Link to="/blog" className={`hover:text-blue-500 ${isActive('/blog') ? 'text-blue-600' : ''}`}>BLOG</Link>
                <Link to="/contact" className={`hover:text-blue-500 ${isActive('/contact') ? 'text-blue-600' : ''}`}>CONTACT</Link>
            </nav>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Header;