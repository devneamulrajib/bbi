import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from './context/ShopContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Home } from 'lucide-react';

const BestSellerPage = () => {
  const { products, currency, addToCart } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    // Filter all products that are marked as 'bestseller'
    const data = products.filter((item) => (item.bestseller));
    setBestSellers(data);
  }, [products]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="flex items-center gap-1 hover:text-[#2bbef9]">
          <Home size={16} /> Home
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">Best Sellers</span>
      </div>

      <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#233a95]">Best Selling Products</h2>
          <p className="text-gray-500 mt-2">Top rated products chosen by our customers</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {bestSellers.map((item, index) => (
          <div key={index} className="group bg-white border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
              
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <span className="bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-1 rounded">HOT</span>
              </div>

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
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">(5)</span>
                  </div>

                  {/* Price & Cart */}
                  <div className="flex items-center justify-between mt-3">
                      <p className="text-lg font-bold text-[#D51243]">{currency}{item.price}</p>
                      <button 
                          onClick={() => addToCart(item._id, item.sizes[0] || 'M')} 
                          className="h-10 w-10 rounded-full bg-blue-50 text-[#233a95] flex items-center justify-center hover:bg-[#2bbef9] hover:text-white transition-colors shadow-sm"
                      >
                          <ShoppingCart size={18} />
                      </button>
                  </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellerPage;