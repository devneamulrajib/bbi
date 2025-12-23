import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from './context/ShopContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Eye } from 'lucide-react';

// === IMPORT LOCAL BANNER IMAGES ===
import banner1 from './assets/banner1.jpg'; 
import banner2 from './assets/banner2.jpg';
import banner3 from './assets/banner3.jpg';

const Home = () => {
  const { products, currency, addToCart, featurePoster } = useContext(ShopContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter Bestsellers (Increased limit to 10 since boxes are smaller)
  const bestSellers = products.filter(item => item.bestseller).slice(0, 10);

  const slides = [
    { id: 1, image: banner1, subtitle: "EXCLUSIVE OFFER -20% OFF", title: "Specialist in the grocery store", price: "$7.99", buttonText: "Shop Now" },
    { id: 2, image: banner2, subtitle: "FRESH & ORGANIC", title: "Vegetables & Fruits", price: "$5.99", buttonText: "Order Now" },
    { id: 3, image: banner3, subtitle: "BAKERY PRODUCTS", title: "Freshly Baked Every Morning", price: "$2.49", buttonText: "Taste It" }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700 pb-20">
      
      {/* ================= HERO SLIDER ================= */}
      <div className="container mx-auto px-4 mt-6 mb-12">
        <div className="relative w-full h-[350px] md:h-[450px] bg-gray-100 rounded-3xl overflow-hidden shadow-sm group z-0">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gray-100/10"></div>
            </div>
             <div className="absolute inset-0 flex items-center pl-8 md:pl-20">
                <div className="max-w-xl animate-fade-in-up">
                    <p className="text-[#2bbef9] md:text-green-600 font-bold tracking-wider text-sm md:text-base uppercase mb-2 bg-white/90 md:bg-transparent inline-block px-2 md:px-0 rounded-sm">{slides[currentSlide].subtitle}</p>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white md:text-[#233a95] drop-shadow-md md:drop-shadow-none">{slides[currentSlide].title}</h2>
                    <p className="text-gray-200 md:text-gray-500 mb-6 text-lg">Only this week. Don’t miss...</p>
                    <div className="flex items-end gap-2 mb-8">
                          <span className="text-gray-200 md:text-gray-500 font-medium pb-1">from</span>
                          <span className="text-white md:text-red-500 font-bold text-4xl">{slides[currentSlide].price}</span>
                    </div>
                    <button className="bg-[#2bbef9] hover:bg-[#209dd0] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg">{slides[currentSlide].buttonText} <ArrowRight size={18} /></button>
                </div>
            </div>
        </div>
      </div>

      {/* ================= BEST SELLERS SECTION ================= */}
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 1. LEFT SIDE BANNER */}
            <div className="w-full lg:w-[20%] hidden lg:block">
                {featurePoster && featurePoster.image ? (
                    <Link to={featurePoster.redirectUrl || '#'}>
                        <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full max-h-[700px]">
                            <img src={featurePoster.image} alt="Special Offer" className="w-full h-full object-cover" />
                        </div>
                    </Link>
                ) : (
                    <div className="rounded-xl bg-yellow-100 h-full min-h-[400px] flex items-center justify-center text-gray-400 border-2 border-dashed border-yellow-200">
                        <p>No Banner Set</p>
                    </div>
                )}
            </div>

            {/* 2. RIGHT SIDE PRODUCTS GRID (Redesigned for Smaller Size) */}
            <div className="w-full lg:w-[80%]">
                
                {/* Header with Working Link */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">BACOLA NATURAL FOODS</h3>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#233a95] uppercase">Best Sellers</h2>
                        <p className="text-gray-500 text-sm mt-1">Do not miss the current offers until the end of March.</p>
                    </div>
                    
                    {/* WORKING VIEW ALL BUTTON */}
                    <Link to="/bestsellers" className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2 border rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Grid - Increased columns to make items smaller (lg:grid-cols-4, xl:grid-cols-5) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-l border-gray-200">
                    {bestSellers.map((item, index) => (
                        <div key={index} className="group bg-white border-r border-b border-gray-200 p-3 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full relative z-0 hover:z-10">
                            
                            {/* Smaller Badges */}
                            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                <span className="bg-[#2bbef9] text-white text-[9px] font-bold px-1.5 py-[1px] rounded-sm w-max">19%</span>
                                <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-[1px] rounded-full uppercase tracking-wide w-max">ORGANIC</span>
                            </div>

                            {/* Actions */}
                            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-1.5 bg-white rounded-full shadow hover:bg-[#2bbef9] hover:text-white transition"><Heart size={12}/></button>
                                <button className="p-1.5 bg-white rounded-full shadow hover:bg-[#2bbef9] hover:text-white transition"><Eye size={12}/></button>
                            </div>

                            {/* Smaller Image Height (h-32) */}
                            <div className="h-32 mb-3 overflow-hidden flex items-center justify-center p-2">
                                <Link to={`/product/${item._id}`}>
                                    <img src={item.image[0]} alt={item.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                </Link>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <Link to={`/product/${item._id}`}>
                                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm leading-snug mb-1 hover:text-[#2bbef9] transition-colors line-clamp-2 min-h-[36px]">
                                        {item.name}
                                    </h3>
                                </Link>
                                
                                <p className="text-[9px] text-green-600 font-bold uppercase mb-1 tracking-wide">IN STOCK</p>
                                
                                {/* Rating */}
                                <div className="flex items-center gap-0.5 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-[10px] text-gray-400 ml-1">1</span>
                                </div>

                                {/* Price & Button Area */}
                                <div className="mt-auto">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="text-gray-300 line-through text-xs font-medium">$12.00</span>
                                        <span className="text-[#D51243] font-bold text-sm sm:text-base">{currency}{item.price}</span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => addToCart(item._id, item.sizes[0] || 'M')} 
                                        className="w-full py-2 rounded-full border border-[#2bbef9] text-[#2bbef9] font-bold text-[10px] sm:text-xs uppercase tracking-wide hover:bg-[#2bbef9] hover:text-white transition-colors duration-300"
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Home;