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
  LayoutDashboard,
  UserCog // Icon for Our Staff
} from 'lucide-react'

const Sidebar = () => {
  
  // 1. Get User Role from LocalStorage (Default to Super Admin if not set)
  const role = localStorage.getItem('role') || 'Super Admin';

  // 2. Define Permissions
  // Accountant can ONLY view Dashboard and Orders
  const isAccountant = role === 'Accountant';
  
  // Manager can view everything EXCEPT Staff Management
  // CEO, Admin, and Super Admin can view Staff Management
  const canManageStaff = ['Super Admin', 'CEO', 'Admin'].includes(role);

  // Content Management (Add, List, Settings, etc.) is for everyone EXCEPT Accountant
  const canManageContent = !isAccountant;

  return (
    <div className='w-[18%] min-h-screen border-r-2 bg-white'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            
            {/* --- COMMON LINKS (Everyone) --- */}
            
            {/* 1. Dashboard */}
            <NavLink 
                to="/" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <LayoutDashboard size={20} />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>

            {/* 2. Orders */}
            <NavLink 
                to="/orders" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <ShoppingBag size={20} />
                <p className='hidden md:block'>Orders</p>
            </NavLink>

            {/* --- MANAGEMENT LINKS (Hidden from Accountant) --- */}
            {canManageContent && (
                <>
                    <NavLink 
                        to="/add" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <PlusCircle size={20} />
                        <p className='hidden md:block'>Add Items</p>
                    </NavLink>

                    <NavLink 
                        to="/list" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <List size={20} />
                        <p className='hidden md:block'>List Items</p>
                    </NavLink>

                    <NavLink 
                        to="/category" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <FolderPlus size={20} />
                        <p className='hidden md:block'>Categories</p>
                    </NavLink>

                    <NavLink 
                        to="/poster" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <LayoutTemplate size={20} />
                        <p className='hidden md:block'>Feature Poster</p>
                    </NavLink>

                    <NavLink 
                        to="/config" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <Settings size={20} />
                        <p className='hidden md:block'>Home Settings</p>
                    </NavLink>

                    <NavLink 
                        to="/content" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <FileText size={20} />
                        <p className='hidden md:block'>Page Content</p>
                    </NavLink>

                    <NavLink 
                        to="/reviews" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <MessageSquare size={20} />
                        <p className='hidden md:block'>Reviews</p>
                    </NavLink>

                    <NavLink 
                        to="/users" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <Users size={20} />
                        <p className='hidden md:block'>Users</p>
                    </NavLink>
                </>
            )}

            {/* --- STAFF MANAGEMENT (Hidden from Manager & Accountant) --- */}
            {canManageStaff && (
                <NavLink 
                    to="/staff" 
                    className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                >
                    <UserCog size={20} />
                    <p className='hidden md:block'>Our Staff</p>
                </NavLink>
            )}

        </div>
    </div>
  )
}
export default Sidebar