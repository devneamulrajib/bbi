import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Star, Heart, RefreshCw, ShoppingCart, Check } from 'lucide-react';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const p = products.find(item => item._id === productId);
    if(p) {
        setProduct(p);
        setImage(p.image[0]);
        setSize(p.sizes[0]);
        // Filter Related (Same Category, not same product)
        setRelated(products.filter(item => item.category === p.category && item._id !== p._id).slice(0, 4));
    }
  }, [productId, products]);

  if(!product) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 border-t">
        
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-10 mb-16">
            
            {/* Image Gallery */}
            <div className="w-full md:w-1/2 flex gap-4">
                <div className="w-[15%] flex flex-col gap-3">
                    {product.image.map((img, i) => (
                        <img key={i} src={img} onClick={()=>setImage(img)} className={`w-full h-24 object-contain border rounded cursor-pointer ${image===img ? 'border-blue-500' : 'border-gray-200'}`} />
                    ))}
                </div>
                <div className="w-[85%] border rounded-xl p-6 flex items-center justify-center bg-white relative">
                    <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">{product.discount > 0 ? `${product.discount}%` : 'HOT'}</span>
                    <img src={image} className="w-full h-auto max-h-[400px] object-contain" />
                </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2">
                <h1 className="text-3xl font-bold text-[#233a95] mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <div className="flex text-yellow-400">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill={i < product.rating ? "currentColor" : "none"} />)}</div>
                    <span className="text-gray-400">1 REVIEW</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">SKU: ZU-0{product._id.slice(-4)}</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-red-500">{currency}{product.price}</span>
                    {product.oldPrice > 0 && <span className="text-xl text-gray-300 line-through">${product.oldPrice}</span>}
                    {product.inStock ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">IN STOCK</span> : <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</span>}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{product.description.slice(0, 150)}...</p>

                {/* Actions */}
                <div className="flex gap-4 mb-8">
                    <div className="flex items-center border rounded-full px-4 py-2 gap-4">
                        <button onClick={()=>setQuantity(q=>Math.max(1,q-1))} className="text-gray-500 hover:text-blue-500 text-xl font-bold">-</button>
                        <span className="font-bold w-4 text-center">{quantity}</span>
                        <button onClick={()=>setQuantity(q=>q+1)} className="text-gray-500 hover:text-blue-500 text-xl font-bold">+</button>
                    </div>
                    <button onClick={()=>addToCart(product._id, size)} className="bg-[#233a95] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 flex items-center gap-2">
                        <ShoppingCart size={18}/> Add to cart
                    </button>
                </div>

                <div className="flex gap-6 text-sm text-gray-500 uppercase font-bold tracking-wider">
                    <button className="flex items-center gap-2 hover:text-blue-600"><Heart size={16}/> Add to wishlist</button>
                    <button className="flex items-center gap-2 hover:text-blue-600"><RefreshCw size={16}/> Compare</button>
                </div>
                
                <hr className="my-6" />
                
                <div className="text-sm text-gray-500 space-y-2">
                    <p><span className="text-gray-800 font-bold">Type:</span> Organic</p>
                    <p><span className="text-gray-800 font-bold">Category:</span> {product.category}</p>
                    <p><span className="text-gray-800 font-bold">Tags:</span> {product.subCategory}, Healthy, Food</p>
                </div>
            </div>
        </div>

        {/* TABS (Description/Reviews) */}
        <div className="border rounded-xl p-8 mb-16">
            <div className="flex gap-8 border-b pb-4 mb-6">
                <button className="text-[#233a95] font-bold border rounded-full px-6 py-2 border-gray-200">DESCRIPTION</button>
                <button className="text-gray-500 font-bold px-6 py-2">REVIEWS (1)</button>
            </div>
            <div className="text-gray-600 leading-relaxed">
                <p>{product.description}</p>
            </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#233a95] mb-6">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {related.map((item, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition group">
                        <div className="h-40 mb-4 flex justify-center"><Link to={`/product/${item._id}`}><img src={item.image[0]} className="h-full object-contain group-hover:scale-105 transition"/></Link></div>
                        <h4 className="font-bold text-gray-700 truncate mb-1">{item.name}</h4>
                        <p className="text-green-600 text-xs font-bold uppercase mb-2">In Stock</p>
                        <div className="flex justify-between items-center">
                            <span className="text-red-500 font-bold text-lg">{currency}{item.price}</span>
                            <button onClick={()=>addToCart(item._id, item.sizes[0]||'M')} className="text-blue-600 bg-blue-50 p-2 rounded-full hover:bg-blue-600 hover:text-white transition"><ShoppingCart size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
export default Product;