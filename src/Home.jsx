import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight
} from 'lucide-react';

// === IMPORT LOCAL IMAGES ===
import banner1 from './assets/banner1.jpg';
import banner2 from './assets/banner2.jpg';
import banner3 from './assets/banner3.jpg';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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