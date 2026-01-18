import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  PlusCircle, 
  List, 
  ShoppingBag, 
  FolderPlus, 
  LayoutTemplate, 
  Settings, 
  MessageSquare, 
  FileText, 
  Users, 
  LayoutDashboard // Import the Dashboard Icon
} from 'lucide-react'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 bg-white'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            
            {/* 1. Dashboard Link (New) */}
            <NavLink 
                to="/" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <LayoutDashboard size={20} />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>

            {/* 2. Add Items */}
            <NavLink 
                to="/add" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <PlusCircle size={20} />
                <p className='hidden md:block'>Add Items</p>
            </NavLink>

            {/* 3. List Items */}
            <NavLink 
                to="/list" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <List size={20} />
                <p className='hidden md:block'>List Items</p>
            </NavLink>

            {/* 4. Categories */}
            <NavLink 
                to="/category" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <FolderPlus size={20} />
                <p className='hidden md:block'>Categories</p>
            </NavLink>

            {/* 5. Orders */}
            <NavLink 
                to="/orders" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <ShoppingBag size={20} />
                <p className='hidden md:block'>Orders</p>
            </NavLink>

            {/* 6. Feature Poster */}
            <NavLink 
                to="/poster" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <LayoutTemplate size={20} />
                <p className='hidden md:block'>Feature Poster</p>
            </NavLink>

            {/* 7. Home Settings */}
            <NavLink 
                to="/config" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <Settings size={20} />
                <p className='hidden md:block'>Home Settings</p>
            </NavLink>

            {/* 8. Page Content */}
            <NavLink 
                to="/content" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <FileText size={20} />
                <p className='hidden md:block'>Page Content</p>
            </NavLink>

            {/* 9. Reviews */}
            <NavLink 
                to="/reviews" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <MessageSquare size={20} />
                <p className='hidden md:block'>Reviews</p>
            </NavLink>

            {/* 10. Users */}
            <NavLink 
                to="/users" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <Users size={20} />
                <p className='hidden md:block'>Users</p>
            </NavLink>
        </div>
    </div>
  )
}
export default Sidebar