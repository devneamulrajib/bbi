import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Phone, Truck, ShieldCheck, Percent, DollarSign, Facebook, Instagram, Music } from 'lucide-react'; // Music icon for TikTok

const Footer = () => {
  const { backendUrl, featurePoster } = useContext(ShopContext); 
  // Note: Better to fetch config in Context and export it, 
  // but for now we assume you passed 'footerConfig' via ShopContext or we fetch it here.
  // Ideally, add `footerConfig` to your ShopContext state.
  
  // MOCK DATA (Replace with context data if available, or fetch)
  // Assuming ShopContext exposes a 'config' object. If not, use local state/useEffect.
  const { config } = useContext(ShopContext); 
  
  const footerData = config?.footer || {
      phone: "8 800 555-55",
      facebook: "#", instagram: "#", tiktok: "#",
      playStore: "#", appStore: "#"
  };

  return (
    <div className='bg-[#F7F8FD] mt-20 pt-10 pb-6 border-t border-gray-200'>
        <div className='container mx-auto px-4'>
            
            {/* Top Features */}
            <div className='flex flex-wrap justify-between border-b pb-8 mb-8 gap-4'>
                <div className='flex items-center gap-3'><div className='p-2 rounded-full border border-gray-300'><Truck size={20}/></div><span className='font-medium text-sm'>Everyday fresh products</span></div>
                <div className='flex items-center gap-3'><div className='p-2 rounded-full border border-gray-300'><Truck size={20}/></div><span className='font-medium text-sm'>Free delivery for order over $70</span></div>
                <div className='flex items-center gap-3'><div className='p-2 rounded-full border border-gray-300'><Percent size={20}/></div><span className='font-medium text-sm'>Daily Mega Discounts</span></div>
                <div className='flex items-center gap-3'><div className='p-2 rounded-full border border-gray-300'><DollarSign size={20}/></div><span className='font-medium text-sm'>Best price on the market</span></div>
            </div>

            {/* Main Footer Content */}
            <div className='flex flex-col md:flex-row justify-between items-center gap-8 mb-10'>
                
                {/* Phone */}
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center bg-white'><Phone size={24}/></div>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>{footerData.phone}</h2>
                        <p className='text-xs text-gray-500'>Working 8:00 - 22:00</p>
                    </div>
                </div>

                {/* App Download */}
                <div className='flex flex-col md:flex-row items-center gap-4'>
                    <div>
                        <p className='font-bold text-gray-700 text-sm'>Download App on Mobile :</p>
                        <p className='text-xs text-gray-400'>15% discount on your first purchase</p>
                    </div>
                    <div className='flex gap-2'>
                        <a href={footerData.playStore} target="_blank" className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-2 w-32 hover:opacity-80 transition">
                            <div className="text-[10px]">GET IT ON <br/><span className="text-sm font-bold">Google Play</span></div>
                        </a>
                        <a href={footerData.appStore} target="_blank" className="bg-black text-white px-3 py-1.5 rounded flex items-center gap-2 w-32 hover:opacity-80 transition">
                            <div className="text-[10px]">Download on the <br/><span className="text-sm font-bold">App Store</span></div>
                        </a>
                    </div>
                </div>

                {/* Socials */}
                <div className='flex gap-3'>
                    <a href={footerData.facebook} className='w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:text-blue-600 transition'><Facebook size={20}/></a>
                    <a href={footerData.tiktok} className='w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:text-pink-500 transition'><Music size={20}/></a>
                    <a href={footerData.instagram} className='w-10 h-10 rounded-full border bg-white flex items-center justify-center hover:text-orange-500 transition'><Instagram size={20}/></a>
                </div>
            </div>

            <div className='h-px w-full bg-gray-200 mb-6'></div>

            {/* Bottom Links */}
            <div className='flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4'>
                <p>Copyright 2024 © Bacola WordPress Theme. All rights reserved. Powered by KlbTheme.</p>
                
                <div className='flex gap-6'>
                    <Link to="/page/privacy-policy" className='hover:text-black'>Privacy Policy</Link>
                    <Link to="/page/terms-conditions" className='hover:text-black'>Terms and Conditions</Link>
                    <Link to="/page/cookie-policy" className='hover:text-black'>Cookie</Link>
                </div>

                <div className='flex gap-2'>
                    {/* Placeholder Payment Icons - Use images or SVGs here */}
                    <span className='border px-1'>VISA</span>
                    <span className='border px-1'>MasterCard</span>
                    <span className='border px-1'>PayPal</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer;