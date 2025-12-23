import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload, Link as LinkIcon } from 'lucide-react'

const Poster = ({ token }) => {
    const [image, setImage] = useState(false)
    const [preview, setPreview] = useState("")
    const [redirectUrl, setRedirectUrl] = useState("")

    // Fetch existing data
    useEffect(() => {
        const fetchPoster = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/feature/get')
                if (response.data.success && response.data.feature) {
                    setPreview(response.data.feature.image);
                    setRedirectUrl(response.data.feature.redirectUrl);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchPoster();
    }, [])

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("redirectUrl", redirectUrl);
            image && formData.append("image", image);

            const response = await axios.post(backendUrl + '/api/feature/update', formData, { headers: { token } });

            if (response.data.success) {
                toast.success(response.data.message);
                if(image) setPreview(URL.createObjectURL(image));
                setImage(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='max-w-lg'>
            <h2 className='text-xl font-bold mb-4'>Manage Side Banner</h2>
            <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 bg-white p-8 rounded-lg shadow-sm border'>
                
                <div>
                    <p className='mb-2 font-medium text-gray-700'>Banner Image</p>
                    <p className='text-xs text-gray-400 mb-2'>Recommended Size: 400px x 600px (Portrait)</p>
                    <label htmlFor="posterImg">
                        <div className='w-full h-80 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition rounded-lg overflow-hidden relative'>
                            {image ? <img src={URL.createObjectURL(image)} className='w-full h-full object-cover' /> : 
                             preview ? <img src={preview} className='w-full h-full object-cover' /> : 
                             <div className='text-center text-gray-400 flex flex-col items-center gap-2'>
                                <Upload size={32}/>
                                <span>Click to Upload</span>
                             </div>}
                        </div>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="posterImg" hidden />
                    </label>
                </div>

                <div>
                    <p className='mb-2 font-medium text-gray-700'>Redirect Link</p>
                    <div className='flex items-center border border-gray-300 rounded overflow-hidden'>
                        <div className='bg-gray-100 px-3 py-2 border-r border-gray-300 text-gray-500'>
                            <LinkIcon size={18} />
                        </div>
                        <input 
                            value={redirectUrl} 
                            onChange={(e)=>setRedirectUrl(e.target.value)} 
                            type="text" 
                            className='w-full px-3 py-2 outline-none' 
                            placeholder='/category/fruit OR https://google.com' 
                        />
                    </div>
                    <p className='text-xs text-gray-400 mt-1'>Where should the user go when clicking this banner?</p>
                </div>

                <button type="submit" className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded shadow-md transition'>UPDATE BANNER</button>
            </form>
        </div>
    )
}
export default Poster