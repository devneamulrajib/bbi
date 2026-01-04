import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { ShoppingCart } from 'lucide-react';

const CollectionPage = () => {
    const { products, addToCart, currency } = useContext(ShopContext);
    const [displayProducts, setDisplayProducts] = useState([]);
    const location = useLocation();
    const type = new URLSearchParams(location.search).get('type'); // ?type=bestseller

    useEffect(() => {
        if(products.length > 0) {
            if(type === 'bestseller') setDisplayProducts(products.filter(p => p.bestseller));
            else if(type === 'new') setDisplayProducts(products.filter(p => p.newArrival));
            else if(type === 'trending') setDisplayProducts(products.filter(p => p.trending));
            else setDisplayProducts(products);
        }
    }, [products, type]);

    const title = type === 'bestseller' ? 'Best Sellers' : type === 'new' ? 'New Arrivals' : type === 'trending' ? 'Trending Products' : 'All Products';

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-[#233a95] mb-6 capitalize">{title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {displayProducts.map((item, index) => (
                    <div key={index} className="border p-4 rounded-xl group hover:shadow-lg transition">
                         <Link to={`/product/${item._id}`}><div className="h-40 flex justify-center"><img src={item.image[0]} className="h-full object-contain group-hover:scale-105 transition" /></div></Link>
                         <h3 className="font-bold text-gray-700 mt-4 truncate">{item.name}</h3>
                         <div className="flex justify-between items-center mt-2">
                             <span className="text-red-500 font-bold">{currency}{item.price}</span>
                             <button onClick={() => addToCart(item._id, item.sizes[0] || 'M')} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"><ShoppingCart size={18} /></button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default CollectionPage;