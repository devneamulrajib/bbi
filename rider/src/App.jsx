import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css'; // Keep this if you want global styles

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set Login as the default page */}
        <Route path="/" element={<Login />} />
        
        {/* Route for the Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;