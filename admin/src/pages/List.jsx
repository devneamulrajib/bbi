import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Trash2, Loader2 } from 'lucide-react'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loadingId, setLoadingId] = useState(null) 

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error("Error fetching data")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setLoadingId(id); // Start Spinner
      
      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
      
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList() // Reload List
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoadingId(null); // Stop Spinner
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2 font-bold text-xl'>All Products List</p>
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-2 border bg-gray-100 text-sm font-bold'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {list.map((item, index) => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm hover:bg-gray-50' key={index}>
            <img className='w-12 h-12 object-cover rounded' src={item.image && item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <div onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-red-500 hover:text-red-700 flex justify-center items-center'>
              {loadingId === item._id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default List