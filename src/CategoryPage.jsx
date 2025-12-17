import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ShieldCheck, Search, User, ShoppingBag, Menu, ChevronDown, ChevronRight, 
  Grid, List,
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat
} from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams(); // Gets the current URL slug (e.g., 'meats-seafood')

  // --- 1. MASTER CATEGORY LIST ---
  const categories = [
    { id: 'fruits-vegetables', name: "Fruits & Vegetables", icon: Apple, link: "/category/fruits-vegetables" },
    { id: 'meats-seafood', name: "Meats & Seafood", icon: Beef, link: "/category/meats-seafood" },
    { id: 'breakfast-dairy', name: "Breakfast & Dairy", icon: Egg, link: "/category/breakfast-dairy" },
    { id: 'beverages', name: "Beverages", icon: Coffee, link: "/category/beverages" },
    { id: 'bakery', name: "Breads & Bakery", icon: Cookie, link: "/category/bakery" },
    { id: 'frozen', name: "Frozen Foods", icon: Snowflake, link: "/category/frozen" },
    { id: 'snacks', name: "Biscuits & Snacks", icon: Candy, link: "/category/snacks" },
    { id: 'grocery', name: "Grocery & Staples", icon: Wheat, link: "/category/grocery" },
  ];

  // --- 2. IDENTIFY ACTIVE PAGE ---
  const activeCategory = categories.find(cat => cat.link.includes(slug)) || categories[0];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-[#233a95] text-white text-center py-2 text-sm font-medium">
        Due to the <span className="font-bold">COVID 19</span> epidemic, orders may be processed with a slight delay
      </div>

      <div className="border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-2"><ShieldCheck size={16} /> <span>100% Secure delivery</span></div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1"><span>Need help? Call Us:</span><span className="text-blue-600 font-bold">+ 0020 500</span></div>
        </div>
      </div>

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
             <Link to="/login"><div className="rounded-full border border-gray-300 p-2 cursor-pointer hover:bg-blue-50"><User size={24} className="text-gray-700" /></div></Link>
            <div className="font-bold text-gray-900 hidden sm:block">$0.00</div>
            <div className="relative bg-orange-100 rounded-full p-3 cursor-pointer hover:bg-orange-200"><ShoppingBag size={20} className="text-red-500" /><span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">0</span></div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 relative z-50">
          
          {/* Dropdown Menu */}
          <div className="group relative w-full lg:w-auto">
            <button className="w-full lg:w-64 bg-[#2bbef9] hover:bg-[#209dd0] text-white px-6 py-4 rounded-full flex items-center justify-between font-bold transition shadow-sm">
              <div className="flex items-center gap-3"><Menu size={20} /><span>ALL CATEGORIES</span></div><ChevronDown size={16} />
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 w-full lg:w-64 bg-white border border-gray-200 shadow-xl rounded-xl pt-2 pb-2 mt-2 z-50">
              <ul className="flex flex-col">
                {categories.map((cat, index) => (
                  <Link key={index} to={cat.link}>
                    <li className="group/item flex items-center justify-between px-6 py-3 hover:text-[#2bbef9] cursor-pointer transition-colors">
                      <div className="flex items-center gap-4 text-gray-500 group-hover/item:text-[#2bbef9]">
                        <cat.icon size={20} strokeWidth={1.5} />
                        <span className="font-medium text-sm text-gray-700 group-hover/item:text-[#2bbef9]">{cat.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Breadcrumb - Dynamic Name */}
          <nav className="flex flex-wrap items-center gap-8 text-xs font-bold uppercase text-gray-600 w-full lg:w-auto tracking-wide">
             <Link to="/" className="flex items-center gap-1 hover:text-blue-500">HOME</Link>
             <span className="text-gray-300">/</span>
             <span className="text-black uppercase">{activeCategory.name}</span>
          </nav>
        </div>
      </div>


      {/* ================= PAGE CONTENT ================= */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 1. SIDEBAR */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="mb-8 border border-dashed border-gray-200 p-5 rounded-lg">
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-4 tracking-wide">Product Categories</h3>
              
              <ul className="space-y-1">
                {categories.map((cat) => {
                  const isActive = cat.id === activeCategory.id || (slug && cat.link.includes(slug));
                  
                  return (
                    <li key={cat.id}>
                      <Link to={cat.link}>
                        <div className={`flex items-center justify-between py-2.5 px-2 rounded-md cursor-pointer transition-colors ${isActive ? 'text-[#2bbef9] font-bold bg-blue-50' : 'text-gray-500 hover:text-[#2bbef9] hover:bg-gray-50'}`}>
                           <span className="text-sm">{cat.name}</span>
                           {isActive && <ChevronRight size={14} />}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="mb-8 p-5 border border-dashed border-gray-200 rounded-lg">
               <h3 className="font-bold text-sm uppercase text-gray-800 mb-4 tracking-wide">Filter By Price</h3>
               <div className="h-1 w-full bg-gray-200 rounded-full mb-4 relative">
                  <div className="absolute left-0 w-1/2 h-full bg-[#2bbef9] rounded-full"></div>
                  <div className="absolute left-1/2 w-3 h-3 bg-white border-2 border-[#2bbef9] rounded-full -top-1 shadow cursor-pointer"></div>
               </div>
               <div className="text-sm text-gray-500">Price: <span className="text-black font-bold">$0 - $100</span></div>
            </div>
          </div>

          {/* 2. RIGHT CONTENT */}
          <div className="w-full lg:w-3/4">
             {/* Dynamic Banner Title */}
             <div className="w-full h-48 bg-gray-100 rounded-xl mb-8 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop" alt="Category Banner" className="w-full h-full object-cover" />
                <div className="absolute top-1/2 left-10 -translate-y-1/2 max-w-lg">
                   <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{activeCategory.name}</h2>
                   <p className="text-gray-600 text-sm">Explore our fresh selection of <span className="text-green-600 font-bold">{activeCategory.name}</span></p>
                </div>
             </div>

             <div className="bg-[#f7f8fd] p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                <div className="flex items-center gap-3">
                   <button className="p-2 text-gray-400 hover:text-black transition"><List size={20} /></button>
                   <button className="p-2 text-black bg-white shadow-sm rounded"><Grid size={20} /></button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                   <div className="flex items-center gap-2 cursor-pointer hover:text-[#2bbef9]">
                     <span>Sort by latest</span> <ChevronDown size={14} />
                   </div>
                   <div className="flex items-center gap-2 cursor-pointer hover:text-[#2bbef9]">
                     <span>Show 12</span> <ChevronDown size={14} />
                   </div>
                </div>
             </div>

             <div className="min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                <ShoppingBag size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-600">No products found</h3>
                <p className="text-gray-400 text-sm">We are updating our {activeCategory.name} inventory.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;