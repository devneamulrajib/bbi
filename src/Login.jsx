import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Back to Home Link */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[#2bbef9] transition">
        <ArrowLeft size={20} />
        <span className="font-bold">Back to Shop</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-[#233a95] p-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-blue-200 mt-2 text-sm">
            {isSignUp ? 'Join our grocery community' : 'Login to manage your orders'}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form className="flex flex-col gap-5">
            
            {/* Name Field (Only for Sign Up) */}
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] transition"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2bbef9] transition"
              />
            </div>

            <button className="bg-[#2bbef9] hover:bg-[#209dd0] text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition mt-2">
              {isSignUp ? 'SIGN UP' : 'LOGIN'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isSignUp ? 'Already have an account?' : 'New to our store?'}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 font-bold text-[#233a95] hover:underline"
            >
              {isSignUp ? 'Login here' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;