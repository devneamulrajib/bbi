import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const ManageUser = ({ token }) => {
  const [staff, setStaff] = useState([])
  
  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('') // Added Phone State
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Deliveryman')

  // Fetch only Staff (Admins & Deliverymen)
  const fetchStaff = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/user/list', { headers: { token } })
      if (response.data.success) {
        const staffMembers = response.data.users.filter(user => user.role === 'Admin' || user.role === 'Deliveryman');
        setStaff(staffMembers)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Register New Staff
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + '/api/user/register', {
        name,
        email,
        phone, // Sending Phone Number now
        password,
        role 
      }, { headers: { token } })

      if (response.data.success) {
        toast.success("Staff added successfully!")
        setName('')
        setEmail('')
        setPhone('') // Reset Phone
        setPassword('')
        fetchStaff()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  // Remove Staff
  const removeStaff = async (id) => {
    if(!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      const response = await axios.post(backendUrl + '/api/user/delete', { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchStaff()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [token])

  return (
    <div className='w-full p-4'>
      <h3 className="mb-4 text-xl font-bold">Manage Staff & Riders</h3>

      {/* --- ADD STAFF FORM --- */}
      <div className='bg-white shadow-md rounded-lg p-6 mb-8 max-w-xl'>
        <h4 className='mb-4 font-semibold text-gray-700 border-b pb-2'>Add New Staff</h4>
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          
          <div className='grid grid-cols-2 gap-4'>
            <input 
              onChange={(e) => setName(e.target.value)} value={name} 
              className='px-3 py-2 border rounded focus:outline-green-500' 
              type="text" placeholder='Full Name' required 
            />
             <select 
              onChange={(e) => setRole(e.target.value)} value={role}
              className='px-3 py-2 border rounded bg-white focus:outline-green-500'
            >
              <option value="Deliveryman">Deliveryman (Rider)</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <input 
              onChange={(e) => setEmail(e.target.value)} value={email} 
              className='w-full px-3 py-2 border rounded focus:outline-green-500' 
              type="email" placeholder='Email Address' required 
            />
            {/* Added Phone Input Field */}
            <input 
              onChange={(e) => setPhone(e.target.value)} value={phone} 
              className='w-full px-3 py-2 border rounded focus:outline-green-500' 
              type="text" placeholder='Phone Number' required 
            />
          </div>

          <input 
            onChange={(e) => setPassword(e.target.value)} value={password} 
            className='w-full px-3 py-2 border rounded focus:outline-green-500' 
            type="password" placeholder='Password' required 
          />
          
          <button type="submit" className='w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition'>
            Add Staff Member
          </button>
        </form>
      </div>

      {/* --- STAFF LIST --- */}
      <h4 className="mb-3 font-bold text-lg">Current Staff List</h4>
      <div className='bg-white shadow rounded-lg overflow-hidden'>
        <div className='grid grid-cols-[1.5fr_2fr_1fr_0.5fr] bg-gray-100 p-3 text-sm font-bold border-b'>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span className='text-center'>Action</span>
        </div>

        {staff.length === 0 ? (
          <p className='p-4 text-center text-gray-500'>No staff members found.</p>
        ) : (
          staff.map((item, index) => (
            <div key={index} className='grid grid-cols-[1.5fr_2fr_1fr_0.5fr] items-center p-3 border-b hover:bg-gray-50 text-sm'>
              <span className='font-medium text-gray-800'>{item.name}</span>
              <span className='text-gray-600'>{item.email}</span>
              <span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.role === 'Deliveryman' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                }`}>
                    {item.role}
                </span>
              </span>
              <button onClick={() => removeStaff(item._id)} className='text-red-500 hover:text-red-700 text-center font-bold'>
                 ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ManageUser