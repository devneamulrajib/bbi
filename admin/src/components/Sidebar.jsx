import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App' // Ensure this path is correct
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
  UserCog,
  Mail 
} from 'lucide-react'

const Sidebar = ({ token }) => {
  
  const location = useLocation();
  
  // 1. Get User Role from LocalStorage
  const role = localStorage.getItem('role') || 'Super Admin';

  // 2. Define Permissions
  const isAccountant = role === 'Accountant';
  const canManageStaff = ['Super Admin', 'CEO', 'Admin'].includes(role);
  const canManageContent = !isAccountant;

  // 3. Notification State
  const [stats, setStats] = useState({
      orders: 0,
      messages: 0,
      reviews: 0
  });

  // 4. Fetch Counts from Backend
  const fetchStats = async () => {
      // If no token, don't try to fetch (avoids 401 errors on login page)
      if (!token && !localStorage.getItem('token')) return; 

      try {
          const authToken = token || localStorage.getItem('token');
          const response = await axios.get(backendUrl + '/api/dashboard/stats', { headers: { token: authToken } });
          if(response.data.success) {
              setStats(response.data.stats);
          }
      } catch (error) {
          console.error("Error loading sidebar stats");
      }
  }

  // 5. Effect: Fetch on mount, on URL change, and poll every 15s
  useEffect(() => {
      fetchStats();
      
      const interval = setInterval(fetchStats, 15000); // Poll every 15 seconds
      return () => clearInterval(interval);
  }, [token, location.pathname]); // Update immediately when page changes (e.g., after reading messages)


  // Helper Component for the Red Badge
  const NotificationBadge = ({ count }) => {
      if (!count || count <= 0) return null;
      return (
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {count}
          </span>
      );
  }

  return (
    <div className='w-[18%] min-h-screen border-r-2 bg-white'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px] pr-4'>
            
            {/* --- COMMON LINKS (Everyone) --- */}
            
            <NavLink 
                to="/" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <LayoutDashboard size={20} />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>

            {/* Orders - WITH BADGE */}
            <NavLink 
                to="/orders" 
                className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
            >
                <ShoppingBag size={20} />
                <p className='hidden md:block'>Orders</p>
                <NotificationBadge count={stats.orders} />
            </NavLink>

            {/* --- MANAGEMENT LINKS --- */}
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

                    {/* Reviews - WITH BADGE */}
                    <NavLink 
                        to="/reviews" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <MessageSquare size={20} />
                        <p className='hidden md:block'>Reviews</p>
                        <NotificationBadge count={stats.reviews} />
                    </NavLink>

                    {/* Messages - WITH BADGE */}
                    <NavLink 
                        to="/messages" 
                        className={({ isActive }) => `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition-all ${isActive ? 'bg-gray-100 border-r-4 border-r-black font-medium' : 'hover:bg-gray-50'}`}
                    >
                        <Mail size={20} />
                        <p className='hidden md:block'>Messages</p>
                        <NotificationBadge count={stats.messages} />
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