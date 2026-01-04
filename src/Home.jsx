import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from './context/ShopContext';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for Config Fetching
import { ArrowRight, ShoppingCart, Star, Heart, Eye } from 'lucide-react';

// === IMPORT LOCAL BANNER IMAGES ===
import banner1 from './assets/banner1.jpg'; 
import banner2 from './assets/banner2.jpg';
import banner3 from './assets/banner3.jpg';

const Home = () => {
  const { products, currency, addToCart, featurePoster, backendUrl } = useContext(ShopContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- CONFIG STATE (Hot Deal, Testimonial, Banners) ---
  const [config, setConfig] = useState(null);
  const [hotProduct, setHotProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days:0, hours:0, minutes:0, seconds:0 });

  // --- DATA FILTERS ---
  const bestSellers = products.filter(item => item.bestseller).slice(0, 8);
  const newProducts = products.filter(item => item.newArrival).slice(0, 8);
  const trendingProducts = products.filter(item => item.trending).slice(0, 5);

  // --- SLIDER CONFIG ---
  const slides = [
    { id: 1, image: banner1, subtitle: "EXCLUSIVE OFFER -20% OFF", title: "Specialist in the grocery store", price: "$7.99", buttonText: "Shop Now" },
    { id: 2, image: banner2, subtitle: "FRESH & ORGANIC", title: "Vegetables & Fruits", price: "$5.99", buttonText: "Order Now" },
    { id: 3, image: banner3, subtitle: "BAKERY PRODUCTS", title: "Freshly Baked Every Morning", price: "$2.49", buttonText: "Taste It" }
  ];

  // 1. Slider Timer
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  // 2. Fetch Home Config & Find Hot Product
  useEffect(() => {
    const fetchConfig = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/config/get');
            if(data.success) {
                setConfig(data.config);
                // If products are loaded, find the hot product object
                if(products.length > 0 && data.config.hotProduct.productId) {
                    const found = products.find(p => p._id === data.config.hotProduct.productId);
                    setHotProduct(found);
                }
            }
        } catch (error) { console.error(error); }
    };
    fetchConfig();
  }, [products, backendUrl]);

  // 3. Countdown Timer Logic
  useEffect(() => {
    if(!config || !config.hotProduct.endDate) return;
    
    const calculateTime = () => {
        const now = new Date().getTime();
        const distance = new Date(config.hotProduct.endDate).getTime() - now;
        
        if(distance < 0) {
            setTimeLeft({ days:0, hours:0, minutes:0, seconds:0 });
            return; 
        }
        
        setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime(); // Run immediately
    return () => clearInterval(timer);
  }, [config]);


  // --- REUSABLE PRODUCT CARD ---
  const ProductCard = ({ item }) => (
    <div className="group bg-white border border-gray-100 rounded-lg p-3 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
            {item.discount > 0 && <span className="bg-[#2bbef9] text-white text-[10px] font-bold px-2 py-1 rounded">{item.discount}%</span>}
            {item.subCategory && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">RECOMMENDED</span>}
        </div>
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button className="p-2 bg-white rounded-full shadow hover:bg-[#2bbef9] hover:text-white transition"><Heart size={14}/></button>
             <button className="p-2 bg-white rounded-full shadow hover:bg-[#2bbef9] hover:text-white transition"><Eye size={14}/></button>
        </div>
        <div className="h-36 mb-2 overflow-hidden flex items-center justify-center p-2">
            <Link to={`/product/${item._id}`}>
                <img src={item.image[0]} alt={item.name} className="h-full object-contain group-hover:scale-105 transition-transform duration-500" />
            </Link>
        </div>
        <div className="flex flex-col flex-grow">
            <Link to={`/product/${item._id}`}>
                <h3 className="font-bold text-gray-700 text-[14px] leading-snug mb-1 hover:text-[#2bbef9] transition-colors line-clamp-2 min-h-[40px]">{item.name}</h3>
            </Link>
            <p className={`text-[10px] font-bold uppercase mb-1 ${item.inStock ? 'text-green-600' : 'text-red-500'}`}>{item.inStock ? 'IN STOCK' : 'OUT OF STOCK'}</p>
            <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (<Star key={i} size={10} className={`${i < (item.rating || 4) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />))}
                <span className="text-xs text-gray-400 ml-1">1</span>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2">
                <div className="flex flex-col">
                    {item.oldPrice > 0 && <span className="text-gray-300 line-through text-xs">${item.oldPrice}</span>}
                    <span className="text-red-500 font-bold text-lg">{currency}{item.price}</span>
                </div>
                <button onClick={() => addToCart(item._id, item.sizes[0] || 'M')} className="px-4 py-1.5 rounded-full border border-[#2bbef9] text-[#2bbef9] font-bold text-[10px] uppercase tracking-wide hover:bg-[#2bbef9] hover:text-white transition-colors duration-300">Add</button>
            </div>
        </div>
    </div>
  );

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

      {/* ================= BEST SELLERS (Yellow Poster) ================= */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b pb-4">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">BACOLA NATURAL FOODS</h3>
                <h2 className="text-2xl md:text-3xl font-bold text-[#233a95] uppercase">Best Sellers</h2>
                <p className="text-gray-500 text-sm mt-1">Do not miss the current offers until the end of March.</p>
            </div>
            <Link to="/collection?type=bestseller" className="hidden md:flex items-center gap-2 px-6 py-2 border rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-[25%] hidden lg:block">
                {featurePoster && featurePoster.image ? (
                    <Link to={featurePoster.redirectUrl || '#'}><div className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 h-full max-h-[700px]"><img src={featurePoster.image} alt="Special Offer" className="w-full h-full object-cover" /></div></Link>
                ) : (
                    <div className="rounded-xl bg-yellow-100 h-full min-h-[400px] flex items-center justify-center text-gray-400 border-2 border-dashed border-yellow-200"><p>No Banner Set</p></div>
                )}
            </div>
            <div className="w-full lg:w-[75%]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {bestSellers.map((item, index) => <ProductCard key={index} item={item} />)}
                </div>
            </div>
        </div>
      </div>

      {/* ================= NEW PRODUCTS (Trending Sidebar) ================= */}
      <div className="container mx-auto px-4 mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-[25%]">
                  <h3 className="font-bold text-gray-800 uppercase mb-4 text-sm tracking-wide border-b pb-2">Trending Products</h3>
                  <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-5 shadow-sm">
                      {trendingProducts.map((item, i) => (
                          <div key={i} className="flex gap-4 group cursor-pointer">
                              <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 border shrink-0">
                                  <Link to={`/product/${item._id}`}><img src={item.image[0]} className="w-full h-full object-contain group-hover:scale-110 transition" /></Link>
                              </div>
                              <div className="flex flex-col justify-center">
                                  <Link to={`/product/${item._id}`}><p className="font-bold text-sm text-gray-700 leading-tight hover:text-blue-500 line-clamp-2 mb-1">{item.name}</p></Link>
                                  <div className="flex gap-2 items-center"><span className="text-[#D51243] font-bold text-sm">{currency}{item.price}</span>{item.oldPrice > 0 && <span className="text-gray-300 line-through text-xs font-normal">${item.oldPrice}</span>}</div>
                              </div>
                          </div>
                      ))}
                      {trendingProducts.length === 0 && <p className="text-xs text-gray-400">No trending items.</p>}
                  </div>
              </div>
              <div className="w-full lg:w-[75%]">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b pb-4">
                      <div><h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">NEWLY ADDED</h3><h2 className="text-2xl font-bold text-[#233a95] uppercase">New Products</h2><p className="text-sm text-gray-500 mt-1">New products with updated stocks.</p></div>
                      <Link to="/collection?type=new" className="mt-4 md:mt-0 px-5 py-1 border rounded-full text-xs font-bold hover:bg-gray-50 transition">View All &rarr;</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {newProducts.map((item, index) => <ProductCard key={index} item={item} />)}
                  </div>
              </div>
          </div>
      </div>

      {/* ================= HOT PRODUCT OF THE WEEK (New) ================= */}
      {config && config.hotProduct && config.hotProduct.isActive && hotProduct && (
          <div className="container mx-auto px-4 mb-16">
              <div className="border-2 border-red-500 rounded-xl p-8 flex flex-col md:flex-row items-center relative overflow-hidden bg-white">
                  <div className="absolute top-4 left-4 bg-red-600 text-white rounded-full h-14 w-14 flex items-center justify-center font-bold text-lg shadow-lg z-10 animate-pulse">
                      {hotProduct.discount > 0 ? `${hotProduct.discount}%` : 'HOT'}
                  </div>
                  <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
                      <img src={hotProduct.image[0]} className="h-64 object-contain hover:scale-110 transition duration-500" />
                  </div>
                  <div className="w-full md:w-2/3 pl-0 md:pl-10">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-1">Hot Product For <span className="text-red-500">This Week</span></h3>
                              <p className="text-gray-400 text-xs mb-4">Dont miss this opportunity at a special discount just for this week.</p>
                          </div>
                          <Link to={`/product/${hotProduct._id}`} className="border px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-50 transition">View All &rarr;</Link>
                      </div>
                      <Link to={`/product/${hotProduct._id}`}><h2 className="text-2xl md:text-3xl font-bold text-[#233a95] mb-2 hover:text-blue-600">{hotProduct.name}</h2></Link>
                      <div className="flex items-center gap-3 mb-6">
                           <span className="text-gray-400 line-through text-lg">${hotProduct.oldPrice}</span>
                           <span className="text-red-500 font-bold text-3xl">{currency}{hotProduct.price}</span>
                      </div>
                      <div className="flex gap-4 mb-6">
                          {[ {val: timeLeft.days, label:'Days'}, {val:timeLeft.hours, label:'Hours'}, {val:timeLeft.minutes, label:'Mins'}, {val:timeLeft.seconds, label:'Secs'} ].map((t,i) => (
                              <div key={i} className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-center min-w-[70px]">
                                  <span className="block font-bold text-xl text-gray-800">{t.val}</span>
                                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t.label}</span>
                              </div>
                          ))}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-gradient-to-r from-red-500 to-yellow-400 h-2.5 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <p className="text-xs text-gray-500">Remains until the end of the offer</p>
                  </div>
              </div>
          </div>
      )}

      {/* ================= CUSTOMER COMMENT & BANNERS (New) ================= */}
      <div className="container mx-auto px-4 mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
              {/* Comment Card */}
              {config && config.testimonial && (
                  <div className="w-full lg:w-1/3 bg-[#fffcf8] p-8 rounded-xl border border-yellow-100 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-800 uppercase mb-6 text-sm tracking-wide">Customer Comment</h3>
                      <div className="bg-[#fcf8e3] p-6 rounded-xl mb-6 relative">
                          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-[#fcf8e3] rotate-45"></div>
                          <h4 className="font-bold text-[#233a95] mb-2">The Best Marketplace</h4>
                          <p className="text-gray-600 text-sm leading-relaxed italic">"{config.testimonial.desc}"</p>
                      </div>
                      <div className="flex items-center gap-4">
                          <img src={config.testimonial.image || "https://via.placeholder.com/50"} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                          <div>
                              <p className="font-bold text-gray-800 text-sm">{config.testimonial.name}</p>
                              <p className="text-xs text-gray-500">{config.testimonial.role}</p>
                          </div>
                      </div>
                  </div>
              )}
              {/* Banners */}
              <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-6">
                  {config && config.banner1 && config.banner1.image && (
                      <div className="flex-1 relative rounded-xl overflow-hidden group h-[250px]">
                          <img src={config.banner1.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                          <div className="absolute top-8 left-8">
                              <p className="text-green-600 font-bold text-xs uppercase mb-2 bg-white/80 inline-block px-2 py-1 rounded">Weekend Discount 40%</p>
                              <h3 className="text-2xl font-bold text-[#233a95] mb-4 leading-tight">Legumes & <br/>Cereals</h3>
                              {config.banner1.link && <Link to={config.banner1.link} className="bg-gray-500/20 backdrop-blur-sm border border-gray-400 text-gray-800 px-6 py-2 rounded-full text-xs font-bold hover:bg-[#233a95] hover:text-white hover:border-[#233a95] transition">Shop Now</Link>}
                          </div>
                      </div>
                  )}
                  {config && config.banner2 && config.banner2.image && (
                      <div className="flex-1 relative rounded-xl overflow-hidden group h-[250px]">
                          <img src={config.banner2.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                          <div className="absolute top-8 left-8">
                              <p className="text-green-600 font-bold text-xs uppercase mb-2 bg-white/80 inline-block px-2 py-1 rounded">Weekend Discount 40%</p>
                              <h3 className="text-2xl font-bold text-[#233a95] mb-4 leading-tight">Dairy & <br/>Eggs</h3>
                              {config.banner2.link && <Link to={config.banner2.link} className="bg-gray-500/20 backdrop-blur-sm border border-gray-400 text-gray-800 px-6 py-2 rounded-full text-xs font-bold hover:bg-[#233a95] hover:text-white hover:border-[#233a95] transition">Shop Now</Link>}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>

    </div>
  );
};

export default Home;