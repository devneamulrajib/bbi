import React from 'react';
// Only Link is needed for navigation within the page itself
// Header is now provided by Layout in App.jsx
// No need to import ShieldCheck, Search, User, ShoppingBag, Menu, ChevronDown from here
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-700">
      
      {/* --- CONTACT FORM SECTION --- */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#233a95] mb-4">Get In Touch</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We are here to help you. Send us your query or feedback and we will get back to you as soon as possible.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          
          {/* Left: Contact Info */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-[#f7f8fd] p-8 rounded-2xl border border-blue-50 text-center hover:shadow-lg transition">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#2bbef9] shadow-sm">
                 <MapPin size={32} />
               </div>
               <h3 className="font-bold text-lg mb-2">Our Location</h3>
               <p className="text-gray-500 text-sm">123 Grocery St, Food City, New York, USA</p>
            </div>

            <div className="bg-[#f7f8fd] p-8 rounded-2xl border border-blue-50 text-center hover:shadow-lg transition">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#2bbef9] shadow-sm">
                 <Mail size={32} />
               </div>
               <h3 className="font-bold text-lg mb-2">Email Us</h3>
               <p className="text-gray-500 text-sm">support@bacola.com</p>
               <p className="text-gray-500 text-sm">info@bacola.com</p>
            </div>

            <div className="bg-[#f7f8fd] p-8 rounded-2xl border border-blue-50 text-center hover:shadow-lg transition">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#2bbef9] shadow-sm">
                 <Phone size={32} />
               </div>
               <h3 className="font-bold text-lg mb-2">Call Us</h3>
               <p className="text-gray-500 text-sm">+0020 500 800</p>
               <p className="text-gray-500 text-sm">Mon - Sat: 9:00 - 20:00</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-2/3 bg-white p-8 lg:p-10 rounded-2xl border border-gray-200 shadow-sm">
             <h3 className="text-2xl font-bold mb-6 text-gray-800">Send us a message</h3>
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Full Name *</label>
                      <input type="text" placeholder="Your Name" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] focus:bg-white transition" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-600">Email Address *</label>
                      <input type="email" placeholder="Your Email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] focus:bg-white transition" />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-600">Phone Number</label>
                   <input type="tel" placeholder="Your Phone Number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] focus:bg-white transition" />
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-600">Message *</label>
                   <textarea rows="5" placeholder="Write your message here..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] focus:bg-white transition resize-none"></textarea>
                </div>

                <button className="bg-[#233a95] hover:bg-[#2bbef9] text-white px-8 py-4 rounded-lg font-bold transition flex items-center gap-2">
                   SEND MESSAGE <Send size={18} />
                </button>
             </form>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;