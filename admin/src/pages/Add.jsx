import React, { useState, useEffect } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
    // Image States
    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    // Basic Details
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    
    // Pricing & Stats
    const [price, setPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [rating, setRating] = useState("0");
    const [inStock, setInStock] = useState(true);

    // Category Logic
    const [catList, setCatList] = useState([]);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [currentSubCats, setCurrentSubCats] = useState([]);

    // Flags
    const [bestseller, setBestseller] = useState(false);
    const [trending, setTrending] = useState(false);
    const [newArrival, setNewArrival] = useState(false);
    
    // Sizes
    const [sizes, setSizes] = useState([]);

    // LOADING & PROGRESS STATES
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // 1. Fetch Categories on Load
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/category/list')
                if(response.data.success && response.data.categories.length > 0) {
                    setCatList(response.data.categories)
                    setCategory(response.data.categories[0].name)
                    setCurrentSubCats(response.data.categories[0].subCategories)
                }
            } catch (error) { toast.error(error.message) }
        }
        fetchCategories()
    }, [])

    // 2. Update Subcategories when Category changes
    useEffect(() => {
        if(catList.length > 0) {
            const selectedCat = catList.find(c => c.name === category);
            if(selectedCat) {
                setCurrentSubCats(selectedCat.subCategories);
                setSubCategory(""); // Reset subcategory
            }
        }
    }, [category, catList])

    // 3. Submit Handler
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProgress(0);

        try {
            const formData = new FormData()
            
            // Basic Info
            formData.append("name", name)
            formData.append("description", description)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            
            // Pricing & Stats
            formData.append("price", price)
            formData.append("oldPrice", oldPrice)
            formData.append("discount", discount)
            formData.append("rating", rating)
            formData.append("inStock", inStock)
            
            // Flags
            formData.append("bestseller", bestseller)
            formData.append("trending", trending)
            formData.append("newArrival", newArrival)
            
            // Arrays & Objects
            formData.append("sizes", JSON.stringify(sizes))

            // Images
            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            // AXIOS WITH PROGRESS TRACKING
            const response = await axios.post(backendUrl + "/api/product/add", formData, { 
                headers: { token },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            })
            
            if (response.data.success) {
                toast.success(response.data.message)
                // Reset Form
                setName(''); setDescription(''); 
                setPrice(''); setOldPrice(''); setDiscount(''); setRating('0');
                setImage1(false); setImage2(false); setImage3(false); setImage4(false);
                setBestseller(false); setTrending(false); setNewArrival(false); setInStock(true);
                setSizes([]);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) { 
            toast.error(error.message) 
        } finally {
            setLoading(false);
            setTimeout(() => setProgress(0), 1000); // Reset progress bar after 1s
        }
    }
    
    // Toggle Size Selection
    const toggleSize = (size) => {
        setSizes(prev => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 pb-8 bg-white p-6 rounded shadow-sm border'>
            <p className='font-bold text-xl text-gray-700'>Add New Product</p>
            
            {/* Images */}
            <div>
                <p className='mb-2 text-gray-600'>Upload Images (Max 4)</p>
                <div className='flex gap-2'>
                    <label htmlFor="image1"><div className='w-24 h-24 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 rounded transition'>{image1 ? <img className='w-full h-full object-cover rounded' src={URL.createObjectURL(image1)} /> : <Upload className='text-gray-400' />}</div><input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/></label>
                    <label htmlFor="image2"><div className='w-24 h-24 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 rounded transition'>{image2 ? <img className='w-full h-full object-cover rounded' src={URL.createObjectURL(image2)} /> : <Upload className='text-gray-400' />}</div><input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/></label>
                    <label htmlFor="image3"><div className='w-24 h-24 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 rounded transition'>{image3 ? <img className='w-full h-full object-cover rounded' src={URL.createObjectURL(image3)} /> : <Upload className='text-gray-400' />}</div><input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/></label>
                    <label htmlFor="image4"><div className='w-24 h-24 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 rounded transition'>{image4 ? <img className='w-full h-full object-cover rounded' src={URL.createObjectURL(image4)} /> : <Upload className='text-gray-400' />}</div><input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/></label>
                </div>
            </div>

            {/* Basic Info */}
            <div className='w-full'>
                <p className='mb-2 text-gray-600'>Product Name</p>
                <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[600px] px-3 py-2 border rounded focus:outline-blue-500' type="text" placeholder='e.g. Organic Bananas' required />
            </div>
            <div className='w-full'>
                <p className='mb-2 text-gray-600'>Description</p>
                <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[600px] px-3 py-2 border rounded focus:outline-blue-500 min-h-[100px]' placeholder='Write content here' required />
            </div>

            {/* Category */}
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-[600px]'>
                <div className='flex-1'>
                    <p className='mb-2 text-gray-600'>Category</p>
                    <select onChange={(e)=>setCategory(e.target.value)} value={category} className='w-full px-3 py-2 border rounded bg-white'>
                        {catList.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                <div className='flex-1'>
                    <p className='mb-2 text-gray-600'>Sub Category</p>
                    <select onChange={(e)=>setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border rounded bg-white'>
                        <option value="">-- None --</option>
                        {currentSubCats.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            {/* Pricing Info */}
            <div className='w-full max-w-[800px]'>
                <p className='mb-2 text-gray-600 font-medium'>Pricing & Specifications</p>
                <div className='flex flex-wrap gap-4'>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Sale Price (BDT)</p>
                        <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-32 px-3 py-2 border rounded' type="number" placeholder='20' required />
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Old Price (BDT)</p>
                        <input onChange={(e)=>setOldPrice(e.target.value)} value={oldPrice} className='w-32 px-3 py-2 border rounded' type="number" placeholder='25' />
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Discount (%)</p>
                        <input onChange={(e)=>setDiscount(e.target.value)} value={discount} className='w-24 px-3 py-2 border rounded' type="number" placeholder='10' />
                    </div>
                    <div>
                        <p className='text-xs text-gray-500 mb-1'>Rating (0-5)</p>
                        <input onChange={(e)=>setRating(e.target.value)} value={rating} className='w-24 px-3 py-2 border rounded' type="number" max="5" min="0" step="0.1" />
                    </div>
                </div>
            </div>

            {/* Status Flags */}
            <div className='w-full max-w-[800px]'>
                <p className='mb-2 text-gray-600 font-medium'>Product Status</p>
                <div className='flex flex-wrap gap-4'>
                    <div className='flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 cursor-pointer' onClick={()=>setBestseller(p=>!p)}>
                        <input checked={bestseller} type="checkbox" id="bs" readOnly className='pointer-events-none' />
                        <label className='cursor-pointer font-medium text-sm'>Best Seller</label>
                    </div>
                    <div className='flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 cursor-pointer' onClick={()=>setTrending(p=>!p)}>
                        <input checked={trending} type="checkbox" id="tr" readOnly className='pointer-events-none' />
                        <label className='cursor-pointer font-medium text-sm'>Trending</label>
                    </div>
                    <div className='flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 cursor-pointer' onClick={()=>setNewArrival(p=>!p)}>
                        <input checked={newArrival} type="checkbox" id="nr" readOnly className='pointer-events-none' />
                        <label className='cursor-pointer font-medium text-sm'>New Arrival</label>
                    </div>
                    <div className='flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 cursor-pointer' onClick={()=>setInStock(p=>!p)}>
                        <input checked={inStock} type="checkbox" id="st" readOnly className='pointer-events-none' />
                        <label className={`cursor-pointer font-medium text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {inStock ? "In Stock" : "Out of Stock"}
                        </label>
                    </div>
                </div>
            </div>

            {/* Sizes */}
            <div>
                <p className='mb-2 text-gray-600'>Available Sizes</p>
                <div className='flex gap-3'>
                    {['S','M','L','XL','XXL','1kg','500g','Packet'].map((item, i) => (
                        <div key={i} onClick={()=>toggleSize(item)}>
                            <p className={`${sizes.includes(item) ? "bg-blue-100 border-blue-500 text-blue-700" : "bg-gray-100 border-transparent text-gray-600"} px-3 py-1 cursor-pointer border rounded text-sm transition`}>
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* PROGRESS BAR & BUTTON */}
            <div className='w-full max-w-[200px] mt-4'>
                {loading && (
                    <div className='mb-2'>
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-blue-700">Uploading...</span>
                            <span className="text-xs font-medium text-blue-700">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.2s ease-in-out' }}></div>
                        </div>
                    </div>
                )}
                
                <button type="submit" disabled={loading} className={`w-full py-3 rounded font-bold transition flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>
                    {loading ? <><Loader2 className="animate-spin" size={20}/> Processing</> : 'ADD PRODUCT'}
                </button>
            </div>
        </form>
    )
}
export default Add