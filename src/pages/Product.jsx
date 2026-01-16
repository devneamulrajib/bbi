import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Star, Heart, ShoppingCart, Truck, User, Minus, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, wishlist, addToWishlist, token, backendUrl, userData } = useContext(ShopContext);
  
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState('description');
  const [related, setRelated] = useState([]);
  
  // States
  const [quantity, setQuantity] = useState(1);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Wait until products are loaded
    if (products.length > 0) {
        const p = products.find(item => item._id === productId);
        if (p) {
            setProduct(p);
            setImage(p.image && p.image.length > 0 ? p.image[0] : "");
            
            // Set Default Size
            if (p.sizes && p.sizes.length > 0) {
                setSize(p.sizes[0]);
            } else {
                setSize("Standard");
            }

            // --- RELATED PRODUCTS LOGIC (Fixed) ---
            let rel = products.filter(item => item.category === p.category && item._id !== p._id);
            
            // If category match returns nothing, try Subcategory match
            if (rel.length === 0 && p.subCategory) {
                rel = products.filter(item => item.subCategory === p.subCategory && item._id !== p._id);
            }
            
            // Randomize slightly so it's not always the same 4
            setRelated(rel.slice(0, 4));
        }
    }
  }, [productId, products]);

  const handleMouseMove = (e) => {
      const { left, top, width, height } = e.target.getBoundingClientRect();
      const x = ((e.pageX - left) / width) * 100;
      const y = ((e.pageY - top) / height) * 100;
      setZoomPosition({ x, y });
  };

  const submitReview = async (e) => {
      e.preventDefault();
      if(!token) return toast.error("Please login to write a review");
      setSubmittingReview(true);
      try {
          const res = await axios.post(backendUrl + '/api/product/review/add', {
              productId: product._id, rating: ratingInput, comment: commentInput, userName: userData?.name || "Customer"
          }, { headers: { token } });
          if(res.data.success) { toast.success("Review Added!"); setCommentInput(""); window.location.reload(); } 
          else { toast.error(res.data.message); }
      } catch (error) { toast.error(error.message); } finally { setSubmittingReview(false); }
  }

  // --- ADD TO CART WRAPPER ---
  const handleAddToCart = () => {
      addToCart(product._id, size, quantity);
  }

  // Loading States
  if (products.length === 0) return <div className="h-screen flex items-center justify-center pt-20 text-gray-500">Loading Products...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center pt-20 text-gray-500">Product Not Found.</div>;

  const safeImages = product.image || [];
  const safeReviews = product.reviews || [];
  const safeSizes = product.sizes || [];

  return (
    <div className="container mx-auto px-4 py-8 border-t min-h-[80vh] fade-in">
        
        <div className="flex flex-col md:flex-row gap-10 mb-16">
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex gap-4">
                <div className="w-[15%] flex flex-col gap-3">
                    {safeImages.map((img, i) => (
                        <img key={i} src={img} onClick={()=>setImage(img)} className={`w-full h-20 sm:h-24 object-contain border rounded cursor-pointer hover:opacity-80 transition ${image===img ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`} alt="thumbnail"/>
                    ))}
                </div>
                <div className="w-[85%] border rounded-xl p-6 flex items-center justify-center bg-white relative overflow-hidden cursor-crosshair h-[300px] sm:h-[400px]"
                    onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    {(product.discount || 0) > 0 && <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded z-20">{product.discount}% OFF</span>}
                    {image ? <img src={image} className="w-full h-full object-contain transition-transform duration-200" style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, transform: isHovered ? "scale(2)" : "scale(1)" }} alt={product.name}/> : <div className="text-gray-400">No Image</div>}
                </div>
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#233a95] mb-2 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_,i)=><Star key={i} size={16} fill={i < Math.round(product.rating || 0) ? "currentColor" : "#e5e7eb"} className={i >= Math.round(product.rating || 0) ? "text-gray-200" : ""} />)}
                    </div>
                    <span className="text-gray-400 text-xs uppercase font-bold">{safeReviews.length} REVIEW(S)</span>
                </div>
                <div className="flex items-end gap-3 mb-6 bg-gray-50 p-4 rounded-lg w-max">
                    <span className="text-3xl sm:text-4xl font-bold text-[#D51243]">{currency}{product.price}</span>
                    {(product.oldPrice || 0) > 0 && <span className="text-gray-400 line-through text-sm">${product.oldPrice}</span>}
                    {product.inStock ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">IN STOCK</span> : <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</span>}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm mb-6">{product.description}</p>

                {safeSizes.length > 0 && (
                    <div className="mb-6">
                        <p className="font-bold text-gray-800 mb-2 text-sm">Size / Weight:</p>
                        <div className="flex gap-2 flex-wrap">
                            {safeSizes.map((item, index) => (
                                <button key={index} onClick={()=>setSize(item)} className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${item === size ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{item}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* QUANTITY & ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
                    
                    {/* QUANTITY SELECTOR */}
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 gap-4 bg-white">
                        <button onClick={()=>setQuantity(q=>Math.max(1, q-1))} className="text-gray-500 hover:text-black"><Minus size={16}/></button>
                        <span className="font-bold text-gray-800 w-4 text-center">{quantity}</span>
                        <button onClick={()=>setQuantity(q=>q+1)} className="text-gray-500 hover:text-black"><Plus size={16}/></button>
                    </div>

                    <button onClick={handleAddToCart} disabled={!product.inStock} className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition shadow-lg ${product.inStock ? 'bg-[#233a95] text-white hover:bg-blue-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                        <ShoppingCart size={18}/> {product.inStock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                    <button onClick={() => addToWishlist(product._id)} className={`p-3 rounded-full border transition ${wishlist.includes(product._id) ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-500 border-gray-200 hover:text-blue-600'}`}>
                        <Heart size={20} fill={wishlist.includes(product._id) ? "currentColor" : "none"}/> 
                    </button>
                </div>
            </div>
        </div>

        {/* TABS (Description / Reviews) */}
        <div className="border rounded-xl p-8 mb-16 bg-white shadow-sm">
            <div className="flex gap-8 border-b border-gray-200 pb-4 mb-6">
                <button onClick={()=>setActiveTab('description')} className={`font-bold px-2 pb-4 -mb-4.5 border-b-2 transition ${activeTab==='description'?'text-[#233a95] border-[#233a95]':'text-gray-400 border-transparent hover:text-gray-600'}`}>DESCRIPTION</button>
                <button onClick={()=>setActiveTab('reviews')} className={`font-bold px-2 pb-4 -mb-4.5 border-b-2 transition ${activeTab==='reviews'?'text-[#233a95] border-[#233a95]':'text-gray-400 border-transparent hover:text-gray-600'}`}>REVIEWS ({safeReviews.length})</button>
            </div>
            {activeTab === 'description' ? <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p> : (
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="w-full md:w-1/2 flex flex-col gap-6">
                        {safeReviews.length === 0 && <p className="text-gray-500 italic">No reviews yet.</p>}
                        {safeReviews.map((rev, i) => (
                            <div key={i} className="border-b pb-4">
                                <div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User size={16}/></div><p className="font-bold text-sm text-gray-800">{rev.userName}</p></div><span className="text-xs text-gray-400">{rev.date ? new Date(rev.date).toLocaleDateString() : 'Recent'}</span></div>
                                <div className="flex text-yellow-400 mb-2 text-xs">{[...Array(5)].map((_,x)=><Star key={x} size={12} fill={x < rev.rating ? "currentColor" : "#e5e7eb"} className={x >= rev.rating ? "text-gray-200" : ""} />)}</div>
                                <p className="text-sm text-gray-600">{rev.comment}</p>
                            </div>
                        ))}
                    </div>
                    <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-4">Write a Review</h4>
                        <form onSubmit={submitReview} className="flex flex-col gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Your Rating</label><div className="flex gap-1">{[1,2,3,4,5].map(star => (<Star key={star} size={24} onClick={()=>setRatingInput(star)} className={`cursor-pointer ${star <= ratingInput ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />))}</div></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">Your Review</label><textarea value={commentInput} onChange={e=>setCommentInput(e.target.value)} required className="w-full border rounded p-3 text-sm focus:outline-blue-500" rows={4} placeholder="How was the product?"></textarea></div>
                            <button type="submit" disabled={submittingReview} className="bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition disabled:bg-gray-400">{submittingReview ? "Submitting..." : "Submit Review"}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mb-16">
            <h3 className="text-xl font-bold text-[#233a95] mb-6 border-b pb-2">Related Products</h3>
            {related.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {related.map((item, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group bg-white">
                            <div className="h-40 mb-4 flex justify-center p-2 relative">
                                {(item.discount || 0) > 0 && <span className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">{item.discount}%</span>}
                                <Link to={`/product/${item._id}`} onClick={()=>window.scrollTo(0,0)}><img src={item.image[0]} className="h-full object-contain group-hover:scale-105 transition duration-500"/></Link>
                            </div>
                            <Link to={`/product/${item._id}`} onClick={()=>window.scrollTo(0,0)}><h4 className="font-bold text-gray-700 truncate mb-1 hover:text-blue-600 transition">{item.name}</h4></Link>
                            <p className="text-green-600 text-[10px] font-bold uppercase mb-2">In Stock</p>
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">{(item.oldPrice || 0) > 0 && <span className="text-xs text-gray-400 line-through">${item.oldPrice}</span>}<span className="text-[#D51243] font-bold text-lg">{currency}{item.price}</span></div>
                                <button onClick={()=>addToCart(item._id, item.sizes?.[0] || 'Standard')} className="text-blue-600 bg-blue-50 p-2 rounded-full hover:bg-blue-600 hover:text-white transition shadow-sm"><ShoppingCart size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-gray-500 italic">No related products found.</p>}
        </div>
    </div>
  )
}
export default Product;