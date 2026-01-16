import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Star, MessageSquare, Trash2 } from 'lucide-react'

const Reviews = ({ token }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
      try {
          const res = await axios.get(backendUrl + '/api/product/reviews', { headers: { token } });
          if(res.data.success) {
              setReviews(res.data.reviews.reverse()); // Newest first
          } else {
              toast.error("Failed to load reviews");
          }
      } catch (error) {
          toast.error(error.message);
      }
  }

  const handleDelete = async (productId, index) => {
      if(!window.confirm("Delete this review?")) return;
      try {
          const res = await axios.post(backendUrl + '/api/product/review/delete', 
              { productId, reviewIndex: index }, 
              { headers: { token } }
          );
          if(res.data.success) {
              toast.success("Review Deleted");
              fetchReviews(); // Refresh list
          } else {
              toast.error(res.data.message);
          }
      } catch (error) { toast.error(error.message); }
  }

  useEffect(() => {
      fetchReviews();
  }, [token]);

  return (
    <div className='w-full'>
        <h3 className='text-xl font-bold mb-6 flex items-center gap-2'><MessageSquare /> Customer Reviews</h3>
        
        <div className='flex flex-col gap-4'>
            {reviews.map((rev, i) => (
                <div key={i} className='bg-white p-4 rounded shadow-sm border flex flex-col md:flex-row gap-4 items-start'>
                    
                    {/* Product Info */}
                    <div className='flex items-center gap-3 w-full md:w-1/4 border-b md:border-b-0 md:border-r pb-2 md:pb-0'>
                        <img src={rev.productImage} className='w-12 h-12 object-cover rounded border'/>
                        <p className='font-bold text-sm text-gray-700 line-clamp-2'>{rev.productName}</p>
                    </div>

                    {/* Review Info */}
                    <div className='flex-1'>
                        <div className='flex justify-between items-center mb-1'>
                            <p className='font-bold text-sm'>{rev.userName}</p>
                            <span className='text-xs text-gray-400'>{new Date(rev.date).toLocaleDateString()}</span>
                        </div>
                        <div className='flex items-center gap-1 mb-2'>
                            {[...Array(5)].map((_,x)=><Star key={x} size={12} className={x < rev.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />)}
                            <span className='text-xs font-bold text-gray-600 ml-1'>({rev.rating}/5)</span>
                        </div>
                        <p className='text-sm text-gray-600 bg-gray-50 p-2 rounded'>"{rev.comment}"</p>
                    </div>

                    {/* Action */}
                    <button onClick={()=>handleDelete(rev.productId, rev.reviewIndex)} className='text-red-500 hover:text-red-700 p-2'>
                        <Trash2 size={20}/>
                    </button>
                </div>
            ))}

            {reviews.length === 0 && <p className='text-gray-500 text-center py-10'>No reviews found.</p>}
        </div>
    </div>
  )
}

export default Reviews