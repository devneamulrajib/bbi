import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload, X, User, Loader2 } from 'lucide-react'

const Profile = ({ token }) => {

    const [image, setImage] = useState(false)
    const [prevImage, setPrevImage] = useState("") 
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [loading, setLoading] = useState(false);

    // --- Helper: Fix Image Paths ---
    const getImageUrl = (img) => {
        if (!img) return "";
        if (img.startsWith('http') || img.startsWith('blob:')) return img;
        return `${backendUrl}/images/${img}`; 
    }

    // --- 1. Fetch Current Data (Fixed Crash Issue) ---
    const fetchProfile = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/user/profile?t=' + Date.now(), { headers: { token } })
            
            if (response.data.success) {
                // Get user object safely
                const user = response.data.user || response.data.userData; 
                
                // CRITICAL FIX: Stop if user is null
                if (!user) {
                    console.error("User object is null despite success:true");
                    return;
                }

                // Use Optional Chaining (?.) to prevent crashes
                setName(user?.name || "")
                setEmail(user?.email || "")
                setPhone(user?.phone || "") 
                setPrevImage(user?.image || "")

                // Safe Address Parsing
                if (user?.address) {
                    try {
                        const parsed = typeof user.address === 'object' ? user.address : JSON.parse(user.address);
                        setAddress1(parsed?.line1 || "")
                        setAddress2(parsed?.line2 || "")
                    } catch (e) {
                        console.log("Address parsing error");
                    }
                }
            } 
        } catch (error) {
            console.error("Profile Load Error:", error);
            // No toast error here to avoid annoying popups on load
        }
    }

    // --- 2. Update Data ---
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            
            const addressObj = { line1: address1, line2: address2 };
            formData.append('address', JSON.stringify(addressObj));

            if (image) {
                formData.append('image', image);
            }

            const response = await axios.post(backendUrl + '/api/user/update-profile', formData, { 
                headers: { token } 
            });

            if (response.data.success) {
                toast.success("Profile Updated! Reloading...");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(response.data.message);
                setLoading(false);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchProfile()
        }
    }, [token])

    return (
        <div className='w-full p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 p-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-8 border-b pb-4'>Edit Profile</h2>
                
                <form onSubmit={onSubmitHandler} className='flex flex-col gap-8'>
                    
                    {/* --- Image Section --- */}
                    <div className='flex flex-col gap-4'>
                        <p className='text-gray-700 font-semibold'>Profile Picture</p>
                        <div className='flex flex-col md:flex-row gap-6 items-center md:items-start'>
                            <div className='relative group'>
                                <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-50'>
                                    {image ? (
                                        <img className='w-full h-full object-cover' src={URL.createObjectURL(image)} alt="New" />
                                    ) : prevImage ? (
                                        <img 
                                            className='w-full h-full object-cover' 
                                            src={getImageUrl(prevImage)} 
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                            alt="Current" 
                                        />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                {image && (
                                    <button 
                                        type="button" onClick={() => setImage(false)}
                                        className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition'
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <label htmlFor="image" className='flex-1 w-full flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-green-50 hover:border-green-300 transition group'>
                                <div className='flex flex-col items-center justify-center pt-5 pb-6 text-center'>
                                    <Upload className='w-5 h-5 text-green-500 mb-2' />
                                    <p className='text-sm text-gray-600 font-medium'>Click to upload image</p>
                                </div>
                                <input type="file" id="image" hidden accept="image/*" onChange={(e) => { if (e.target.files[0]) setImage(e.target.files[0]) }} />
                            </label>
                        </div>
                    </div>

                    {/* --- Input Fields --- */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5'>
                        <div className='md:col-span-2'>
                            <label className='block text-gray-700 text-sm font-semibold mb-2'>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 outline-none transition' placeholder="Enter full name" />
                        </div>
                        <div className='md:col-span-2'>
                            <label className='block text-gray-700 text-sm font-semibold mb-2'>Email</label>
                            <input type="email" value={email} readOnly className='w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' />
                        </div>
                        <div>
                            <label className='block text-gray-700 text-sm font-semibold mb-2'>Phone</label>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 outline-none transition' placeholder="Phone" />
                        </div>
                        <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='md:col-span-2'><label className='block text-gray-700 text-sm font-semibold mb-2'>Address</label></div>
                            <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 outline-none transition' placeholder="Address Line 1" />
                            <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 outline-none transition' placeholder="Address Line 2" />
                        </div>
                    </div>

                    <div className='flex justify-end pt-6 mt-2 border-t border-gray-100'>
                        <button type="submit" disabled={loading} className='bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2'>
                            {loading ? <><Loader2 size={18} className='animate-spin' /> Saving...</> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile