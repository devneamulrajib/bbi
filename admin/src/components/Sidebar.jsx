import React from 'react'
import { NavLink } from 'react-router-dom'
import { PlusCircle, List, ShoppingBag, FolderPlus } from 'lucide-react' // Import FolderPlus icon
import { LayoutTemplate } from 'lucide-react'
import { Settings } from 'lucide-react'
import { FileText } from 'lucide-react';
import { Users } from 'lucide-react'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%]'>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/add">
                <PlusCircle size={20} /><p className='hidden md:block'>Add Items</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/list">
                <List size={20} /><p className='hidden md:block'>List Items</p>
            </NavLink>
             <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/category">
                <FolderPlus size={20} /><p className='hidden md:block'>Categories</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/orders">
                <ShoppingBag size={20} /><p className='hidden md:block'>Orders</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/poster">
                <LayoutTemplate size={20} /><p className='hidden md:block'>Feature Poster</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/config">
                <Settings size={20} /><p className='hidden md:block'>Home Settings</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/content">
                <FileText size={20} /><p className='hidden md:block'>Page Content</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/users">
                <Users size={20} /><p className='hidden md:block'>Users</p>
            </NavLink>
        </div>
    </div>
  )
}
export default Sidebar