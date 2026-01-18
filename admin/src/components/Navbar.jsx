import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center justify-between py-2 px-[4%]'>
        {/* Wrapping the text in Link to redirect to Dashboard */}
        <Link to='/'>
            <h1 className="text-xl font-bold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                Admin Panel
            </h1>
        </Link>
        
        <button 
            onClick={() => setToken('')} 
            className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-700'
        >
            Logout
        </button>
    </div>
  )
}

export default Navbar