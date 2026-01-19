import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Lock, Mail, ArrowLeft, Loader2, Phone, MapPin, KeyRound } from 'lucide-react';

const Login = () => {
  const { token, setToken, backendUrl, navigate, getUserData } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState('Login');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); 
  
  // Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  // Address
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  // Country is removed from state as it's static

  // Password Validation State
  const [passwordWarning, setPasswordWarning] = useState('');

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length > 0 && val.length < 8) {
      setPasswordWarning("Password must be at least 8 characters");
    } else {
      setPasswordWarning("");
    }
  };

  // 1. Function to Send OTP
  const handleSendOtp = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const res = await axios.post(backendUrl + '/api/user/send-otp', { email });
          if (res.data.success) {
              toast.success("OTP Sent to " + email);
              setOtpSent(true);
          } else {
              toast.error(res.data.message);
          }
      } catch (error) {
          toast.error(error.message);
      } finally {
          setLoading(false);
      }
  }

  // 2. Main Submit
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Block submit if password is too short
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        // --- FINAL REGISTER ---
        // Hardcoded Country as Bangladesh
        const address = { street, city, state, zipcode, country: 'Bangladesh' };
        
        const response = await axios.post(backendUrl + '/api/user/register', { 
            name, email, phone, password, address, otp 
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await getUserData(response.data.token);
          toast.success("Account Created Successfully!");
          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      } else {
        // --- LOGIN ---
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          await getUserData(response.data.token);
          toast.success("Welcome Back!");
          navigate('/');
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

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#2bbef9] transition">
        <ArrowLeft size={20} />
        <span className="font-bold">Back to Shop</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 my-10">
        
        <div className="bg-[#233a95] p-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            {currentState === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-blue-200 mt-2 text-sm">
            {currentState === 'Sign Up' ? 'Join our grocery community' : 'Login to manage your orders'}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={otpSent || currentState === 'Login' ? onSubmitHandler : handleSendOtp} className="flex flex-col gap-4">
            
            {/* --- SIGN UP FORM --- */}
            {currentState === 'Sign Up' ? (
              <>
                {!otpSent ? (
                    // STEP 1: Details
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

                        {/* Address Fields */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input onChange={(e) => setStreet(e.target.value)} value={street} type="text" placeholder="Street Address" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9]" />
                        </div>
                        <div className="flex gap-2">
                            <input onChange={(e) => setCity(e.target.value)} value={city} type="text" placeholder="City" required className="w-1/2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                            <input onChange={(e) => setZipcode(e.target.value)} value={zipcode} type="text" placeholder="Zip Code" required className="w-1/2 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                        </div>
                        
                        {/* Modified: State only, Country is hidden */}
                        <div className="flex gap-2">
                            <input onChange={(e) => setState(e.target.value)} value={state} type="text" placeholder="State" required className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-sm" />
                        </div>

                        {/* Password with Warning */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input onChange={handlePasswordChange} value={password} type="password" placeholder="Password (Min 8 chars)" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9]" />
                        </div>
                        {passwordWarning && <p className="text-red-500 text-xs ml-1">{passwordWarning}</p>}

                        <button disabled={loading} className="bg-[#233a95] text-white font-bold py-3 rounded mt-2 hover:bg-blue-800 transition flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin"/> : "VERIFY & SIGN UP"}
                        </button>
                    </>
                ) : (
                    // STEP 2: OTP (Unchanged)
                    <div className='animate-fade-in'>
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4 text-sm">
                            We have sent a verification code to <b>{email}</b>.
                        </div>
                        <div className="relative mb-4">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input onChange={(e) => setOtp(e.target.value)} value={otp} type="text" placeholder="Enter 6-digit OTP" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] text-lg tracking-widest text-center" maxLength={6} />
                        </div>
                        <button disabled={loading} className="bg-[#2bbef9] w-full text-white font-bold py-3 rounded hover:bg-[#209dd0] transition flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin"/> : "CONFIRM & REGISTER"}
                        </button>
                        <p className='text-center text-sm text-gray-500 mt-4 cursor-pointer hover:text-black' onClick={()=>setOtpSent(false)}>Back to Details</p>
                    </div>
                )}
              </>
            ) : (
              // --- LOGIN FORM ---
              <>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email or Phone Number" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9]" />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9]" />
                </div>
                <button disabled={loading} className="bg-[#233a95] text-white font-bold py-3 rounded mt-2 hover:bg-blue-800 transition flex items-center justify-center">
                    {loading ? <Loader2 className="animate-spin"/> : "LOGIN"}
                </button>
              </>
            )}

          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {currentState === 'Sign Up' ? 'Already have an account?' : 'New to our store?'}
            <button 
              onClick={() => {
                  setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login');
                  setOtpSent(false); 
              }}
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