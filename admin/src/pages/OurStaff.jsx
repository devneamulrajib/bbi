import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Trash2, Shield, UserPlus } from 'lucide-react'

const OurStaff = ({ token }) => {
  const [staffList, setStaffList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Deliveryman');

  const fetchStaff = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/user/staff/list', { headers: { token } });
      if (res.data.success) setStaffList(res.data.staff);
    } catch (error) { toast.error(error.message) }
  }

  const addStaffHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(backendUrl + '/api/user/staff/add', 
        { name, email, password, phone, role }, 
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetchStaff();
        setName(''); setEmail(''); setPassword(''); setPhone('');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) { toast.error(error.message) }
  }

  const removeStaff = async (id) => {
    if(!window.confirm("Remove this staff member?")) return;
    try {
      const res = await axios.post(backendUrl + '/api/user/staff/delete', { id }, { headers: { token } });
      if (res.data.success) { toast.success("Removed"); fetchStaff(); }
    } catch (error) { toast.error(error.message) }
  }

  useEffect(() => { fetchStaff() }, [token]);

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h3 className='text-2xl font-bold mb-6'>Our Staff Team</h3>
      
      {/* Add Staff Form */}
      <div className='bg-white p-6 rounded-lg shadow-sm mb-8'>
        <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'><UserPlus size={20}/> Add New Member</h4>
        <form onSubmit={addStaffHandler} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input type="text" placeholder='Full Name' required className='border p-2 rounded' value={name} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder='Email' required className='border p-2 rounded' value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder='Password' required className='border p-2 rounded' value={password} onChange={e => setPassword(e.target.value)} />
          <input type="text" placeholder='Phone' required className='border p-2 rounded' value={phone} onChange={e => setPhone(e.target.value)} />
          <select className='border p-2 rounded bg-white' value={role} onChange={e => setRole(e.target.value)}>
            <option value="Deliveryman">Deliveryman (Rider)</option>
            <option value="Manager">Manager</option>
            <option value="Accountant">Accountant</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="CEO">CEO</option>
          </select>
          <button type='submit' className='bg-green-600 text-white p-2 rounded hover:bg-green-700 md:col-span-2'>Add Member</button>
        </form>
      </div>

      {/* Staff List */}
      <div className='grid gap-4 md:grid-cols-3'>
        {staffList.map((member) => (
          <div key={member._id} className='bg-white p-4 rounded shadow-sm border border-gray-100 flex justify-between items-start'>
            <div>
              <p className='font-bold text-gray-800'>{member.name}</p>
              <p className='text-sm text-gray-500'>{member.email}</p>
              <span className={`text-xs px-2 py-1 rounded mt-2 inline-block font-semibold ${
                member.role === 'Deliveryman' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {member.role}
              </span>
            </div>
            <button onClick={() => removeStaff(member._id)} className='text-red-400 hover:text-red-600'><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default OurStaff