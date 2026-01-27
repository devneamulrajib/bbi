import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { 
  ShoppingBag, Grid, List, ChevronRight, ChevronDown, 
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat, FolderOpen, Filter, Circle, Star, Minus, Plus
} from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams();
  const location = useLocation(); // Hook to get URL params
  const navigate = useNavigate(); // Hook to update URL
  const { products, categories, currency, addToCart, cartItems, updateQuantity } = useContext(ShopContext);
  
  const [displayProducts, setDisplayProducts] = useState([]);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [availableSubCats, setAvailableSubCats] = useState([]);
  const [activeSubCat, setActiveSubCat] = useState("All");
  const [viewMode, setViewMode] = useState('grid'); 

  // --- HELPER: Normalize Strings ---
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

  // --- EFFECT: Handle URL Params (The Fix) ---
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subParam = searchParams.get('sub');
    if (subParam) {
      setActiveSubCat(decodeURIComponent(subParam));
    } else {
      setActiveSubCat("All");
    }
  }, [location.search, slug]);


  // --- MAIN FILTER LOGIC ---
  useEffect(() => {
    if (products.length > 0 || categories.length > 0) {
      const foundCategory = categories.find(cat => createSlug(cat.name) === slug);
      
      if (foundCategory) {
          setActiveCategoryName(foundCategory.name);
          if(foundCategory.subCategories && foundCategory.subCategories.length > 0) {
            setAvailableSubCats(["All", ...foundCategory.subCategories]);
          } else {
            setAvailableSubCats([]);
          }
      } else {
          setActiveCategoryName(slug.replace(/-/g, ' '));
          setAvailableSubCats([]);
      }

      let filtered = products.filter((item) => {
         const itemSlug = createSlug(item.category);
         return itemSlug === slug || item.category.toLowerCase() === slug.toLowerCase();
      });

      if (activeSubCat !== "All") {
        filtered = filtered.filter(item => 
            item.subCategory === activeSubCat || 
            item.subCategory?.toLowerCase() === activeSubCat.toLowerCase()
        );
      }
      setDisplayProducts(filtered);
    }
  }, [slug, products, categories, activeSubCat]);

  // --- HANDLER: Update URL when clicking on-page filters ---
  const handleSubCatClick = (sub) => {
    setActiveSubCat(sub);
    // Update URL to match selection
    if (sub === 'All') {
        navigate(`/category/${slug}`);
    } else {
        navigate(`/category/${slug}?sub=${encodeURIComponent(sub)}`);
    }
  };

  const getItemCount = (itemId, size) => {
      if (cartItems && cartItems[itemId] && cartItems[itemId][size]) {
          return cartItems[itemId][size];
      }
      return 0;
  };

  const handleQuantityChange = (itemId, size, currentQty, type) => {
      if (type === 'inc') {
          addToCart(itemId, size);
      } else if (type === 'dec') {
          updateQuantity(itemId, size, currentQty - 1);
      }
  };

  const getReviewCount = (item) => {
    if (Array.isArray(item.reviews)) return item.reviews.length;
    if (typeof item.reviews === 'number') return item.reviews;
    return 0;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* --- LEFT SIDEBAR --- */}
          <div className="w-full lg:w-1/4 flex-shrink-0 hidden lg:block">
            <div className="mb-8 border border-dashed border-gray-200 p-5 rounded-lg sticky top-24">
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-4 tracking-wide">Product Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat, index) => {
                  const catSlug = createSlug(cat.name);
                  const isActive = catSlug === slug;
                  const IconComponent = getCategoryIcon(cat.name);
                  const hasSubCats = cat.subCategories && cat.subCategories.length > 0;

                  return (
                    <li key={index} className="group">
                      <Link to={`/category/${catSlug}`}>
                        <div className={`flex items-center justify-between py-2.5 px-2 rounded-md cursor-pointer transition-colors ${isActive ? 'text-[#2bbef9] font-bold bg-blue-50' : 'text-gray-500 hover:text-[#2bbef9] hover:bg-gray-50'}`}>
                           <div className="flex items-center gap-2">
                              <IconComponent size={16} />
                              <span className="text-sm capitalize">{cat.name}</span>
                           </div>
                           {isActive ? <ChevronDown size={14}/> : <ChevronRight size={14} />}
                        </div>
                      </Link>
                      {isActive && hasSubCats && (
                        <ul className="pl-8 mt-1 space-y-1 animate-fadeIn">
                          {cat.subCategories.map((sub, subIdx) => (
                            <li 
                              key={subIdx} 
                              onClick={() => handleSubCatClick(sub)} // Updated handler
                              className={`text-sm cursor-pointer hover:text-[#2bbef9] flex items-center gap-2 py-1 ${activeSubCat === sub ? 'text-[#2bbef9] font-medium' : 'text-gray-400'}`}
                            >
                              <Circle size={6} fill={activeSubCat === sub ? "currentColor" : "none"} />
                              {sub}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* --- RIGHT CONTENT --- */}
          <div className="w-full lg:w-3/4">
             
             {/* Banner */}
             <div className="w-full py-4 md:h-40 bg-gray-50 rounded-lg md:rounded-xl mb-4 md:mb-6 overflow-hidden relative flex items-center px-4 md:px-8 border border-gray-100">
                <div className="z-10">
                   <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-0.5 md:mb-1 capitalize leading-tight">
                     {activeCategoryName}
                   </h2>
                   <p className="text-gray-500 text-xs md:text-sm">
                     Shop the best <span className="font-bold">{activeCategoryName}</span> products.
                   </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 md:w-1/2 bg-gradient-to-l from-blue-50 to-transparent opacity-60"></div>
             </div>

             {/* Filter Bar */}
             {availableSubCats.length > 0 && (
                <div className="mb-4 md:mb-6 overflow-x-auto pb-1 scrollbar-hide">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className='flex items-center gap-1.5 text-xs md:text-sm font-bold text-gray-500 mr-1 md:mr-2 shrink-0'>
                            <Filter size={14} className="md:w-4 md:h-4"/> Filter:
                        </div>
                        {availableSubCats.map((sub, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleSubCatClick(sub)} // Updated handler
                                className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap border transition-all 
                                ${activeSubCat === sub 
                                    ? 'bg-[#233a95] text-white border-[#233a95]' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#233a95] hover:text-[#233a95]'}`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
             )}

             {/* Sorting Toolbar */}
             <div className="bg-[#f7f8fd] p-3 md:p-4 rounded-lg mb-4 md:mb-6 flex flex-row justify-between items-center border border-gray-100">
                <div className="flex items-center gap-2 md:gap-3">
                   <button onClick={() => setViewMode('list')} className={`p-1.5 md:p-2 transition rounded ${viewMode === 'list' ? 'text-black bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                     <List size={18} className="md:w-5 md:h-5" />
                   </button>
                   <button onClick={() => setViewMode('grid')} className={`p-1.5 md:p-2 transition rounded ${viewMode === 'grid' ? 'text-black bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                     <Grid size={18} className="md:w-5 md:h-5" />
                   </button>
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                    Showing <span className="font-bold text-black">{displayProducts.length}</span> results
                </p>
             </div>

             {/* --- PRODUCTS GRID --- */}
             {displayProducts.length > 0 ? (
                <div className={viewMode === 'grid' 
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6" 
                    : "flex flex-col gap-4"}>
                  
                  {displayProducts.map((item, index) => {
                    const itemSize = item.sizes[0] || 'M';
                    const qty = getItemCount(item._id, itemSize);

                    return (
                      <div 
                          key={index} 
                          className={`group bg-white border border-gray-100 rounded-xl p-3 md:p-4 transition-all duration-300 hover:shadow-lg relative overflow-hidden flex 
                          ${viewMode === 'list' ? 'flex-row gap-6 items-center' : 'flex-col justify-between hover:-translate-y-1'}`}
                      >
                         
                         {/* Image */}
                         <div className={`${viewMode === 'list' ? 'w-32 h-32' : 'h-36 md:h-44 w-full mb-3'} flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 relative shrink-0`}>
                            <Link to={`/product/${item._id}`} className="w-full h-full flex items-center justify-center">
                               <img src={item.image[0]} alt={item.name} className="h-full w-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                            </Link>
                         </div>

                         {/* Content */}
                         <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 py-2' : 'w-full'}`}>
                             
                             <h3 className={`font-bold text-gray-800 text-sm md:text-[15px] mb-1 hover:text-[#2bbef9] transition-colors leading-snug ${viewMode === 'grid' && 'line-clamp-2 h-10'}`}>
                                 {item.name}
                             </h3>

                             {/* --- STOCK & RATING --- */}
                             <div className="flex flex-col gap-1 mb-2">
                                <span className="text-[10px] md:text-[11px] font-bold text-green-500 uppercase tracking-wide">IN STOCK</span>
                                
                                {item.rating && item.rating > 0 ? (
                                    <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className={i < Math.round(item.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                                    ))}
                                    <span className="text-xs text-gray-400 ml-1">({getReviewCount(item)})</span>
                                    </div>
                                ) : (
                                    <div className="h-3"></div> 
                                )}
                             </div>

                             <div className={`mt-auto ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                                 <div className="flex items-center gap-2 mb-3">
                                     <span className="text-base md:text-lg font-bold text-[#D51243]">{currency}{item.price}</span>
                                 </div>

                                 {/* --- ACTION BUTTONS --- */}
                                 {qty === 0 ? (
                                    <button 
                                        onClick={() => addToCart(item._id, itemSize)}
                                        className="w-full py-1.5 md:py-2 rounded-full border border-blue-100 text-[#2bbef9] font-bold text-xs md:text-sm uppercase hover:bg-[#2bbef9] hover:text-white transition-all shadow-sm"
                                    >
                                        Add to Cart
                                    </button>
                                 ) : (
                                    <div className="w-full flex items-center justify-between bg-[#233a95] text-white rounded-full py-1.5 md:py-2 px-1 shadow-md">
                                        <button 
                                            onClick={() => handleQuantityChange(item._id, itemSize, qty, 'dec')}
                                            className="w-8 h-full flex items-center justify-center hover:bg-white/20 rounded-full transition"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-xs md:text-sm font-bold">{qty} in Cart</span>
                                        <button 
                                            onClick={() => handleQuantityChange(item._id, itemSize, qty, 'inc')}
                                            className="w-8 h-full flex items-center justify-center hover:bg-white/20 rounded-full transition"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                 )}
                             </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
             ) : (
                 <div className="min-h-[250px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 py-8">
                    <ShoppingBag size={40} className="text-gray-300 mb-3" />
                    <h3 className="text-base md:text-lg font-bold text-gray-600">No products found</h3>
                    <p className="text-gray-400 text-xs md:text-sm text-center px-4">
                        {activeSubCat !== "All" 
                            ? `No items found in ${activeSubCat}` 
                            : `We are updating our ${activeCategoryName} inventory.`}
                    </p>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;