import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { FileText, Save } from 'lucide-react'

const Content = ({ token }) => {
    
    // Default to Privacy Policy
    const [activeTab, setActiveTab] = useState("privacy-policy");
    const [title, setTitle] = useState("Privacy Policy");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const pages = [
        { id: 'privacy-policy', label: 'Privacy Policy' },
        { id: 'terms-conditions', label: 'Terms & Conditions' },
        { id: 'cookie-policy', label: 'Cookie Policy' }
    ];

    // Fetch content when tab changes
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const response = await axios.get(backendUrl + `/api/pages/${activeTab}`);
                if (response.data.success && response.data.page) {
                    setContent(response.data.page.content);
                    setTitle(response.data.page.title);
                } else {
                    // If page doesn't exist yet in DB, just reset content
                    setContent("");
                    setTitle(pages.find(p => p.id === activeTab).label);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [activeTab]);

    // Save content
    const handleSave = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/pages/update', 
                { slug: activeTab, title, content }, 
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Page Content Updated!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='w-full max-w-4xl'>
            <h2 className='text-2xl font-bold mb-6 text-gray-700 flex items-center gap-2'>
                <FileText /> Manage Legal Pages
            </h2>

            {/* TABS */}
            <div className='flex gap-2 mb-6 border-b'>
                {pages.map((page) => (
                    <button 
                        key={page.id}
                        onClick={() => setActiveTab(page.id)}
                        className={`px-6 py-3 font-medium transition-colors rounded-t-lg ${
                            activeTab === page.id 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        {page.label}
                    </button>
                ))}
            </div>

            {/* EDITOR AREA */}
            <div className='bg-white p-6 rounded shadow-sm border'>
                <div className='mb-4'>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>Page Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full border px-4 py-2 rounded focus:outline-blue-500'
                    />
                </div>

                <div className='mb-6'>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>Page Content</label>
                    <p className='text-xs text-gray-400 mb-2'>You can type normal text here. It will preserve spacing and lines.</p>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className='w-full h-96 border px-4 py-3 rounded focus:outline-blue-500 leading-relaxed'
                        placeholder="Start typing your policy here..."
                        style={{ whiteSpace: 'pre-wrap' }} 
                    ></textarea>
                </div>

                <button 
                    onClick={handleSave} 
                    className='bg-blue-600 text-white px-8 py-3 rounded font-bold flex items-center gap-2 hover:bg-blue-700 transition'
                >
                    <Save size={20} /> SAVE CONTENT
                </button>
            </div>
        </div>
    )
}

export default Content