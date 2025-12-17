import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';

// Import all your pages
import Header from './Header';
import Home from './Home';
import Login from './Login';
import CategoryPage from './CategoryPage';
import Contact from './Contact';
import Blog from './Blog';

// --- LAYOUT COMPONENT ---
// This wrapper ensures the Header is always visible
// and the page scrolls to the top when you click a link.
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
        <Outlet /> {/* This renders the child page (Home, Blog, etc.) */}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Login Page (No Header) */}
        <Route path="/login" element={<Login />} />

        {/* 2. Main Layout (Header + Page Content) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;