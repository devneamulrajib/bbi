import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import CategoryPage from './CategoryPage'; // Import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Dynamic Route: :slug allows us to reuse this page for any category */}
        <Route path="/category/:slug" element={<CategoryPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;