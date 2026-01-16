import React, { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

// Import Components
import Header from './Header';
import Footer from './components/Footer'; // <--- Import Footer

// Import Pages
import Home from './Home';
import Login from './Login';
import CategoryPage from './CategoryPage';
import Contact from './Contact';
import Blog from './Blog';
import BestSellerPage from './BestSellerPage';
import CollectionPage from './CollectionPage';
import Product from './pages/Product';
import LegalPage from './pages/LegalPage'; // <--- Import Legal Page
import MyProfile from './pages/MyProfile';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';

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
      <Footer /> {/* <--- Added Footer here so it shows on all main pages */}
    </>
  );
};

function App() {
  return (
      <Routes>
        {/* 1. Login Page (No Header/Footer) */}
        <Route path="/login" element={<Login />} />

        {/* 2. Main Layout (Header + Page Content + Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="bestsellers" element={<BestSellerPage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          {/* Dynamic Route for Privacy Policy, Terms, Cookies */}
          <Route path="page/:slug" element={<LegalPage />} /> 
        </Route>
      </Routes>
  );
}

export default App;