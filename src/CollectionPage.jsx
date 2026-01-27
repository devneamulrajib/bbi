import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShopContext } from './context/ShopContext'; 
import { SearchX, Star, Minus, Plus, ShoppingCart } from 'lucide-react';

const CollectionPage = () => {
    // 1. Get Search states, Products, and Cart Functions from Context
    const { 
        products, search, showSearch, 
        cartItems, addToCart, updateQuantity, currency 
    } = useContext(ShopContext);
    
    const [displayProducts, setDisplayProducts] = useState([]);
    const location = useLocation();
    const type = new URLSearchParams(location.search).get('type'); 

    // --- HELPER: Get Quantity in Cart ---
    const getItemCount = (itemId, size) => {
        if (cartItems && cartItems[itemId] && cartItems[itemId][size]) {
            return cartItems[itemId][size];
        }
        return 0;
    };

    // --- HELPER: Handle Plus/Minus Logic ---
    const handleQuantityChange = (itemId, size, currentQty, type) => {
        if (type === 'inc') {
            addToCart(itemId, size);
        } else if (type === 'dec') {
            updateQuantity(itemId, size, currentQty - 1);
        }
    };

    // --- HELPER: Safe Review Count ---
    const getReviewCount = (item) => {
        if (Array.isArray(item.reviews)) return item.reviews.length;
        if (typeof item.reviews === 'number') return item.reviews;
        return 0;
    };

    // 2. Filter Logic (Search vs Category/Type)
    useEffect(() => {
        if (products.length > 0) {
            let filtered = products.slice();

            // --- PRIORITY: SEARCH ---
            if (showSearch && search) {
                filtered = filtered.filter(item => 
                    item.name.toLowerCase().includes(search.toLowerCase())
                );
            } 
            // --- SECONDARY: URL FILTERS ---
            else {
                if (type === 'bestseller') filtered = filtered.filter(p => p.bestseller);
                else if (type === 'new') filtered = filtered.filter(p => p.newArrival);
                else if (type === 'trending') filtered = filtered.filter(p => p.trending);
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
        <div className="container mx-auto px-4 py-8 min-h-[60vh] border-t font-sans">
            
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#233a95] capitalize">{title}</h2>
                <p className="text-gray-500 text-sm">Showing {displayProducts.length} results</p>
            </div>

            {/* Product Grid */}
            {displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {displayProducts.map((item, index) => {
                        const itemSize = item.sizes?.[0] || 'M';
                        const qty = getItemCount(item._id, itemSize);

                        return (
                            <div key={index} className="group bg-white border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-lg relative overflow-hidden flex flex-col justify-between">
                                
                                {/* Image Area */}
                                <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-gray-50 relative">
                                    <Link to={`/product/${item._id}`} className="w-full h-full flex items-center justify-center">
                                        <img src={item.image[0]} alt={item.name} className="h-full w-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                                    </Link>
                                </div>

                                {/* Content Area */}
                                <div className="flex flex-col w-full">
                                    <h3 className="font-bold text-gray-700 text-sm mb-1 hover:text-[#2bbef9] transition-colors leading-snug line-clamp-2 h-10">
                                        {item.name}
                                    </h3>

                                    {/* Stock & Rating */}
                                    <div className="flex flex-col gap-1 mb-2">
                                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">IN STOCK</span>
                                        
                                        {/* Review Logic: Hide stars if no rating */}
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

                                    {/* Price & Buttons */}
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-lg font-bold text-[#D51243]">{currency}{item.price}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        {qty === 0 ? (
                                            <button 
                                                onClick={() => addToCart(item._id, itemSize)}
                                                className="w-full py-2 rounded-full border border-blue-100 text-[#233a95] font-bold text-xs uppercase hover:bg-[#233a95] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                            >
                                                Add to Cart <ShoppingCart size={14}/>
                                            </button>
                                        ) : (
                                            <div className="w-full flex items-center justify-between bg-[#233a95] text-white rounded-full py-2 px-1 shadow-md">
                                                <button 
                                                    onClick={() => handleQuantityChange(item._id, itemSize, qty, 'dec')}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-white/20 rounded-full transition"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-bold">{qty} in Cart</span>
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
                /* --- NO ITEMS FOUND STATE --- */
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <SearchX size={64} className="mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-600">No items found</h3>
                    <p className="text-gray-500 mt-2 text-center max-w-md">
                        We couldn't find any products matching <strong>"{search || type}"</strong>. <br/>
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
    );
};

export default CollectionPage;