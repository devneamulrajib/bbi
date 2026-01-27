import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { MessageSquare, Calendar, Phone, Mail, Trash2, Save, MapPin, Edit3 } from 'lucide-react';

const Messages = ({ token }) => {
  const [messages, setMessages] = useState([]);
  
  // Settings State
  const [contactInfo, setContactInfo] = useState({
    address: '', email: '', phone: ''
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      // 1. Get Messages
      const msgRes = await axios.get(backendUrl + '/api/contact/all', { headers: { token } });
      if (msgRes.data.success) setMessages(msgRes.data.messages);

      // 2. Get Settings
      const setRes = await axios.get(backendUrl + '/api/contact/settings');
      if (setRes.data.success) setContactInfo(setRes.data.settings);

    } catch (error) {
      toast.error("Error loading data");
    }
  }

  useEffect(() => {
    if (token) {
        // 1. Load Data
        fetchData();

        // 2. Mark messages as read (Clears the Sidebar Notification)
        axios.post(backendUrl + '/api/contact/mark-read', {}, { headers: { token } })
             .catch(err => console.error("Failed to mark messages read", err));
    }
  }, [token]);

  // --- DELETE MESSAGE ---
  const deleteMsg = async (id) => {
    if(!window.confirm("Are you sure you want to delete this message?")) return;
    try {
        const res = await axios.post(backendUrl + '/api/contact/delete', { id }, { headers: { token } });
        if(res.data.success) {
            toast.success("Message Deleted");
            fetchData(); // Refresh list
        } else {
            toast.error(res.data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
  }

  // --- UPDATE SETTINGS ---
  const updateSettings = async (e) => {
      e.preventDefault();
      setLoadingSettings(true);
      try {
        const res = await axios.post(backendUrl + '/api/contact/settings/update', contactInfo, { headers: { token } });
        if(res.data.success) {
            toast.success("Contact Info Updated Successfully");
        } else {
            toast.error(res.data.message);
        }
      } catch (error) {
          toast.error(error.message);
      } finally {
        setLoadingSettings(false);
      }
  }

  return (
    <div className='w-full flex flex-col gap-8 pb-10'>
      
      {/* --- SECTION 1: MANAGE CONTACT INFO --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
         <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
            <Edit3 size={20}/> Edit Contact Page Info
         </h3>
         <form onSubmit={updateSettings} className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
                <label className="text-sm font-bold text-gray-600 block mb-1">Company Email</label>
                <div className="flex items-center border rounded px-3 py-2 bg-gray-50 focus-within:ring-1 ring-blue-500">
                    <Mail size={16} className="text-gray-400 mr-2"/>
                    <input value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} type="email" required className="bg-transparent outline-none w-full text-sm"/>
                </div>
             </div>
             <div>
                <label className="text-sm font-bold text-gray-600 block mb-1">Phone Number</label>
                <div className="flex items-center border rounded px-3 py-2 bg-gray-50 focus-within:ring-1 ring-blue-500">
                    <Phone size={16} className="text-gray-400 mr-2"/>
                    <input value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} type="text" required className="bg-transparent outline-none w-full text-sm"/>
                </div>
             </div>
             <div>
                <label className="text-sm font-bold text-gray-600 block mb-1">Physical Address</label>
                <div className="flex items-center border rounded px-3 py-2 bg-gray-50 focus-within:ring-1 ring-blue-500">
                    <MapPin size={16} className="text-gray-400 mr-2"/>
                    <input value={contactInfo.address} onChange={e => setContactInfo({...contactInfo, address: e.target.value})} type="text" required className="bg-transparent outline-none w-full text-sm"/>
                </div>
             </div>
             <div className="md:col-span-3 flex justify-end">
                 <button type="submit" disabled={loadingSettings} className="bg-black text-white px-6 py-2.5 rounded font-medium flex items-center gap-2 hover:bg-gray-800 transition shadow-sm">
                    <Save size={18}/> {loadingSettings ? "Saving..." : "Save Changes"}
                 </button>
             </div>
         </form>
      </div>

      {/* --- SECTION 2: INBOX --- */}
      <div>
        <h3 className="mb-5 font-bold text-2xl text-gray-700 flex items-center gap-2">
            <MessageSquare /> Inbox <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{messages.length}</span>
        </h3>
        
        <div className="flex flex-col gap-4">
            {messages.length === 0 && <p className="text-gray-500 italic p-4 border rounded bg-gray-50">No messages found.</p>}
            
            {messages.map((msg, index) => (
            <div key={index} className={`border p-5 rounded-lg shadow-sm hover:shadow-md transition relative group ${!msg.read ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-200'}`}>
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg text-[#233a95]">{msg.name}</h4>
                            {!msg.read && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Mail size={14}/> {msg.email}</span>
                            {msg.phone && <span className="flex items-center gap-1"><Phone size={14}/> {msg.phone}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="text-xs text-gray-400 flex items-center gap-1 bg-white border px-2 py-1 rounded">
                            <Calendar size={12}/> {new Date(msg.date).toLocaleDateString()}
                        </span>
                        {/* DELETE BUTTON */}
                        <button 
                            onClick={() => deleteMsg(msg._id)}
                            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition"
                            title="Delete Message"
                        >
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
                
                {/* Message Body */}
                <div className="bg-white/50 p-4 rounded-md border border-black/5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Messages;