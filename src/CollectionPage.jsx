import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShopContext } from './context/ShopContext'; // <--- Path adjusted for src/ root
import { ShoppingCart, SearchX } from 'lucide-react';

const CollectionPage = () => {
    // 1. Get Search states from Context
    const { products, addToCart, currency, search, showSearch } = useContext(ShopContext);
    
    const [displayProducts, setDisplayProducts] = useState([]);
    const location = useLocation();
    const type = new URLSearchParams(location.search).get('type'); // ?type=bestseller

    // 2. Filter Logic (Search vs Category)
    useEffect(() => {
        if(products.length > 0) {
            let filtered = products.slice();

            // --- PRIORITY: SEARCH ---
            // If the user triggered a search, we ignore 'type' and filter by name
            if (showSearch && search) {
                filtered = filtered.filter(item => 
                    item.name.toLowerCase().includes(search.toLowerCase())
                );
            } 
            // --- SECONDARY: URL FILTERS ---
            // Only apply these if NOT searching
            else {
                if(type === 'bestseller') filtered = filtered.filter(p => p.bestseller);
                else if(type === 'new') filtered = filtered.filter(p => p.newArrival);
                else if(type === 'trending') filtered = filtered.filter(p => p.trending);
            }

            setDisplayProducts(filtered);
        }
    }, [products, type, search, showSearch]); 

    // 3. Dynamic Title
    let title = 'All Products';
    if (showSearch && search) title = `Search Results for "${search}"`;
    else if (type === 'bestseller') title = 'Best Sellers';
    else if (type === 'new') title = 'New Arrivals';
    else if (type === 'trending') title = 'Trending Products';

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            
            {/* Page Header */}
            <h2 className="text-3xl font-bold text-[#233a95] mb-6 capitalize">{title}</h2>

            {/* Product Grid */}
            {displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {displayProducts.map((item, index) => (
                        <div key={index} className="border p-4 rounded-xl group hover:shadow-lg transition bg-white flex flex-col">
                             <Link to={`/product/${item._id}`} className="flex-1">
                                <div className="h-40 flex justify-center overflow-hidden mb-4 relative">
                                    <img src={item.image[0]} className="h-full object-contain group-hover:scale-110 transition duration-300" alt={item.name} />
                                </div>
                                <h3 className="font-bold text-gray-700 text-sm md:text-base line-clamp-2 min-h-[40px]">{item.name}</h3>
                             </Link>
                             
                             <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                 <div className="flex flex-col">
                                    {item.originalPrice > item.price && (
                                        <span className="text-xs text-gray-400 line-through">{currency}{item.originalPrice}</span>
                                    )}
                                    <span className="text-red-500 font-bold">{currency}{item.price}</span>
                                 </div>
                                 
                                 <button 
                                    onClick={() => addToCart(item._id, item.sizes?.[0] || 'Default')} 
                                    className="h-9 w-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-[#233a95] hover:text-white transition shadow-sm"
                                    title="Add to Cart"
                                 >
                                    <ShoppingCart size={18} />
                                 </button>
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* --- NO ITEMS FOUND STATE --- */
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <SearchX size={64} className="mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-600">No items found</h3>
                    <p className="text-gray-500 mt-2 text-center max-w-md">
                        We couldn't find any products matching <strong>"{search}"</strong>. <br/>
                        Try checking for typos or using different keywords.
                    </p>
                    <Link 
                        to="/" 
                        className="mt-6 px-6 py-2 bg-[#233a95] text-white rounded-full text-sm font-bold hover:bg-blue-800 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    )
}

export default CollectionPage;