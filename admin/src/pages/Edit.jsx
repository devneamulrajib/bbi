import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload } from 'lucide-react'

const Edit = ({ token }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const productId = location.state?.id; // Passed from List page

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
    
    // Existing Data
    const [prevImages, setPrevImages] = useState([]);

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
                    setName(p.name); setDescription(p.description); setPrice(p.price);
                    setOldPrice(p.oldPrice || ""); setDiscount(p.discount || "");
                    setRating(p.rating || 0); setInStock(p.inStock);
                    setCategory(p.category); setSizes(p.sizes);
                    setPrevImages(p.image);
                }
            } catch(e) { toast.error(e.message) }
        }
        fetchProduct();
    }, [productId])

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

            // Only append image if new one is selected (Simple update logic)
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

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 bg-white p-6 rounded shadow'>
            <p className='font-bold text-xl'>Edit Product</p>
            
            <div className='flex gap-4'>
                <div className='flex flex-col gap-2'>
                    <p>Current Image (Primary)</p>
                    <img src={prevImages[0]} className='w-20 h-20 object-cover border' />
                </div>
                <div>
                    <p>New Image (Optional)</p>
                    <label htmlFor="img1"><div className='w-20 h-20 border-2 border-dashed flex items-center justify-center cursor-pointer bg-slate-50'>{image1 ? <img className='w-full h-full object-cover' src={URL.createObjectURL(image1)} /> : <Upload />}</div><input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="img1" hidden/></label>
                </div>
            </div>

            <div className='w-full'><p>Name</p><input onChange={(e)=>setName(e.target.value)} value={name} className='w-full border px-3 py-2 rounded' /></div>
            <div className='w-full'><p>Description</p><textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full border px-3 py-2 rounded h-24' /></div>
            
            <div className='flex gap-4'>
                 <div><p>Price</p><input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-24 border px-3 py-2 rounded' /></div>
                 <div><p>Old Price</p><input onChange={(e)=>setOldPrice(e.target.value)} value={oldPrice} className='w-24 border px-3 py-2 rounded' /></div>
                 <div><p>Discount</p><input onChange={(e)=>setDiscount(e.target.value)} value={discount} className='w-20 border px-3 py-2 rounded' /></div>
            </div>

            <div className='flex gap-4 items-center'>
                 <div className='flex items-center gap-2'><input checked={inStock} onChange={()=>setInStock(p=>!p)} type="checkbox" id="stock"/><label htmlFor="stock">In Stock</label></div>
            </div>

            <button type='submit' className='bg-black text-white px-8 py-2 rounded'>UPDATE</button>
        </form>
    )
}
export default Edit