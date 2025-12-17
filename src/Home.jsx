import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Search, User, ShoppingBag, Menu, ChevronDown, ChevronRight, ArrowRight,
  Apple, Beef, Egg, Coffee, Cookie, Snowflake, Candy, Wheat
} from 'lucide-react';

// ----------------------------------------------------------------------
// THIS IS THE CHANGE: We import the images from your computer folder
// ----------------------------------------------------------------------
import banner1 from './assets/banner1.jpg';
import banner2 from './assets/banner2.jpg';
import banner3 from './assets/banner3.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ----------------------------------------------------------------------
  // THIS IS THE UPDATED ARRAY: We use the variables (banner1) we imported above
  // ----------------------------------------------------------------------
  const slides = [
    {
      id: 1,
      image: banner1,  // <--- Using the local image variable
      subtitle: "EXCLUSIVE OFFER -20% OFF",
      title: "Specialist in the grocery store",
      price: "$7.99",
      buttonText: "Shop Now"
    },
    {
      id: 2,
      image: banner2,  // <--- Using the local image variable
      subtitle: "FRESH & ORGANIC",
      title: "Best Vegetables & Fruits Collection",
      price: "$5.99",
      buttonText: "Order Now"
    },
    {
      id: 3,
      image: banner3,  // <--- Using the local image variable
      subtitle: "BAKERY PRODUCTS",
      title: "Freshly Baked Every Morning",
      price: "$2.49",
      buttonText: "Taste It"
    }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const categories = [
    { name: "Fruits & Vegetables", icon: Apple, hasSub: true },
    { name: "Meats & Seafood", icon: Beef, hasSub: false },
    { name: "Breakfast & Dairy", icon: Egg, hasSub: false },
    { name: "Beverages", icon: Coffee, hasSub: true },
    { name: "Breads & Bakery", icon: Cookie, hasSub: false },
    { name: "Frozen Foods", icon: Snowflake, hasSub: false },
    { name: "Biscuits & Snacks", icon: Candy, hasSub: false },
    { name: "Grocery & Staples", icon: Wheat, hasSub: false },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      
      {/* 1. Top Notification Bar */}
      <div className="bg-[#233a95] text-white text-center py-2 text-sm font-medium">
        Due to the <span className="font-bold">COVID 19</span> epidemic, orders may be processed with a slight delay
      </div>

      {/* 2. Secondary Info Bar */}
      <div className="border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} /> 
            <span>100% Secure delivery without contacting the courier</span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <span>Need help? Call Us:</span>
            <span className="text-blue-600 font-bold">+ 0020 500</span>
          </div>
        </div>
      </div>

      {/* 3. Main Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left min-w-max">
            <h1 className="text-4xl font-bold text-black tracking-tight">bacola</h1>
            <p className="text-xs text-gray-400 mt-1">Online Grocery Shopping Center</p>
          </div>

          <div className="w-full md:max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center px-4 py-3 border border-gray-200">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="bg-transparent flex-grow outline-none text-gray-600 placeholder-gray-400"
            />
            <Search className="text-gray-500 cursor-pointer" size={20} />
          </div>

          <div className="flex items-center gap-5 min-w-max">
             <Link to="/login">
               <div className="rounded-full border border-gray-300 p-2 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition group">
                 <User size={24} className="text-gray-700 group-hover:text-blue-600" />
               </div>
             </Link>
            <div className="font-bold text-gray-900 hidden sm:block">$0.00</div>
            <div className="relative bg-orange-100 rounded-full p-3 cursor-pointer hover:bg-orange-200 transition">
              <ShoppingBag size={20} className="text-red-500" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Navigation Bar */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-6 relative z-50">
          
          <div className="group relative w-full lg:w-auto">
            <button className="w-full lg:w-64 bg-[#2bbef9] hover:bg-[#209dd0] text-white px-6 py-4 rounded-full flex items-center justify-between font-bold transition shadow-sm">
              <div className="flex items-center gap-3">
                <Menu size={20} />
                <span>ALL CATEGORIES</span>
              </div>
              <ChevronDown size={16} />
            </button>

            <div className="hidden group-hover:block absolute top-full left-0 w-full lg:w-64 bg-white border border-gray-200 shadow-xl rounded-xl pt-2 pb-2 mt-2">
              <ul className="flex flex-col">
                {categories.map((cat, index) => (
                  <li key={index} className="group/item flex items-center justify-between px-6 py-3 hover:text-[#2bbef9] cursor-pointer transition-colors">
                    <div className="flex items-center gap-4 text-gray-500 group-hover/item:text-[#2bbef9]">
                      <cat.icon size={20} strokeWidth={1.5} />
                      <span className="font-medium text-sm text-gray-700 group-hover/item:text-[#2bbef9]">{cat.name}</span>
                    </div>
                    {cat.hasSub && <ChevronRight size={16} className="text-gray-400" />}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-8 text-xs font-bold uppercase text-gray-600 w-full lg:w-auto tracking-wide">
            <div className="flex items-center gap-1 bg-blue-50 text-blue-500 px-3 py-2 rounded-full cursor-pointer">
               <span>HOME</span>
               <ChevronDown size={14} />
            </div>
            <a href="#" className="hover:text-blue-500 flex items-center gap-1">SHOP <ChevronDown size={14} /></a>
            <a href="#" className="hover:text-blue-500 flex items-center gap-2"><Beef size={16} /> MEATS & SEAFOOD</a>
            <a href="#" className="hover:text-blue-500 flex items-center gap-2"><Cookie size={16} /> BAKERY</a>
            <a href="#" className="hover:text-blue-500 flex items-center gap-2"><Coffee size={16} /> BEVERAGES</a>
            <a href="#" className="hover:text-blue-500">BLOG</a>
            <a href="#" className="hover:text-blue-500">CONTACT</a>
          </nav>

        </div>
      </div>

      {/* 5. HERO SLIDER SECTION */}
      <div className="container mx-auto px-4 mb-12">
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
      
    </div>
  );
};

export default Home;