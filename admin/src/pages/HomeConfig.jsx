import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react'

const HomeConfig = ({ token }) => {
    // Logo State (NEW)
    const [logoImage, setLogoImage] = useState(false);
    const [currentLogo, setCurrentLogo] = useState("");

    // Hot Product
    const [hotId, setHotId] = useState("");
    const [hotDate, setHotDate] = useState("");
    const [hotActive, setHotActive] = useState(true);
    const [allProducts, setAllProducts] = useState([]);

    // Testimonial
    const [tName, setTName] = useState("");
    const [tRole, setTRole] = useState("");
    const [tDesc, setTDesc] = useState("");
    const [tImage, setTImage] = useState(false);

    // Banners
    const [b1Link, setB1Link] = useState("");
    const [b1Image, setB1Image] = useState(false);
    const [b2Link, setB2Link] = useState("");
    const [b2Image, setB2Image] = useState(false);

    // Footer Information
    const [phone, setPhone] = useState("");
    const [playStore, setPlayStore] = useState("");
    const [appStore, setAppStore] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [tiktok, setTiktok] = useState("");

    // Delivery & Promos
    const [deliveryFee, setDeliveryFee] = useState(10);
    const [freeThreshold, setFreeThreshold] = useState(200);
    const [promoCode, setPromoCode] = useState("");
    const [promoValue, setPromoValue] = useState("");
    const [promoList, setPromoList] = useState([]);

    // Fetch Initial Data
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Fetch Products, Config, and Promos
                const [pRes, cRes, promoRes] = await Promise.all([
                    axios.get(backendUrl + '/api/product/list'),
                    axios.get(backendUrl + '/api/config/get'),
                    axios.get(backendUrl + '/api/config/promo/list', { headers: { token } })
                ]);
                
                if(pRes.data.success) setAllProducts(pRes.data.products);
                if(promoRes.data.success) setPromoList(promoRes.data.promos);
                
                if(cRes.data.success) {
                    const c = cRes.data.config;
                    
                    // Logo (NEW)
                    if(c.logo) setCurrentLogo(c.logo);

                    // Hot Product
                    setHotId(c.hotProduct.productId);
                    setHotDate(c.hotProduct.endDate);
                    setHotActive(c.hotProduct.isActive);
                    
                    // Testimonial
                    setTName(c.testimonial.name);
                    setTRole(c.testimonial.role);
                    setTDesc(c.testimonial.desc);
                    
                    // Banners
                    setB1Link(c.banner1.link);
                    setB2Link(c.banner2.link);
                    
                    // Footer
                    if(c.footer) {
                        setPhone(c.footer.phone);
                        setPlayStore(c.footer.playStore);
                        setAppStore(c.footer.appStore);
                        setFacebook(c.footer.facebook);
                        setInstagram(c.footer.instagram);
                        setTiktok(c.footer.tiktok);
                    }

                    // Delivery
                    if(c.delivery) {
                        setDeliveryFee(c.delivery.fee);
                        setFreeThreshold(c.delivery.freeDeliveryThreshold);
                    }
                }
            } catch(e) { console.error(e) }
        }
        fetchConfig();
    }, [token])

    // --- PROMO HANDLERS ---
    const addPromoHandler = async () => {
        if(!promoCode || !promoValue) return toast.error("Enter Code and Value");
        try {
            const res = await axios.post(backendUrl + '/api/config/promo/add', 
                { code: promoCode.toUpperCase(), value: promoValue, type: 'flat' }, 
                { headers: { token } }
            );
            if(res.data.success) {
                toast.success("Promo Added");
                setPromoCode(""); setPromoValue("");
                // Refresh list
                const promoRes = await axios.get(backendUrl + '/api/config/promo/list', { headers: { token } });
                if(promoRes.data.success) setPromoList(promoRes.data.promos);
            } else toast.error(res.data.message);
        } catch(e) { toast.error(e.message) }
    }

    const deletePromo = async (id) => {
        try {
            await axios.post(backendUrl + '/api/config/promo/delete', { id }, { headers: { token } });
            toast.success("Deleted");
            setPromoList(prev => prev.filter(p => p._id !== id));
        } catch(e) { toast.error(e.message) }
    }

    // --- MAIN SUBMIT ---
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            
            // Logo (NEW)
            if(logoImage) fd.append("logo", logoImage);

            // Hot Product
            fd.append("hotProductId", hotId);
            fd.append("hotEndDate", hotDate);
            fd.append("hotIsActive", hotActive);
            
            // Testimonial
            fd.append("tName", tName); fd.append("tRole", tRole); fd.append("tDesc", tDesc);
            if(tImage) fd.append("tImage", tImage);

            // Banners
            fd.append("b1Link", b1Link); if(b1Image) fd.append("b1Image", b1Image);
            fd.append("b2Link", b2Link); if(b2Image) fd.append("b2Image", b2Image);

            // Footer
            fd.append("phone", phone);
            fd.append("playStore", playStore);
            fd.append("appStore", appStore);
            fd.append("facebook", facebook);
            fd.append("instagram", instagram);
            fd.append("tiktok", tiktok);

            // Delivery
            fd.append("deliveryFee", deliveryFee);
            fd.append("freeDeliveryThreshold", freeThreshold);

            const res = await axios.post(backendUrl + '/api/config/update', fd, { headers: { token } });
            
            if(res.data.success) {
                toast.success("Settings & Logo Updated!");
                if(logoImage) setCurrentLogo(URL.createObjectURL(logoImage)); // Update preview
                setLogoImage(false); // Reset file input
            }
            else toast.error(res.data.message);
        } catch(e) { toast.error(e.message) }
    }

    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-8 pb-10 max-w-4xl'>
            
            {/* 0. WEBSITE LOGO (NEW) */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Website Logo</h3>
                <div className='flex gap-6 items-center'>
                    <div className='w-40'>
                        <label htmlFor="logoUp" className='cursor-pointer'>
                            <div className='w-full h-20 border-2 border-dashed border-gray-300 flex items-center justify-center rounded bg-gray-50 hover:bg-gray-100 overflow-hidden relative'>
                                {logoImage ? (
                                    <img src={URL.createObjectURL(logoImage)} className='h-full object-contain p-2' />
                                ) : currentLogo ? (
                                    <img src={currentLogo} className='h-full object-contain p-2' />
                                ) : (
                                    <div className='text-center text-gray-400 text-sm flex flex-col items-center gap-1'>
                                        <ImageIcon size={20}/>
                                        <span>Upload</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" id="logoUp" hidden onChange={e=>setLogoImage(e.target.files[0])} />
                        </label>
                    </div>
                    <div className='text-sm text-gray-500'>
                        <p>Recommended Size: approx 150x50px</p>
                        <p>Format: Transparent PNG</p>
                    </div>
                </div>
            </div>

            {/* 1. HOT PRODUCT */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Hot Product of the Week</h3>
                <div className='flex gap-4 flex-wrap'>
                    <div className='flex-1 min-w-[200px]'>
                        <p className='mb-1 text-sm'>Select Product</p>
                        <select value={hotId} onChange={e=>setHotId(e.target.value)} className='w-full border px-3 py-2 rounded'>
                            <option value="">-- Select --</option>
                            {allProducts.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div><p className='mb-1 text-sm'>End Date</p><input type="date" value={hotDate} onChange={e=>setHotDate(e.target.value)} className='border px-3 py-2 rounded'/></div>
                    <div className='flex items-end mb-2'><input type="checkbox" checked={hotActive} onChange={()=>setHotActive(p=>!p)} id="ha"/><label htmlFor="ha" className='ml-2 cursor-pointer'>Show Section</label></div>
                </div>
            </div>

            {/* 2. DELIVERY & PROMOS */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Delivery & Offers</h3>
                
                {/* Delivery Fees */}
                <div className='flex gap-4 mb-6 border-b pb-6'>
                    <div className='flex-1'>
                        <p className='text-sm mb-1'>Flat Delivery Fee ($)</p>
                        <input type="number" value={deliveryFee} onChange={e=>setDeliveryFee(e.target.value)} className='w-full border px-3 py-2 rounded'/>
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm mb-1'>Free Delivery Over ($)</p>
                        <input type="number" value={freeThreshold} onChange={e=>setFreeThreshold(e.target.value)} className='w-full border px-3 py-2 rounded'/>
                    </div>
                </div>

                {/* Promo Codes */}
                <div>
                    <p className='font-bold mb-3 text-gray-700'>Manage Promo Codes</p>
                    <div className='flex gap-2 mb-4'>
                        <input value={promoCode} onChange={e=>setPromoCode(e.target.value)} placeholder="Code (e.g. SUMMER10)" className='border px-3 py-2 rounded uppercase w-48'/>
                        <input type="number" value={promoValue} onChange={e=>setPromoValue(e.target.value)} placeholder="Discount ($)" className='border px-3 py-2 rounded w-32'/>
                        <button type="button" onClick={addPromoHandler} className='bg-green-600 text-white px-4 rounded flex items-center gap-1 hover:bg-green-700'><Plus size={16}/> Add</button>
                    </div>
                    
                    <div className='flex flex-wrap gap-3'>
                        {promoList.map((p,i) => (
                            <div key={i} className='bg-gray-50 border px-4 py-2 rounded flex items-center gap-3 shadow-sm'>
                                <span className='font-bold tracking-wide'>{p.code}</span>
                                <span className='text-green-600 font-medium'>-${p.value}</span>
                                <button type="button" onClick={()=>deletePromo(p._id)} className='text-red-400 hover:text-red-600'><Trash2 size={16}/></button>
                            </div>
                        ))}
                        {promoList.length === 0 && <p className='text-sm text-gray-400 italic'>No active promo codes.</p>}
                    </div>
                </div>
            </div>

            {/* 3. TESTIMONIAL */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Customer Comment</h3>
                <div className='flex gap-4'>
                    <div className='w-20'><p className='mb-1 text-sm'>Photo</p><label htmlFor="ti"><div className='w-16 h-16 border-dashed border-2 flex items-center justify-center cursor-pointer rounded bg-gray-50'>{tImage ? "Set" : <Upload size={20} className='text-gray-400'/>}</div><input type="file" id="ti" hidden onChange={e=>setTImage(e.target.files[0])}/></label></div>
                    <div className='flex-1'><p className='mb-1 text-sm'>Customer Name</p><input value={tName} onChange={e=>setTName(e.target.value)} className='w-full border px-3 py-2 rounded mb-2'/><p className='mb-1 text-sm'>Role</p><input value={tRole} onChange={e=>setTRole(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                </div>
                <div className='mt-2'><p className='mb-1 text-sm'>Comment</p><textarea value={tDesc} onChange={e=>setTDesc(e.target.value)} className='w-full border px-3 py-2 rounded h-20'/></div>
            </div>

            {/* 4. BANNERS */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Home Bottom Banners</h3>
                <div className='flex gap-6'>
                    <div className='flex-1'>
                        <p className='font-bold mb-2 text-sm text-gray-600'>Left Banner</p>
                        <label htmlFor="b1"><div className='w-full h-32 border-dashed border-2 flex items-center justify-center cursor-pointer mb-2 bg-gray-50 rounded'>{b1Image ? "Selected" : "Upload Image"}</div><input type="file" id="b1" hidden onChange={e=>setB1Image(e.target.files[0])}/></label>
                        <input value={b1Link} onChange={e=>setB1Link(e.target.value)} placeholder='Link URL (e.g. /collection)' className='w-full border px-3 py-2 rounded'/>
                    </div>
                    <div className='flex-1'>
                        <p className='font-bold mb-2 text-sm text-gray-600'>Right Banner</p>
                        <label htmlFor="b2"><div className='w-full h-32 border-dashed border-2 flex items-center justify-center cursor-pointer mb-2 bg-gray-50 rounded'>{b2Image ? "Selected" : "Upload Image"}</div><input type="file" id="b2" hidden onChange={e=>setB2Image(e.target.files[0])}/></label>
                        <input value={b2Link} onChange={e=>setB2Link(e.target.value)} placeholder='Link URL (e.g. /collection)' className='w-full border px-3 py-2 rounded'/>
                    </div>
                </div>
            </div>

            {/* 5. FOOTER SETTINGS */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Footer Information</h3>
                <div className='flex flex-col gap-4'>
                    <div><p className='mb-1 text-sm'>Phone Number</p><input value={phone} onChange={e=>setPhone(e.target.value)} className='w-full border px-3 py-2 rounded' placeholder='8 800 555-55'/></div>
                    
                    <div className='flex gap-4'>
                        <div className='flex-1'><p className='mb-1 text-sm'>Play Store Link</p><input value={playStore} onChange={e=>setPlayStore(e.target.value)} className='w-full border px-3 py-2 rounded' placeholder='https://play.google.com...'/></div>
                        <div className='flex-1'><p className='mb-1 text-sm'>App Store Link</p><input value={appStore} onChange={e=>setAppStore(e.target.value)} className='w-full border px-3 py-2 rounded' placeholder='https://apps.apple.com...'/></div>
                    </div>
                    
                    <div className='flex gap-4'>
                        <div className='flex-1'><p className='mb-1 text-sm'>Facebook Link</p><input value={facebook} onChange={e=>setFacebook(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                        <div className='flex-1'><p className='mb-1 text-sm'>Instagram Link</p><input value={instagram} onChange={e=>setInstagram(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                        <div className='flex-1'><p className='mb-1 text-sm'>TikTok Link</p><input value={tiktok} onChange={e=>setTiktok(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                    </div>
                </div>
            </div>

            <button type='submit' className='bg-blue-600 text-white py-3 font-bold rounded hover:bg-blue-700 transition shadow-md'>
                SAVE ALL SETTINGS
            </button>
        </form>
    )
}
export default HomeConfig