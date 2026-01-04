import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Trash2, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const navigate = useNavigate()

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) setList(response.data.products)
      else toast.error("Error fetching data")
    } catch (error) { toast.error(error.message) }
  }

  // UPDATE STATUS FUNCTION
  const updateStatus = async (id, field, currentValue) => {
      try {
          const response = await axios.post(backendUrl + '/api/product/update', {
              id, [field]: !currentValue
          }, { headers: { token } })
          
          if(response.data.success) {
              toast.success("Updated!");
              fetchList();
          }
      } catch (error) { toast.error(error.message) }
  }

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      if (response.data.success) { toast.success(response.data.message); fetchList(); }
      else toast.error(response.data.message)
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { fetchList() }, [])

  return (
    <>
      <p className='mb-2 font-bold text-xl'>All Products List</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_0.8fr] items-center py-2 px-2 border bg-gray-100 text-sm font-bold'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Flags (Trend/New/Best)</b>
          <b className='text-center'>In Stock</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item, index) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_0.8fr] items-center gap-2 py-1 px-2 border text-sm hover:bg-gray-50' key={index}>
            <img className='w-12 h-12 object-cover rounded' src={item.image && item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            
            {/* TOGGLE FLAGS */}
            <div className='flex justify-center gap-2'>
                <button onClick={()=>updateStatus(item._id, 'trending', item.trending)} className={`px-2 py-1 rounded text-xs ${item.trending ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>Trend</button>
                <button onClick={()=>updateStatus(item._id, 'newArrival', item.newArrival)} className={`px-2 py-1 rounded text-xs ${item.newArrival ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>New</button>
                <button onClick={()=>updateStatus(item._id, 'bestseller', item.bestseller)} className={`px-2 py-1 rounded text-xs ${item.bestseller ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'}`}>Best</button>
            </div>

            {/* TOGGLE STOCK */}
            <div className='text-center cursor-pointer' onClick={()=>updateStatus(item._id, 'inStock', item.inStock)}>
                <span className={`px-2 py-1 rounded text-xs font-bold ${item.inStock ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {item.inStock ? "In Stock" : "Out"}
                </span>
            </div>

            {/* ACTION BUTTONS (Edit & Delete) */}
            <div className='text-right md:text-center flex justify-center items-center gap-3'>
                <Edit 
                    onClick={() => navigate('/edit', { state: { id: item._id } })} 
                    size={20} 
                    className='cursor-pointer text-blue-500 hover:text-blue-700' 
                />
                <Trash2 
                    onClick={()=>removeProduct(item._id)} 
                    size={20} 
                    className='cursor-pointer text-red-500 hover:text-red-700' 
                />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
export default List