import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Trash2, Edit, UserPlus, Users as UsersIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Users = ({ token }) => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/user/list', { headers: { token } })
      if (response.data.success) {
        setUsers(response.data.users.reverse())
      } else {
        toast.error("Error fetching users")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/user/delete', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchUsers()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token])

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold flex items-center gap-2'><UsersIcon /> All Users</h2>
          <button onClick={() => navigate('/manage-user')} className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700'>
              <UserPlus size={18} /> Add New User
          </button>
      </div>

      <div className='flex flex-col gap-2'>
        {/* Header */}
        <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_0.5fr] items-center py-2 px-2 border bg-gray-100 text-sm font-bold'>
          <b>Name</b>
          <b>Email</b>
          <b>Phone</b>
          <b>Date Joined</b>
          <b className='text-center'>Action</b>
        </div>

        {/* User Rows */}
        {users.map((item, index) => (
          <div className='grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr_0.5fr] items-center gap-2 py-2 px-2 border text-sm hover:bg-gray-50' key={index}>
            <p className='font-semibold'>{item.name}</p>
            <p>{item.email}</p>
            <p>{item.phone}</p>
            <p>{new Date(item.createdAt).toLocaleDateString()}</p>
            <div className='flex justify-center items-center gap-3'>
                <Edit 
                    onClick={() => navigate('/manage-user', { state: { id: item._id } })} 
                    size={18} 
                    className='cursor-pointer text-blue-500 hover:text-blue-700' 
                />
                <Trash2 
                    onClick={()=>removeUser(item._id)} 
                    size={18} 
                    className='cursor-pointer text-red-500 hover:text-red-700' 
                />
            </div>
          </div>
        ))}
        {users.length === 0 && <p className='text-center text-gray-500 mt-4'>No users found.</p>}
      </div>
    </div>
  )
}

export default Users