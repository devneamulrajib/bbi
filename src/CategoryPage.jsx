import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ShoppingBag, Grid, List, ChevronRight,
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat
} from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams();

  // IMPORTANT: These links MUST match the links in Header.jsx exactly
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

  // Logic: Find the category that matches the current URL slug
  // Example: URL is /category/meats-seafood -> finds the object with link including 'meats-seafood'
  const activeCategory = categories.find(cat => cat.link.includes(slug)) || categories[0];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      
      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            {/* Sidebar Category List */}
            <div className="mb-8 border border-dashed border-gray-200 p-5 rounded-lg">
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-4 tracking-wide">Product Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat) => {
                  // Check if this sidebar item is the currently active one
                  const isActive = cat.id === activeCategory.id;
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

          {/* Right Main Content */}
          <div className="w-full lg:w-3/4">
             
             {/* Banner Title */}
             <div className="w-full h-48 bg-gray-100 rounded-xl mb-8 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop" alt="Category Banner" className="w-full h-full object-cover" />
                <div className="absolute top-1/2 left-10 -translate-y-1/2 max-w-lg">
                   <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{activeCategory.name}</h2>
                   <p className="text-gray-600 text-sm">Explore our fresh selection of <span className="text-green-600 font-bold">{activeCategory.name}</span></p>
                </div>
             </div>

             {/* Sorting Toolbar */}
             <div className="bg-[#f7f8fd] p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                <div className="flex items-center gap-3">
                   <button className="p-2 text-gray-400 hover:text-black transition"><List size={20} /></button>
                   <button className="p-2 text-black bg-white shadow-sm rounded"><Grid size={20} /></button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                   <div className="flex items-center gap-2 cursor-pointer hover:text-[#2bbef9]">
                     <span>Sort by latest</span>
                   </div>
                   <div className="flex items-center gap-2 cursor-pointer hover:text-[#2bbef9]">
                     <span>Show 12</span>
                   </div>
                </div>
             </div>

             {/* Products Placeholder */}
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