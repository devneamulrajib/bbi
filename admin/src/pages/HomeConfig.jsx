import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Upload, Trash2, Plus, Image as ImageIcon, Loader2 } from 'lucide-react'

const HomeConfig = ({ token }) => {
    // --- 1. WEBSITE LOGO ---
    const [logoImage, setLogoImage] = useState(false);
    const [currentLogo, setCurrentLogo] = useState("");

    // --- 2. NOTIFICATION BAR ---
    const [notifyText, setNotifyText] = useState("");
    const [notifyActive, setNotifyActive] = useState(true);

    // --- 3. HERO SLIDER ---
    const [sliderInterval, setSliderInterval] = useState(5000);
    
    // Slide 1
    const [s1Text, setS1Text] = useState("");
    const [s1Link, setS1Link] = useState("");
    const [s1Image, setS1Image] = useState(false);
    const [s1Preview, setS1Preview] = useState("");
    
    // Slide 2
    const [s2Text, setS2Text] = useState("");
    const [s2Link, setS2Link] = useState("");
    const [s2Image, setS2Image] = useState(false);
    const [s2Preview, setS2Preview] = useState("");

    // Slide 3
    const [s3Text, setS3Text] = useState("");
    const [s3Link, setS3Link] = useState("");
    const [s3Image, setS3Image] = useState(false);
    const [s3Preview, setS3Preview] = useState("");

    // --- 4. HOT PRODUCT ---
    const [hotId, setHotId] = useState("");
    const [hotDate, setHotDate] = useState("");
    const [hotActive, setHotActive] = useState(true);
    const [allProducts, setAllProducts] = useState([]);

    // --- 5. TESTIMONIAL ---
    const [tName, setTName] = useState("");
    const [tRole, setTRole] = useState("");
    const [tDesc, setTDesc] = useState("");
    const [tImage, setTImage] = useState(false);

    // --- 6. BANNERS ---
    const [b1Link, setB1Link] = useState("");
    const [b1Image, setB1Image] = useState(false);
    const [b2Link, setB2Link] = useState("");
    const [b2Image, setB2Image] = useState(false);

    // --- 7. FOOTER INFO ---
    const [phone, setPhone] = useState("");
    const [playStore, setPlayStore] = useState("");
    const [appStore, setAppStore] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [tiktok, setTiktok] = useState("");

    // --- 8. DELIVERY & PROMOS ---
    const [deliveryFee, setDeliveryFee] = useState(10);
    const [freeThreshold, setFreeThreshold] = useState(200);
    const [promoCode, setPromoCode] = useState("");
    const [promoValue, setPromoValue] = useState("");
    const [promoList, setPromoList] = useState([]);

    // --- 9. UPLOAD PROGRESS STATE (NEW) ---
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const [pRes, cRes, promoRes] = await Promise.all([
                    axios.get(backendUrl + '/api/product/list'),
                    axios.get(backendUrl + '/api/config/get'),
                    axios.get(backendUrl + '/api/config/promo/list', { headers: { token } })
                ]);
                
                if(pRes.data.success) setAllProducts(pRes.data.products);
                if(promoRes.data.success) setPromoList(promoRes.data.promos);
                
                if(cRes.data.success) {
                    const c = cRes.data.config;
                    
                    // Logo
                    if(c.logo) setCurrentLogo(c.logo);

                    // Notification
                    if(c.notification) {
                        setNotifyText(c.notification.text);
                        setNotifyActive(c.notification.isActive);
                    }

                    // Slider
                    if(c.heroSlider) {
                        setSliderInterval(c.heroSlider.interval);
                        setS1Text(c.heroSlider.slide1.buttonText); setS1Link(c.heroSlider.slide1.link); setS1Preview(c.heroSlider.slide1.image);
                        setS2Text(c.heroSlider.slide2.buttonText); setS2Link(c.heroSlider.slide2.link); setS2Preview(c.heroSlider.slide2.image);
                        setS3Text(c.heroSlider.slide3.buttonText); setS3Link(c.heroSlider.slide3.link); setS3Preview(c.heroSlider.slide3.image);
                    }

                    // Hot Product
                    setHotId(c.hotProduct.productId);
                    setHotDate(c.hotProduct.endDate);
                    setHotActive(c.hotProduct.isActive);
                    
                    // Testimonial
                    setTName(c.testimonial.name); setTRole(c.testimonial.role); setTDesc(c.testimonial.desc);
                    
                    // Banners
                    setB1Link(c.banner1.link); setB2Link(c.banner2.link);
                    
                    // Footer
                    if(c.footer) {
                        setPhone(c.footer.phone); setPlayStore(c.footer.playStore); setAppStore(c.footer.appStore);
                        setFacebook(c.footer.facebook); setInstagram(c.footer.instagram); setTiktok(c.footer.tiktok);
                    }

                    // Delivery
                    if(c.delivery) {
                        setDeliveryFee(c.delivery.fee); setFreeThreshold(c.delivery.freeDeliveryThreshold);
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
            const res = await axios.post(backendUrl + '/api/config/promo/add', { code: promoCode.toUpperCase(), value: promoValue, type: 'flat' }, { headers: { token } });
            if(res.data.success) {
                toast.success("Promo Added");
                setPromoCode(""); setPromoValue("");
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

    // --- MAIN SUBMIT WITH PROGRESS ---
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProgress(0);

        try {
            const fd = new FormData();
            
            // Logo
            if(logoImage) fd.append("logo", logoImage);

            // Notification
            fd.append("notifyText", notifyText);
            fd.append("notifyActive", notifyActive);

            // Slider
            fd.append("sliderInterval", sliderInterval);
            fd.append("s1Text", s1Text); fd.append("s1Link", s1Link); if(s1Image) fd.append("s1Img", s1Image);
            fd.append("s2Text", s2Text); fd.append("s2Link", s2Link); if(s2Image) fd.append("s2Img", s2Image);
            fd.append("s3Text", s3Text); fd.append("s3Link", s3Link); if(s3Image) fd.append("s3Img", s3Image);

            // Hot Product
            fd.append("hotProductId", hotId); fd.append("hotEndDate", hotDate); fd.append("hotIsActive", hotActive);
            
            // Testimonial
            fd.append("tName", tName); fd.append("tRole", tRole); fd.append("tDesc", tDesc);
            if(tImage) fd.append("tImage", tImage);

            // Banners
            fd.append("b1Link", b1Link); if(b1Image) fd.append("b1Image", b1Image);
            fd.append("b2Link", b2Link); if(b2Image) fd.append("b2Image", b2Image);

            // Footer
            fd.append("phone", phone); fd.append("playStore", playStore); fd.append("appStore", appStore);
            fd.append("facebook", facebook); fd.append("instagram", instagram); fd.append("tiktok", tiktok);

            // Delivery
            fd.append("deliveryFee", deliveryFee); fd.append("freeDeliveryThreshold", freeThreshold);

            // POST REQUEST WITH PROGRESS EVENT
            const res = await axios.post(backendUrl + '/api/config/update', fd, { 
                headers: { token },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });
            
            if(res.data.success) {
                toast.success("All Settings Updated Successfully!");
                if(logoImage) setCurrentLogo(URL.createObjectURL(logoImage));
                setLogoImage(false); setS1Image(false); setS2Image(false); setS3Image(false);
                setTImage(false); setB1Image(false); setB2Image(false);
            }
            else toast.error(res.data.message);
        } catch(e) { 
            toast.error(e.message) 
        } finally {
            setLoading(false);
            setTimeout(() => setProgress(0), 1000);
        }
    }

    return (
        <form onSubmit={onSubmit} className='flex flex-col gap-8 pb-20 max-w-5xl'>
            
            {/* 0. WEBSITE LOGO */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Website Logo</h3>
                <div className='flex gap-6 items-center'>
                    <div className='w-40'>
                        <label htmlFor="logoUp" className='cursor-pointer'>
                            <div className='w-full h-20 border-2 border-dashed border-gray-300 flex items-center justify-center rounded bg-gray-50 hover:bg-gray-100 overflow-hidden'>
                                {logoImage ? <img src={URL.createObjectURL(logoImage)} className='h-full object-contain p-2' /> : 
                                 currentLogo ? <img src={currentLogo} className='h-full object-contain p-2' /> : 
                                 <div className='text-center text-gray-400 text-sm'><ImageIcon size={20}/><span>Upload</span></div>}
                            </div>
                            <input type="file" id="logoUp" hidden onChange={e=>setLogoImage(e.target.files[0])} />
                        </label>
                    </div>
                    <div className='text-sm text-gray-500'>
                        <p>Format: Transparent PNG</p>
                    </div>
                </div>
            </div>

            {/* 1. NOTIFICATION & SLIDER */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Top Notification & Slider</h3>
                
                {/* Notification */}
                <div className='flex gap-4 items-center mb-6 border-b pb-6'>
                    <div className='flex-1'>
                        <p className='text-sm mb-1'>Notification Text</p>
                        <input value={notifyText} onChange={e=>setNotifyText(e.target.value)} className='w-full border px-3 py-2 rounded' placeholder="e.g. Due to COVID 19..." />
                    </div>
                    <div className='flex items-center gap-2 mt-5'>
                        <input type="checkbox" checked={notifyActive} onChange={()=>setNotifyActive(p=>!p)} id="na" className='w-4 h-4' />
                        <label htmlFor="na" className='cursor-pointer text-sm font-medium'>Visible</label>
                    </div>
                </div>

                {/* Slider Interval */}
                <div className='mb-4 flex items-center gap-4'>
                    <p className='font-bold'>Hero Slider Images</p>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-500'>Interval (ms):</span>
                        <input type="number" value={sliderInterval} onChange={e=>setSliderInterval(e.target.value)} className='border px-2 py-1 rounded w-20 text-sm'/>
                    </div>
                </div>

                {/* 3 Slides */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Slide 1 */}
                    <div className='border p-4 rounded bg-gray-50'>
                        <p className='font-bold mb-2 text-sm'>Slide 1</p>
                        <label htmlFor="s1"><div className='w-full h-24 border-dashed border-2 flex items-center justify-center cursor-pointer mb-2 bg-white rounded overflow-hidden'>
                            {s1Image ? <img src={URL.createObjectURL(s1Image)} className='w-full h-full object-cover'/> : 
                             s1Preview ? <img src={s1Preview} className='w-full h-full object-cover'/> : "Upload"}
                        </div><input type="file" id="s1" hidden onChange={e=>setS1Image(e.target.files[0])}/></label>
                        <input value={s1Text} onChange={e=>setS1Text(e.target.value)} placeholder="Button Text" className='w-full border px-2 py-1 mb-2 text-sm rounded'/>
                        <input value={s1Link} onChange={e=>setS1Link(e.target.value)} placeholder="Link (e.g. /shop)" className='w-full border px-2 py-1 text-sm rounded'/>
                    </div>
                    {/* Slide 2 */}
                    <div className='border p-4 rounded bg-gray-50'>
                        <p className='font-bold mb-2 text-sm'>Slide 2</p>
                        <label htmlFor="s2"><div className='w-full h-24 border-dashed border-2 flex items-center justify-center cursor-pointer mb-2 bg-white rounded overflow-hidden'>
                            {s2Image ? <img src={URL.createObjectURL(s2Image)} className='w-full h-full object-cover'/> : 
                             s2Preview ? <img src={s2Preview} className='w-full h-full object-cover'/> : "Upload"}
                        </div><input type="file" id="s2" hidden onChange={e=>setS2Image(e.target.files[0])}/></label>
                        <input value={s2Text} onChange={e=>setS2Text(e.target.value)} placeholder="Button Text" className='w-full border px-2 py-1 mb-2 text-sm rounded'/>
                        <input value={s2Link} onChange={e=>setS2Link(e.target.value)} placeholder="Link" className='w-full border px-2 py-1 text-sm rounded'/>
                    </div>
                    {/* Slide 3 */}
                    <div className='border p-4 rounded bg-gray-50'>
                        <p className='font-bold mb-2 text-sm'>Slide 3</p>
                        <label htmlFor="s3"><div className='w-full h-24 border-dashed border-2 flex items-center justify-center cursor-pointer mb-2 bg-white rounded overflow-hidden'>
                            {s3Image ? <img src={URL.createObjectURL(s3Image)} className='w-full h-full object-cover'/> : 
                             s3Preview ? <img src={s3Preview} className='w-full h-full object-cover'/> : "Upload"}
                        </div><input type="file" id="s3" hidden onChange={e=>setS3Image(e.target.files[0])}/></label>
                        <input value={s3Text} onChange={e=>setS3Text(e.target.value)} placeholder="Button Text" className='w-full border px-2 py-1 mb-2 text-sm rounded'/>
                        <input value={s3Link} onChange={e=>setS3Link(e.target.value)} placeholder="Link" className='w-full border px-2 py-1 text-sm rounded'/>
                    </div>
                </div>
            </div>

            {/* 2. HOT PRODUCT */}
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
                    <div className='flex items-end mb-2'><input type="checkbox" checked={hotActive} onChange={()=>setHotActive(p=>!p)} id="ha" className='w-4 h-4'/><label htmlFor="ha" className='ml-2 cursor-pointer'>Show</label></div>
                </div>
            </div>

            {/* 3. DELIVERY & PROMOS */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Delivery & Offers</h3>
                <div className='flex gap-4 mb-6 border-b pb-6'>
                    <div className='flex-1'><p className='text-sm mb-1'>Flat Delivery Fee ($)</p><input type="number" value={deliveryFee} onChange={e=>setDeliveryFee(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                    <div className='flex-1'><p className='text-sm mb-1'>Free Delivery Over ($)</p><input type="number" value={freeThreshold} onChange={e=>setFreeThreshold(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                </div>
                <div>
                    <p className='font-bold mb-3 text-gray-700'>Manage Promo Codes</p>
                    <div className='flex gap-2 mb-4'>
                        <input value={promoCode} onChange={e=>setPromoCode(e.target.value)} placeholder="Code" className='border px-3 py-2 rounded uppercase w-48'/>
                        <input type="number" value={promoValue} onChange={e=>setPromoValue(e.target.value)} placeholder="Value ($)" className='border px-3 py-2 rounded w-32'/>
                        <button type="button" onClick={addPromoHandler} className='bg-green-600 text-white px-4 rounded flex items-center gap-1 hover:bg-green-700'><Plus size={16}/> Add</button>
                    </div>
                    <div className='flex flex-wrap gap-3'>
                        {promoList.map((p,i) => (
                            <div key={i} className='bg-gray-50 border px-4 py-2 rounded flex items-center gap-3 shadow-sm'>
                                <span className='font-bold tracking-wide'>{p.code}</span><span className='text-green-600 font-medium'>-${p.value}</span>
                                <button type="button" onClick={()=>deletePromo(p._id)} className='text-red-400 hover:text-red-600'><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. TESTIMONIAL */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Customer Comment</h3>
                <div className='flex gap-4'>
                    <div className='w-20'><p className='mb-1 text-sm'>Photo</p><label htmlFor="ti"><div className='w-16 h-16 border-dashed border-2 flex items-center justify-center cursor-pointer rounded bg-gray-50'>{tImage ? "Set" : <Upload size={20} className='text-gray-400'/>}</div><input type="file" id="ti" hidden onChange={e=>setTImage(e.target.files[0])}/></label></div>
                    <div className='flex-1'><p className='mb-1 text-sm'>Customer Name</p><input value={tName} onChange={e=>setTName(e.target.value)} className='w-full border px-3 py-2 rounded mb-2'/><p className='mb-1 text-sm'>Role</p><input value={tRole} onChange={e=>setTRole(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                </div>
                <div className='mt-2'><p className='mb-1 text-sm'>Comment</p><textarea value={tDesc} onChange={e=>setTDesc(e.target.value)} className='w-full border px-3 py-2 rounded h-20'/></div>
            </div>

            {/* 5. FOOTER */}
            <div className='bg-white p-6 rounded shadow'>
                <h3 className='font-bold mb-4 text-lg'>Footer Information</h3>
                <div className='flex flex-col gap-4'>
                    <div><p className='mb-1 text-sm'>Phone</p><input value={phone} onChange={e=>setPhone(e.target.value)} className='w-full border px-3 py-2 rounded'/></div>
                    <div className='flex gap-4'><div className='flex-1'><p className='mb-1 text-sm'>Play Store</p><input value={playStore} onChange={e=>setPlayStore(e.target.value)} className='w-full border px-3 py-2 rounded'/></div><div className='flex-1'><p className='mb-1 text-sm'>App Store</p><input value={appStore} onChange={e=>setAppStore(e.target.value)} className='w-full border px-3 py-2 rounded'/></div></div>
                    <div className='flex gap-4'><div className='flex-1'><p className='mb-1 text-sm'>Facebook</p><input value={facebook} onChange={e=>setFacebook(e.target.value)} className='w-full border px-3 py-2 rounded'/></div><div className='flex-1'><p className='mb-1 text-sm'>Instagram</p><input value={instagram} onChange={e=>setInstagram(e.target.value)} className='w-full border px-3 py-2 rounded'/></div><div className='flex-1'><p className='mb-1 text-sm'>TikTok</p><input value={tiktok} onChange={e=>setTiktok(e.target.value)} className='w-full border px-3 py-2 rounded'/></div></div>
                </div>
            </div>

            {/* 6. BANNERS */}
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

            {/* PROGRESS BAR & SAVE BUTTON */}
            <div className='sticky bottom-4 z-50 bg-white p-4 border rounded shadow-lg flex items-center justify-between gap-6 w-full max-w-5xl'>
                {loading ? (
                    <div className='flex-1'>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-blue-700">Uploading Changes...</span>
                            <span className="text-sm font-medium text-blue-700">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.2s ease' }}></div>
                        </div>
                    </div>
                ) : (
                    <p className='text-gray-500 text-sm'>Review all changes before saving.</p>
                )}

                <button type='submit' disabled={loading} className={`px-8 py-3 rounded font-bold text-white transition flex items-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {loading ? <><Loader2 className="animate-spin" size={20}/> Saving...</> : 'SAVE ALL SETTINGS'}
                </button>
            </div>
        </form>
    )
}
export default HomeConfig