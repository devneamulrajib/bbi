import React, { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'; // Removed 'BrowserRouter as Router'

// Import all your pages
import Header from './Header';
import Home from './Home';
import Login from './Login';
import CategoryPage from './CategoryPage';
import Contact from './Contact';
import Blog from './Blog';
import BestSellerPage from './BestSellerPage';

// --- LAYOUT COMPONENT ---
const Layout = () => {
  const { pathname } = useLocation();

  // Auto-scroll to top when path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
      <Routes>
        {/* 1. Login Page (No Header) */}
        <Route path="/login" element={<Login />} />

        {/* 2. Main Layout (Header + Page Content) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="bestsellers" element={<BestSellerPage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
  );
}

export default App;