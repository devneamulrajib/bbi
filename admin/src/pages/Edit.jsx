import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload, XCircle, Star } from 'lucide-react'

const Edit = ({ token }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const productId = location.state?.id; // Passed from List page

    // Product Data States
    const [image1, setImage1] = useState(false)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [rating, setRating] = useState("0");
    const [inStock, setInStock] = useState(true);
    const [category, setCategory] = useState("");
    const [sizes, setSizes] = useState([]);
    
    // Existing Data & Reviews
    const [prevImages, setPrevImages] = useState([]);
    const [reviews, setReviews] = useState([]); // <--- NEW: Store Reviews

    useEffect(() => {
        if(!productId) {
            toast.error("Invalid Product");
            navigate('/list');
            return;
        }
        const fetchProduct = async () => {
            try {
                const response = await axios.post(backendUrl + '/api/product/single', { productId });
                if(response.data.success) {
                    const p = response.data.product;
                    setName(p.name); 
                    setDescription(p.description); 
                    setPrice(p.price);
                    setOldPrice(p.oldPrice || ""); 
                    setDiscount(p.discount || "");
                    setRating(p.rating || 0); 
                    setInStock(p.inStock);
                    setCategory(p.category); 
                    setSizes(p.sizes);
                    setPrevImages(p.image);
                    setReviews(p.reviews || []); // <--- Load Reviews
                }
            } catch(e) { toast.error(e.message) }
        }
        fetchProduct();
    }, [productId])

    // --- MAIN PRODUCT UPDATE ---
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("id", productId);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("oldPrice", oldPrice);
            formData.append("discount", discount);
            formData.append("rating", rating);
            formData.append("inStock", inStock);
            formData.append("sizes", JSON.stringify(sizes));

            if(image1) formData.append("image1", image1);

            const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Product Updated");
                navigate('/list');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) { toast.error(error.message); }
    }

    // --- DELETE REVIEW HANDLER ---
    const deleteReview = async (index) => {
        if(!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await axios.post(backendUrl + '/api/product/review/delete', 
                { productId, reviewIndex: index }, 
                { headers: { token } }
            );
            if(res.data.success) {
                toast.success("Review Deleted");
                // Remove from local state immediately
                setReviews(prev => prev.filter((_, i) => i !== index));
            } else {
                toast.error(res.data.message);
            }
        } catch(e) { toast.error(e.message) }
    }

    return (
        <div className='w-full bg-white p-6 rounded shadow'>
            <p className='font-bold text-xl mb-6'>Edit Product</p>
            
            <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4'>
                <div className='flex gap-4'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm text-gray-600'>Current Image</p>
                        <img src={prevImages[0]} className='w-20 h-20 object-cover border rounded' />
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Update Image</p>
                        <label htmlFor="img1"><div className='w-20 h-20 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50 rounded hover:bg-slate-100 transition'>{image1 ? <img className='w-full h-full object-cover rounded' src={URL.createObjectURL(image1)} /> : <Upload className='text-gray-400'/>}</div><input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="img1" hidden/></label>
                    </div>
                </div>

                <div className='w-full'><p className='mb-1'>Product Name</p><input onChange={(e)=>setName(e.target.value)} value={name} className='w-full border px-3 py-2 rounded' /></div>
                <div className='w-full'><p className='mb-1'>Description</p><textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full border px-3 py-2 rounded h-24' /></div>
                
                <div className='flex gap-4'>
                    <div><p className='mb-1'>Price</p><input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-24 border px-3 py-2 rounded' /></div>
                    <div><p className='mb-1'>Old Price</p><input onChange={(e)=>setOldPrice(e.target.value)} value={oldPrice} className='w-24 border px-3 py-2 rounded' /></div>
                    <div><p className='mb-1'>Discount %</p><input onChange={(e)=>setDiscount(e.target.value)} value={discount} className='w-20 border px-3 py-2 rounded' /></div>
                </div>

                <div className='flex gap-4 items-center mt-2'>
                    <div className='flex items-center gap-2 cursor-pointer' onClick={()=>setInStock(p=>!p)}>
                        <input checked={inStock} type="checkbox" readOnly className='pointer-events-none'/>
                        <label className='cursor-pointer'>In Stock</label>
                    </div>
                </div>

                <button type='submit' className='bg-black text-white px-8 py-2 rounded hover:bg-gray-800 transition'>UPDATE DETAILS</button>
            </form>

            {/* --- REVIEW MANAGEMENT SECTION --- */}
            <div className='w-full border-t pt-6 mt-8'>
                <h3 className='font-bold text-lg mb-4 text-gray-800'>Customer Reviews ({reviews.length})</h3>
                
                {reviews.length === 0 ? (
                    <p className='text-gray-400 italic text-sm'>No reviews available for this product.</p>
                ) : (
                    <div className='grid gap-3'>
                        {reviews.map((rev, i) => (
                            <div key={i} className='border p-4 rounded-lg bg-gray-50 flex justify-between items-start hover:bg-gray-100 transition'>
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <span className='font-bold text-sm text-gray-900'>{rev.userName}</span>
                                        <span className='flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-bold'>
                                            {rev.rating} <Star size={10} fill="currentColor" />
                                        </span>
                                        <span className='text-xs text-gray-400'>• {new Date(rev.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className='text-sm text-gray-600 leading-relaxed'>{rev.comment}</p>
                                </div>
                                <button 
                                    onClick={()=>deleteReview(i)} 
                                    className='text-gray-400 hover:text-red-600 transition p-1'
                                    title="Delete Review"
                                >
                                    <XCircle size={20}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default Edit