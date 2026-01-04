import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Lock, Mail, ArrowLeft, Loader2, Phone, MapPin } from 'lucide-react';

const Login = () => {
  // Access Global Context
  const { token, setToken, backendUrl, navigate, getUserData } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState('Login');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Acts as Email OR Phone for Login
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Address State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [country, setCountry] = useState('');

  // Handle Form Submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        // --- Register API ---
        const address = { street, city, state, zipcode, country };
        const response = await axios.post(backendUrl + '/api/user/register', { 
            name, email, phone, password, address 
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await getUserData(response.data.token); // Fetch user data immediately
          toast.success("Account Created Successfully!");
          navigate('/'); // Redirect to Home
        } else {
          toast.error(response.data.message);
        }
      } else {
        // --- Login API ---
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await getUserData(response.data.token); // Fetch user data immediately
          toast.success("Welcome Back!");
          navigate('/'); // Redirect to Home
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Back to Home Link */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#2bbef9] transition">
        <ArrowLeft size={20} />
        <span className="font-bold">Back to Shop</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 my-10">
        
        {/* Header Section */}
        <div className="bg-[#233a95] p-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            {currentState === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-blue-200 mt-2 text-sm">
            {currentState === 'Sign Up' ? 'Join our grocery community' : 'Login to manage your orders'}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            
            {/* SIGN UP FIELDS */}
            {currentState === 'Sign Up' ? (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Full Name" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9]" />
                </div>
                
                <div className="flex gap-2">
                    <div className="relative w-1/2">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" required className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                    </div>
                    <div className="relative w-1/2">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" placeholder="Phone" required className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                    </div>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" placeholder="Street Address" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9]" />
                </div>

                <div className="flex gap-2">
                    <input onChange={(e) => setCity(e.target.value)} value={city} type="text" placeholder="City" required className="w-1/2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                    <input onChange={(e) => setZipcode(e.target.value)} value={zipcode} type="text" placeholder="Zip Code" required className="w-1/2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                </div>
                <div className="flex gap-2">
                    <input onChange={(e) => setState(e.target.value)} value={state} type="text" placeholder="State" required className="w-1/2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                    <input onChange={(e) => setCountry(e.target.value)} value={country} type="text" placeholder="Country" required className="w-1/2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                </div>
              </>
            ) : (
              // LOGIN FIELD
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email}
                  type="text" 
                  placeholder="Email or Phone Number" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] transition"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                type="password" 
                placeholder="Password" 
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] transition"
              />
            </div>

            <button disabled={loading} className="bg-[#2bbef9] hover:bg-[#209dd0] text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition mt-2 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" /> : (currentState === 'Sign Up' ? 'CREATE ACCOUNT' : 'LOGIN')}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {currentState === 'Sign Up' ? 'Already have an account?' : 'New to our store?'}
            <button 
              onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
              className="ml-2 font-bold text-[#233a95] hover:underline"
            >
              {currentState === 'Sign Up' ? 'Login here' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;