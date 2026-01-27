import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from './context/ShopContext'; 
import { 
  ShieldCheck, Search, User, ShoppingBag, Menu, ChevronDown, ChevronRight, 
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat, FolderOpen, LogOut, X, Circle
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { 
    categories, products, 
    getCartCount, getCartAmount, currency, 
    token, setToken, navigate, config,
    search, setSearch, setShowSearch 
  } = useContext(ShopContext);
  
  const [showCategories, setShowCategories] = useState(false);
  const [liveResults, setLiveResults] = useState([]); 
  const catMenuRef = useRef(null);
  const searchRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const logout = () => {
      localStorage.removeItem('token');
      setToken("");
      navigate('/login');
  }

  // --- Live Search Logic ---
  useEffect(() => {
    if (search && search.length > 0 && products.length > 0) {
        const filtered = products.filter(item => 
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setLiveResults(filtered.slice(0, 5)); 
    } else {
        setLiveResults([]);
    }
  }, [search, products]);

  const handleSearchSubmit = () => {
      setShowSearch(true);
      setLiveResults([]); 
      navigate('/collection'); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catMenuRef.current && !catMenuRef.current.contains(event.target)) {
        setShowCategories(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setLiveResults([]); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HELPER: Normalize Strings ---
  const createSlug = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/&/g, '').replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '-');
  };

  // --- HELPER: Get Category Icon ---
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
    <div className="sticky top-0 z-50 bg-white shadow-sm w-full font-sans">
      
      {/* Top Bar */}
      <div className="bg-[#233a95] text-white text-center py-1.5 text-xs md:text-sm font-medium hidden md:block">
        Due to the <span className="font-bold">COVID 19</span> epidemic, orders may be processed with a slight delay
      </div>

      {/* Info Bar */}
      <div className="border-b border-gray-100 hidden md:block bg-white">
        <div className="container mx-auto px-4 py-1.5 flex justify-end items-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center gap-2"><ShieldCheck size={14} /> <span>100% Secure delivery</span></div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1"><span>Need help? Call Us:</span> <span className="text-blue-600 font-bold">{config?.footer?.phone || "+ 880 1234 5678"}</span></div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="container mx-auto px-4 py-3 bg-white relative">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          
          <Link to="/" className="shrink-0">
            {config?.logo ? (
                <img src={config.logo} alt="Logo" className="h-10 md:h-16 object-contain" />
            ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">bacola</h1>
            )}
            <p className="text-[10px] text-gray-400 -mt-1 hidden md:block">Online Grocery Shopping Center</p>
          </Link>

          {/* === SEARCH BAR === */}
          <div className="flex-1 max-w-xl mx-2 md:mx-auto relative" ref={searchRef}>
            <div className="bg-gray-100 rounded-lg flex items-center px-3 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition">
                <input 
                    type="text" 
                    placeholder="Search for products..." 
                    className="bg-transparent flex-grow outline-none text-gray-700 placeholder-gray-400 text-xs md:text-sm w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => { if(search) setLiveResults(products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).slice(0,5)) }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
                <Search onClick={handleSearchSubmit} className="text-gray-500 cursor-pointer shrink-0 hover:text-blue-600" size={18} />
            </div>

            {/* LIVE SEARCH DROPDOWN */}
            {search && liveResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg border border-t-0 border-gray-100 z-[60] max-h-80 overflow-y-auto">
                    {liveResults.map((item) => (
                        <div 
                            key={item._id}
                            onClick={() => {
                                navigate(`/product/${item._id}`);
                                setLiveResults([]); 
                                setSearch(""); 
                            }} 
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                        >
                            <img src={item.image[0]} alt={item.name} className="w-10 h-10 object-contain" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                <span className="text-xs text-gray-400">{currency}{item.price}</span>
                            </div>
                        </div>
                    ))}
                    <div onClick={handleSearchSubmit} className="p-2 text-center text-xs font-bold text-blue-600 cursor-pointer hover:bg-blue-50">
                        View all results for "{search}"
                    </div>
                </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-5 shrink-0">
             {/* Account & Cart Icons */}
             {token ? (
                 <div className='group relative'>
                    <Link to="/my-profile">
                        <div className="rounded-full border border-gray-300 p-1.5 md:p-2 cursor-pointer hover:bg-blue-50 transition bg-blue-50 border-blue-200">
                            <User size={18} className="text-blue-600 md:w-5 md:h-5" />
                        </div>
                    </Link>
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                        <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-white text-gray-500 rounded shadow-lg border border-gray-100'>
                            <Link to="/my-profile" className='cursor-pointer hover:text-[#233a95] font-medium text-sm flex items-center gap-2'><User size={14}/> Profile</Link>
                            <hr className='border-gray-100 my-1'/>
                            <p onClick={logout} className='cursor-pointer hover:text-red-500 font-medium text-sm flex items-center gap-2'><LogOut size={14}/> Logout</p>
                        </div>
                    </div>
                 </div>
             ) : (
                 <Link to="/login">
                   <div className="rounded-full border border-gray-300 p-1.5 md:p-2 cursor-pointer hover:bg-blue-50 transition group">
                     <User size={18} className="text-gray-700 md:w-5 md:h-5" />
                   </div>
                 </Link>
             )}

            <div className="font-bold text-gray-900 hidden lg:block text-sm md:text-base">
                {currency}{getCartAmount()}
            </div>
            
            <Link to='/cart'>
                <div className="relative bg-orange-100 rounded-full p-2 md:p-2.5 cursor-pointer hover:bg-orange-200 transition">
                    <ShoppingBag size={18} className="text-red-500 md:w-5 md:h-5" />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                      {getCartCount()}
                    </span>
                </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-8 relative z-40">
            
            {/* --- UPDATED CATEGORIES DROPDOWN --- */}
            <div className="w-full lg:w-auto py-2 lg:py-0 group" ref={catMenuRef}>
                <button 
                  onClick={() => setShowCategories(!showCategories)} 
                  className="w-full lg:w-64 bg-[#2bbef9] hover:bg-[#209dd0] text-white px-5 py-3 rounded-full flex items-center justify-between font-bold transition shadow-sm text-xs md:text-sm uppercase tracking-wide"
                >
                  <div className="flex items-center gap-2">
                    <Menu size={18} /><span>All Categories</span>
                  </div>
                  {showCategories ? <X size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Dropdown Container */}
                <div className={`${showCategories ? 'block' : 'hidden'} md:group-hover:block absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-2xl rounded-xl py-3 mt-2 z-[100]`}>
                  <ul className="flex flex-col">
                      {categories.length > 0 ? categories.map((cat, index) => {
                      const IconComponent = getCategoryIcon(cat.name);
                      const hasSubCats = cat.subCategories && cat.subCategories.length > 0;
                      
                      return (
                          <li key={index} className="group/item relative">
                              
                              {/* Parent Category Link */}
                              <Link 
                                to={`/category/${createSlug(cat.name)}`} 
                                onClick={() => setShowCategories(false)}
                                className="flex items-center justify-between px-5 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
                              >
                                  <div className="flex items-center gap-3 text-gray-500 group-hover/item:text-[#2bbef9]">
                                      <IconComponent size={18} strokeWidth={1.5} />
                                      <span className="font-medium text-sm text-gray-700 group-hover/item:text-[#2bbef9] capitalize">{cat.name}</span>
                                  </div>
                                  {hasSubCats && <ChevronRight size={14} className="text-gray-300 group-hover/item:text-[#2bbef9]" />}
                              </Link>

                              {/* === SUB CATEGORY FLYOUT === */}
                              {hasSubCats && (
                                  <div className="hidden group-hover/item:block absolute left-[98%] top-0 w-56 bg-white border border-gray-100 shadow-xl rounded-lg z-[110] ml-1 p-3">
                                      <p className='px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-100 pb-2'>
                                        {cat.name}
                                      </p>
                                      <ul className="flex flex-col gap-0.5">
                                          {cat.subCategories.map((sub, subIdx) => (
                                              <li key={subIdx}>
                                                  <Link 
                                                    to={`/category/${createSlug(cat.name)}?sub=${encodeURIComponent(sub)}`} 
                                                    onClick={() => setShowCategories(false)}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-[#2bbef9] hover:bg-blue-50 rounded transition-colors"
                                                  >
                                                      <Circle size={4} fill="currentColor" />
                                                      {sub}
                                                  </Link>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}
                          </li>
                      )
                      }) : <li className="px-6 py-3 text-sm text-gray-400">Loading categories...</li>}
                  </ul>
                </div>
            </div>

            <nav className="flex items-center gap-4 md:gap-6 text-xs font-bold uppercase text-gray-600 w-full lg:w-auto tracking-wide overflow-x-auto whitespace-nowrap pb-2 lg:pb-0 hide-scrollbar pl-2 lg:pl-0">
                <Link to="/" className={`hover:text-blue-500 ${isActive('/') ? 'text-blue-600' : ''}`}>HOME</Link>
                <Link to="/collection" className={`hover:text-blue-500 ${isActive('/collection') ? 'text-blue-600' : ''}`}>SHOP</Link>
                <Link to="/order-tracking" className={`hover:text-blue-500 flex items-center gap-1 ${isActive('/order-tracking') ? 'text-blue-600' : ''}`}>TRACK ORDER</Link>
                <Link to="/contact" className={`hover:text-blue-500 ${isActive('/contact') ? 'text-blue-600' : ''}`}>CONTACT</Link>
            </nav>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Header;