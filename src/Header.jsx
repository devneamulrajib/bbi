import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Search, User, ShoppingBag, Menu, ChevronDown, ChevronRight, 
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat, Flame
} from 'lucide-react';

const Header = () => {
  const location = useLocation();

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  // Dropdown Data
  const categories = [
    { name: "Fruits & Vegetables", icon: Apple, link: "/category/fruits-vegetables" },
    { name: "Meats & Seafood", icon: Beef, link: "/category/meats-seafood" },
    { name: "Breakfast & Dairy", icon: Egg, link: "/category/breakfast-dairy" },
    { name: "Beverages", icon: Coffee, link: "/category/beverages" },
    { name: "Breads & Bakery", icon: Cookie, link: "/category/bakery" },
    { name: "Frozen Foods", icon: Snowflake, link: "/category/frozen" },
    { name: "Biscuits & Snacks", icon: Candy, link: "/category/snacks" },
    { name: "Grocery & Staples", icon: Wheat, link: "/category/grocery" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#233a95] text-white text-center py-2 text-sm font-medium">
        Due to the <span className="font-bold">COVID 19</span> epidemic, orders may be processed with a slight delay
      </div>

      {/* Info Bar */}
      <div className="border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} /> <span>100% Secure delivery without contacting the courier</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <span>Need help? Call Us:</span> <span className="text-blue-600 font-bold">+ 0020 500</span>
          </div>
        </div>
      </div>

      {/* Logo & Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-center md:text-left min-w-max">
            <h1 className="text-4xl font-bold text-black tracking-tight">bacola</h1>
            <p className="text-xs text-gray-400 mt-1">Online Grocery Shopping Center</p>
          </Link>

          <div className="w-full md:max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center px-4 py-3 border border-gray-200">
            <input type="text" placeholder="Search for products..." className="bg-transparent flex-grow outline-none text-gray-600 placeholder-gray-400"/>
            <Search className="text-gray-500 cursor-pointer" size={20} />
          </div>

          <div className="flex items-center gap-5 min-w-max">
             <Link to="/login">
               <div className="rounded-full border border-gray-300 p-2 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition group">
                 <User size={24} className="text-gray-700 group-hover:text-blue-600" />
               </div>
             </Link>
            <div className="font-bold text-gray-900 hidden sm:block">$0.00</div>
            <div className="relative bg-orange-100 rounded-full p-3 cursor-pointer hover:bg-orange-200">
              <ShoppingBag size={20} className="text-red-500" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-50">
          
          {/* Dropdown Button */}
          <div className="group relative w-full lg:w-auto">
            <button className="w-full lg:w-64 bg-[#2bbef9] hover:bg-[#209dd0] text-white px-6 py-4 rounded-full flex items-center justify-between font-bold transition shadow-sm">
              <div className="flex items-center gap-3"><Menu size={20} /><span>ALL CATEGORIES</span></div><ChevronDown size={16} />
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 w-full lg:w-64 bg-white border border-gray-200 shadow-xl rounded-xl pt-2 pb-2 mt-2">
              <ul className="flex flex-col">
                {categories.map((cat, index) => (
                  <Link key={index} to={cat.link}>
                    <li className="group/item flex items-center justify-between px-6 py-3 hover:text-[#2bbef9] cursor-pointer transition-colors">
                      <div className="flex items-center gap-4 text-gray-500 group-hover/item:text-[#2bbef9]"><cat.icon size={20} strokeWidth={1.5} /><span className="font-medium text-sm text-gray-700 group-hover/item:text-[#2bbef9]">{cat.name}</span></div><ChevronRight size={16} className="text-gray-400" />
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center gap-5 text-xs font-bold uppercase text-gray-600 w-full lg:w-auto tracking-wide">
            
            <Link to="/" className={`px-2 py-1 ${isActive('/') ? 'text-blue-600 font-bold' : 'hover:text-blue-500'}`}>HOME</Link>
            
            {/* POPULAR BADGE */}
            <div className="flex items-center gap-2 text-black cursor-default">
               <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1 animate-pulse shadow-sm tracking-wide">
                  <Flame size={10} fill="currentColor" /> POPULAR CATEGORIES
               </span>
               <ChevronRight size={12} className="text-gray-300" />
            </div>

            <Link to="/category/meats-seafood" className={`flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 ${isActive('/category/meats-seafood') ? 'border-blue-500 text-blue-600 font-bold bg-blue-50' : 'hover:border-[#2bbef9] hover:text-[#2bbef9] bg-white transition-all'}`}><Beef size={16} className="text-gray-400 group-hover:text-[#2bbef9]" /> <span>MEATS</span></Link>
            <Link to="/category/bakery" className={`flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 ${isActive('/category/bakery') ? 'border-blue-500 text-blue-600 font-bold bg-blue-50' : 'hover:border-[#2bbef9] hover:text-[#2bbef9] bg-white transition-all'}`}><Cookie size={16} className="text-gray-400 group-hover:text-[#2bbef9]" /> <span>BAKERY</span></Link>
            <Link to="/category/beverages" className={`flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 ${isActive('/category/beverages') ? 'border-blue-500 text-blue-600 font-bold bg-blue-50' : 'hover:border-[#2bbef9] hover:text-[#2bbef9] bg-white transition-all'}`}><Coffee size={16} className="text-gray-400 group-hover:text-[#2bbef9]" /> <span>DRINKS</span></Link>

            <Link to="/blog" className={`hover:text-blue-500 ml-2 ${isActive('/blog') ? 'text-blue-600 font-bold' : ''}`}>BLOG</Link>
            <Link to="/contact" className={`hover:text-blue-500 ${isActive('/contact') ? 'text-blue-600 font-bold' : ''}`}>CONTACT</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;