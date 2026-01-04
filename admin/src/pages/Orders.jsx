import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Package } from 'lucide-react'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Status Updated")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => { fetchAllOrders() }, [token])

  return (
    <div>
      <h3 className='text-xl font-bold mb-4'>Order Management</h3>
      <div>
        {orders.map((order, index) => (
          <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-700 bg-white rounded-lg shadow-sm' key={index}>
            <Package size={40} className='text-blue-600'/>
            <div>
              <div className='font-bold mb-2'>Order Items:</div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity + " (" + item.size + ")"
                  } else {
                    return item.name + " x " + item.quantity + " (" + item.size + "), "
                  }
                })}
              </div>
              <p className='mt-3 font-bold text-gray-800'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
              </div>
              <p className='font-bold'>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
              <p className='mt-3'>Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px] font-bold text-red-600'>Due: ${order.amount}</p>
            
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold border rounded bg-gray-50'>
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
export default Orders