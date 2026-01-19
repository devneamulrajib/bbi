import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; 

function App() {
  // Initialize token from localStorage so the user stays logged in on refresh
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    // Whenever token changes, update localStorage
    if(token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className='App'>
      <ToastContainer />
      <Routes>
        {/* If no token, show Login. If token exists, redirect to Dashboard */}
        <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
        
        {/* If token exists, show Dashboard. If not, redirect to Login */}
        <Route path="/dashboard" element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;