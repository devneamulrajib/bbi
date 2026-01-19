import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // CHANGED: Using the standard '/api/user/login' endpoint
      const response = await axios.post(backendUrl + '/api/user/login', { email, password });
      
      if (response.data.success) {
        // Security Check: Ensure the user is actually a Deliveryman
        if(response.data.role === 'Deliveryman') {
            toast.success("Welcome Rider!");
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } else {
            toast.error("Access Denied. You are not a registered Rider.");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md'>
        <div className='mb-8 text-center'>
            <h1 className='text-3xl font-bold text-gray-800'>Babai Rider</h1>
            <p className='text-gray-500'>Delivery Partner Login</p>
        </div>
        
        <form onSubmit={onSubmitHandler}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Email Address</label>
            <input 
              className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500' 
              type="email" 
              placeholder="rider@example.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
            <input 
              className='shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500' 
              type="password" 
              placeholder="******************" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            className='bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded w-full focus:outline-none focus:shadow-outline transition duration-200' 
            type="submit"
          >
            Sign In
          </button>
        </form>
        <p className='text-center text-gray-400 text-xs mt-4'>
            &copy; {new Date().getFullYear()} BabaiBangladesh. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login