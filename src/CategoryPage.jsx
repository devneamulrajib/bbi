import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { 
  ShoppingBag, Grid, List, ChevronRight, ShoppingCart, Star,
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat, FolderOpen
} from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams();
  const { products, categories, currency, addToCart } = useContext(ShopContext);
  
  const [displayProducts, setDisplayProducts] = useState([]);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  // --- HELPER: Normalize Strings (e.g. "Fruits & Vegetables" -> "fruits-vegetables") ---
  const createSlug = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/&/g, '').replace(/[^\w\s]/gi, '').trim().replace(/\s+/g, '-');
  };

  // --- HELPER: Get Icon based on name ---
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

  // --- FILTER LOGIC ---
  useEffect(() => {
    if (products.length > 0 || categories.length > 0) {
      
      // 1. Find the "Human Readable" name from the DB Categories list based on URL slug
      const foundCategory = categories.find(cat => createSlug(cat.name) === slug);
      const readableName = foundCategory ? foundCategory.name : slug.replace(/-/g, ' ');
      setActiveCategoryName(readableName);

      // 2. Filter Products
      const filtered = products.filter((item) => {
         const itemSlug = createSlug(item.category);
         return itemSlug === slug || item.category.toLowerCase() === slug.toLowerCase();
      });

      setDisplayProducts(filtered);
    }
  }, [slug, products, categories]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      
      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            {/* Sidebar Category List (Dynamic from DB) */}
            <div className="mb-8 border border-dashed border-gray-200 p-5 rounded-lg">
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-4 tracking-wide">Product Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat, index) => {
                  const catSlug = createSlug(cat.name);
                  const isActive = catSlug === slug;
                  const IconComponent = getCategoryIcon(cat.name);

                  return (
                    <li key={index}>
                      <Link to={`/category/${catSlug}`}>
                        <div className={`flex items-center justify-between py-2.5 px-2 rounded-md cursor-pointer transition-colors ${isActive ? 'text-[#2bbef9] font-bold bg-blue-50' : 'text-gray-500 hover:text-[#2bbef9] hover:bg-gray-50'}`}>
                           <div className="flex items-center gap-2">
                              <IconComponent size={16} />
                              <span className="text-sm capitalize">{cat.name}</span>
                           </div>
                           {isActive && <ChevronRight size={14} />}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter (Static Visual Only) */}
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
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent"></div>
                <div className="absolute top-1/2 left-10 -translate-y-1/2 max-w-lg">
                   <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 capitalize">{activeCategoryName}</h2>
                   <p className="text-gray-600 text-sm">Explore our fresh selection of <span className="text-green-600 font-bold capitalize">{activeCategoryName}</span></p>
                </div>
             </div>

             {/* Sorting Toolbar */}
             <div className="bg-[#f7f8fd] p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                <div className="flex items-center gap-3">
                   <button className="p-2 text-gray-400 hover:text-black transition"><List size={20} /></button>
                   <button className="p-2 text-black bg-white shadow-sm rounded"><Grid size={20} /></button>
                </div>
                <p className="text-sm text-gray-500">
                    Showing <span className="font-bold text-black">{displayProducts.length}</span> results
                </p>
             </div>

             {/* Products Grid */}
             {displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayProducts.map((item, index) => (
                    <div key={index} className="group bg-white border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
                       
                       {/* Discount Badge Mockup */}
                       <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">HOT</span>

                       {/* Image */}
                       <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-gray-50">
                          <Link to={`/product/${item._id}`}>
                             <img src={item.image[0]} alt={item.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                          </Link>
                       </div>

                       {/* Content */}
                       <div>
                           <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{item.subCategory}</p>
                           <Link to={`/product/${item._id}`}>
                               <h3 className="font-bold text-gray-700 text-sm mb-2 line-clamp-2 hover:text-[#2bbef9] transition-colors h-10">
                                   {item.name}
                               </h3>
                           </Link>
                           
                           {/* Rating Mockup */}
                           <div className="flex items-center gap-1 mb-2">
                               {[...Array(5)].map((_, i) => (
                                   <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                               ))}
                           </div>

                           {/* Price & Cart */}
                           <div className="flex items-center justify-between mt-3">
                               <p className="text-lg font-bold text-[#D51243]">{currency}{item.price}</p>
                               <button 
                                   onClick={() => addToCart(item._id, item.sizes[0] || 'M')} 
                                   className="h-10 w-10 rounded-full bg-blue-50 text-[#233a95] flex items-center justify-center hover:bg-[#233a95] hover:text-white transition-colors shadow-sm"
                               >
                                   <ShoppingCart size={18} />
                               </button>
                           </div>
                       </div>
                    </div>
                  ))}
                </div>
             ) : (
                 /* Empty State */
                 <div className="min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                    <ShoppingBag size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-600">No products found</h3>
                    <p className="text-gray-400 text-sm">We are updating our {activeCategoryName} inventory.</p>
                 </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;