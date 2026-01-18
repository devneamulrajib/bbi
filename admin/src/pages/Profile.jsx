import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload, X, User } from 'lucide-react'

const Profile = ({ token }) => {

    const [image, setImage] = useState(false)
    const [prevImage, setPrevImage] = useState("") 
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("Admin")

    // Fetch Current Data
    const fetchProfile = async () => {
        try {
            // Note: Updated URL to match your new Admin Route
            const response = await axios.get(backendUrl + '/api/user/admin-profile', { headers: { token } })
            if (response.data.success) {
                const user = response.data.user;
                setName(user.name)
                setEmail(user.email)
                setPhone(user.phone || "") 
                setRole(user.role || "Admin")
                setPrevImage(user.image || "")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load profile")
        }
    }

    // Update Data
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('role', role);
            
            if (image) {
                formData.append('image', image);
            }

            // Note: Updated URL to match your new Admin Route
            const response = await axios.post(backendUrl + '/api/user/update-admin-profile', formData, { headers: { token } })

            if (response.data.success) {
                toast.success(response.data.message)
                fetchProfile(); // Refresh data
                setImage(false);
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            fetchProfile()
        }
    }, [token])

    return (
        <div className='w-full p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-6'>Edit Profile</h2>
                
                <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>
                    
                    {/* Image Upload Section */}
                    <div className='flex flex-col gap-4'>
                        <p className='text-gray-700 font-medium'>Profile Picture</p>
                        
                        <div className='flex items-start gap-6'>
                            {/* Preview Area */}
                            <div className='relative w-32 h-32 flex-shrink-0'>
                                {image ? (
                                    <img className='w-full h-full object-cover rounded-lg border' src={URL.createObjectURL(image)} alt="Preview" />
                                ) : prevImage ? (
                                    <img className='w-full h-full object-cover rounded-lg border' src={prevImage} alt="Current" />
                                ) : (
                                    <div className='w-full h-full bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400'>
                                        <User size={40} />
                                    </div>
                                )}
                                
                                {(image || prevImage) && (
                                    <button 
                                        type="button"
                                        onClick={() => { setImage(false); setPrevImage("") }}
                                        className='absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow border hover:bg-red-50'
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Drag & Drop Input */}
                            <label htmlFor="image" className='flex-1 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition'>
                                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                    <Upload className='w-8 h-8 text-green-500 mb-2' />
                                    <p className='text-sm text-gray-500'><span className='font-semibold'>Click to upload</span> or drag and drop</p>
                                    <p className='text-xs text-gray-400'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                            </label>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
                        <div className='md:col-span-2'>
                            <label className='block text-gray-700 text-sm font-medium mb-2'>Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition'
                                placeholder="Admin Name"
                            />
                        </div>

                        <div className='md:col-span-2'>
                            <label className='block text-gray-700 text-sm font-medium mb-2'>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition'
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className='block text-gray-700 text-sm font-medium mb-2'>Contact Number</label>
                            <input 
                                type="text" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition'
                                placeholder="+1 234 567 890"
                            />
                        </div>

                        <div>
                            <label className='block text-gray-700 text-sm font-medium mb-2'>Your Role</label>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)} 
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 outline-none bg-white'
                            >
                                <option value="Super Admin">Super Admin</option>
                                <option value="Admin">Admin</option>
                                <option value="Editor">Editor</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-end mt-6 pt-4 border-t'>
                        <button type="submit" className='bg-green-600 text-white font-medium py-2.5 px-8 rounded hover:bg-green-700 transition shadow'>
                            Update Profile
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Profile