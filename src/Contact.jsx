import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from './context/ShopContext'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const { backendUrl } = useContext(ShopContext);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  
  // 1. STATE FOR DYNAMIC INFO
  const [contactInfo, setContactInfo] = useState({
      address: 'Loading...', 
      email: 'Loading...', 
      phone: 'Loading...'
  });

  // 2. FETCH SETTINGS ON LOAD
  useEffect(() => {
      const fetchSettings = async () => {
          try {
              const res = await axios.get(backendUrl + '/api/contact/settings');
              if(res.data.success) {
                  setContactInfo(res.data.settings);
              }
          } catch (error) {
              console.log("Error loading contact info");
          }
      }
      fetchSettings();
  }, [backendUrl]);

  const onChangeHandler = (e) => {
      const { name, value } = e.target;
      setFormData(data => ({...data, [name]: value}));
  }

  const onSubmitHandler = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const response = await axios.post(backendUrl + '/api/contact/submit', formData);
          if (response.data.success) {
              toast.success("Message Sent Successfully!");
              setFormData({ name: '', email: '', phone: '', message: '' });
          } else {
              toast.error("Failed to send message.");
          }
      } catch (error) {
          toast.error("Something went wrong");
      } finally {
          setLoading(false);
      }
  }

  return (
    <div className="container mx-auto px-4 py-12 border-t">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#233a95] mb-2">Get In Touch</h2>
        <p className="text-gray-500">Have a question? We'd love to hear from you.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto">
        
        {/* Dynamic Contact Info Cards */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
                <div className="bg-blue-50 p-3 rounded-full text-[#233a95]"><MapPin /></div>
                <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-800">Our Location</h3>
                    <p className="text-gray-600 text-sm">{contactInfo.address}</p>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
                <div className="bg-blue-50 p-3 rounded-full text-[#233a95]"><Mail /></div>
                <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-800">Email Address</h3>
                    <p className="text-gray-600 text-sm">{contactInfo.email}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition">
                <div className="bg-blue-50 p-3 rounded-full text-[#233a95]"><Phone /></div>
                <div>
                    <h3 className="font-bold text-lg mb-1 text-gray-800">Phone Number</h3>
                    <p className="text-gray-600 text-sm">{contactInfo.phone}</p>
                </div>
            </div>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-2/3 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Send us a message</h3>
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-600 mb-1">Full Name *</label>
                        <input name="name" onChange={onChangeHandler} value={formData.name} type="text" placeholder="John Doe" required className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#233a95] focus:ring-1 focus:ring-[#233a95] transition"/>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-bold text-gray-600 mb-1">Email *</label>
                        <input name="email" onChange={onChangeHandler} value={formData.email} type="email" placeholder="john@example.com" required className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#233a95] focus:ring-1 focus:ring-[#233a95] transition"/>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Phone Number</label>
                    <input name="phone" onChange={onChangeHandler} value={formData.phone} type="text" placeholder="+1 234..." className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#233a95] focus:ring-1 focus:ring-[#233a95] transition"/>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Message *</label>
                    <textarea name="message" onChange={onChangeHandler} value={formData.message} rows={5} placeholder="How can we help you?" required className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#233a95] focus:ring-1 focus:ring-[#233a95] transition"></textarea>
                </div>
                
                <button type="submit" disabled={loading} className="bg-[#233a95] text-white py-4 px-8 rounded font-bold hover:bg-blue-800 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 max-w-xs">
                    {loading ? 'Sending...' : <><Send size={18}/> Send Message</>}
                </button>
            </form>
        </div>

      </div>
    </div>
  )
}
export default Contact;