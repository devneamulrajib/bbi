import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Package, Trash2, CheckCircle, XCircle } from 'lucide-react'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Update Status (Order or Payment)
  const statusHandler = async (orderId, status = null, payment = null) => {
    try {
      let payload = { orderId };
      if(status) payload.status = status;
      if(payment !== null) payload.payment = payment;

      const response = await axios.post(backendUrl + '/api/order/status', payload, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Updated")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Delete Order
  const deleteOrderHandler = async (orderId) => {
      if(!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
      try {
          const response = await axios.post(backendUrl + '/api/order/delete', { orderId }, { headers: { token } })
          if (response.data.success) {
            toast.success(response.data.message)
            fetchAllOrders()
          } else {
            toast.error(response.data.message)
          }
      } catch (error) {
          toast.error(error.message)
      }
  }

  useEffect(() => { fetchAllOrders() }, [token])

  return (
    <div>
      <h3 className='text-xl font-bold mb-4'>Order Management</h3>
      <div className='flex flex-col gap-4'>
        {orders.map((order, index) => (
          <div className='grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr] gap-4 items-start border-2 border-gray-200 p-5 md:p-8 text-xs sm:text-sm text-gray-700 bg-white rounded-lg shadow-sm' key={index}>
            
            {/* Icon & ID */}
            <div className='flex flex-col items-center justify-center gap-2'>
                <Package size={40} className='text-blue-600'/>
                <p className='font-bold text-gray-500'>ID: {order._id.slice(-6).toUpperCase()}</p>
            </div>

            {/* Details */}
            <div>
              <div className='font-bold mb-2'>Items:</div>
              <div className='mb-3'>
                {order.items.map((item, index) => (
                    <p key={index} className='text-gray-600'>{item.name} x {item.quantity} ({item.size})</p>
                ))}
              </div>
              <p className='font-bold text-gray-800'>{order.address.firstName + " " + order.address.lastName}</p>
              <p>{order.address.street}, {order.address.city}, {order.address.zipcode}</p>
              <p className='font-bold mt-1'>{order.address.phone}</p>
            </div>

            {/* Info & Payment */}
            <div>
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p className='font-bold text-red-600 mt-2 text-lg'>${order.amount}</p>
              
              {/* Payment Toggle */}
              <div className='mt-2 flex items-center gap-2 cursor-pointer border px-2 py-1 rounded w-max bg-gray-50' onClick={()=>statusHandler(order._id, null, !order.payment)}>
                  {order.payment 
                    ? <><CheckCircle size={16} className='text-green-500'/> <span className='text-green-700 font-bold'>Paid</span></>
                    : <><XCircle size={16} className='text-red-500'/> <span className='text-red-700 font-bold'>Pending</span></>
                  }
              </div>
            </div>

            {/* Actions */}
            <div className='flex flex-col gap-3'>
                <select onChange={(event) => statusHandler(order._id, event.target.value)} value={order.status} className='p-2 font-semibold border rounded bg-gray-50 outline-none'>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <button onClick={()=>deleteOrderHandler(order._id)} className='flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 transition font-bold'>
                    <Trash2 size={16} /> Delete Order
                </button>
            </div>

          </div>
        ))}
        {orders.length === 0 && <p className='text-center text-gray-500'>No orders found.</p>}
      </div>
    </div>
  )
}
export default Orders