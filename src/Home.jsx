import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from './context/ShopContext';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';

// === IMPORT LOCAL IMAGES ===
import banner1 from './assets/banner1.jpg';
import banner2 from './assets/banner2.jpg';
import banner3 from './assets/banner3.jpg';

const Home = () => {
  const { products, currency, addToCart } = useContext(ShopContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- HERO SLIDER CONFIG ---
  const slides = [
    { id: 1, image: banner1, subtitle: "EXCLUSIVE OFFER -20% OFF", title: "Specialist in the grocery store", price: "$7.99", buttonText: "Shop Now" },
    { id: 2, image: banner2, subtitle: "FRESH & ORGANIC", title: "Best Vegetables & Fruits Collection", price: "$5.99", buttonText: "Order Now" },
    { id: 3, image: banner3, subtitle: "BAKERY PRODUCTS", title: "Freshly Baked Every Morning", price: "$2.49", buttonText: "Taste It" }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      
      {/* ================= HERO SLIDER SECTION ================= */}
      <div className="container mx-auto px-4 mb-12 mt-6">
        <div className="relative w-full h-[350px] md:h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-sm group z-0">
            
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-none md:bg-gray-100/10"></div>
            </div>

            <div className="absolute inset-0 flex items-center pl-8 md:pl-20">
                <div className="max-w-xl animate-fade-in-up">
                    <p className="text-[#2bbef9] md:text-green-600 font-bold tracking-wider text-sm md:text-base uppercase mb-2 bg-white/90 md:bg-transparent inline-block px-2 md:px-0 rounded-sm">
                        {slides[currentSlide].subtitle}
                    </p>
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white md:text-[#233a95] drop-shadow-md md:drop-shadow-none">
                        {slides[currentSlide].title}
                    </h2>
                    <p className="text-gray-200 md:text-gray-500 mb-6 text-lg">
                        Only this week. Don’t miss...
                    </p>
                    <div className="flex items-end gap-2 mb-8">
                          <span className="text-gray-200 md:text-gray-500 font-medium pb-1">from</span>
                          <span className="text-white md:text-red-500 font-bold text-4xl">{slides[currentSlide].price}</span>
                    </div>
                    <button className="bg-[#2bbef9] hover:bg-[#209dd0] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg">
                        {slides[currentSlide].buttonText} <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 w-3 rounded-full cursor-pointer transition-all border border-white/50 ${
                    currentSlide === index ? 'bg-[#2bbef9] w-8' : 'bg-gray-300/80 hover:bg-white'
                  }`}
                ></div>
              ))}
            </div>
        </div>
      </div>

      {/* ================= PRODUCT COLLECTION SECTION ================= */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-10">
            <h3 className="text-[#2bbef9] font-bold tracking-widest uppercase text-sm mb-2">Shop Now</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-[#233a95]">Popular Products</h2>
            <p className="text-gray-400 mt-2 max-w-lg mx-auto">
                Do not miss the current offers until the end of the season.
            </p>
        </div>

        {/* --- Product Grid --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((item, index) => (
                <div key={index} className="group bg-white border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 relative overflow-hidden">
                    
                    {/* Discount Badge (Static example) */}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">HOT</span>

                    {/* Image Area */}
                    <div className="h-40 sm:h-48 flex items-center justify-center mb-4 overflow-hidden rounded-lg bg-gray-50">
                        <Link to={`/product/${item._id}`}>
                             {/* Displaying first image from array */}
                             <img src={item.image[0]} alt={item.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </Link>
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{item.subCategory}</p>
                        <Link to={`/product/${item._id}`}>
                            <h3 className="font-bold text-gray-700 text-sm md:text-base mb-2 line-clamp-2 hover:text-[#2bbef9] transition-colors h-10">
                                {item.name}
                            </h3>
                        </Link>
                        
                        {/* Rating Mockup */}
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">(4.5)</span>
                        </div>

                        {/* Price & Add Button */}
                        <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold text-[#D51243]">{currency}{item.price}</p>
                            
                            <button 
                                onClick={() => addToCart(item._id, item.sizes[0] || 'M')} 
                                className="h-10 w-10 rounded-full bg-blue-50 text-[#233a95] flex items-center justify-center hover:bg-[#233a95] hover:text-white transition-colors"
                            >
                                <ShoppingCart size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
    </div>
  );
};

export default Home;