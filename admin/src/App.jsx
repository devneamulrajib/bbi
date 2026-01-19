import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import Category from './pages/Category'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Poster from './pages/Poster'
import Edit from './pages/Edit'
import HomeConfig from './pages/HomeConfig'
import Content from './pages/Content';
import Users from './pages/Users'
import ManageUser from './pages/ManageUser'
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews'
import Profile from './pages/Profile';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'Tk ' // <--- This fixes your error

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Dashboard token={token} url={backendUrl} />} /> 
                <Route path='/dashboard' element={<Dashboard token={token} url={backendUrl} />} />
                
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/poster' element={<Poster token={token} />} />
                <Route path='/edit' element={<Edit token={token} />} />
                <Route path='/config' element={<HomeConfig token={token} />} />
                <Route path='/content' element={<Content token={token} />} />
                <Route path='/users' element={<Users token={token} />} />
                <Route path='/profile' element={<Profile token={token} />} />
                <Route path='/reviews' element={<Reviews token={token} />} />
                <Route path='/staff' element={<ManageUser token={token} />} />
                <Route path='/category' element={<Category token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App