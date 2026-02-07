import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextes/AuthContext';
import { Mail, Key, User, UserPlus, Lock, LogIn, Moon, Globe, HelpCircle } from 'lucide-react';
import ahLogo from '../../logos/ahlogo.png';
import './Register.css'

// ==================== HEADER COMPOSANT ====================
const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <img src={ahLogo} alt="AH Digital Logo" className="w-12 h-12 object-contain" />
          <div>
            <span className="text-lg font-semibold text-gray-900">SUISDIGITALIA</span>
            <p className="text-xs text-gray-500 -mt-1">Automation</p>
          </div>
        </div>

        {/* Navigation Icons and Buttons */}
        <nav className="flex items-center space-x-4 text-gray-600">
          <button className="p-2 rounded-full hover:bg-gray-100 transition duration-150" title="Dark Mode">
            <Moon size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition duration-150" title="Language">
            <Globe size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition duration-150" title="Help">
            <HelpCircle size={18} />
          </button>

          {/* S'inscrire Button */}
          <Link
            to="/register"
            className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-[#4E95E4] rounded-md shadow-md hover:bg-blue-600 transition duration-150"
          >
            <UserPlus size={16} />
            <span>S'inscrire</span>
          </Link>

          {/* Connexion Button */}
          <Link
            to="/login"
            className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-[#4E95E4] border border-[#4E95E4] rounded-md hover:bg-blue-50 transition duration-150"
          >
            <LogIn size={16} />
            <span>Connexion</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

// ==================== REGISTER FORM COMPOSANT ====================
const RegisterForm = ({ onSubmit, error, loading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      return onSubmit({ error: 'Passwords do not match' });
    }
    
    if (formData.password.length < 6) {
      return onSubmit({ error: 'Password must be at least 6 characters' });
    }
    
    onSubmit({ data: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key size={16} className="text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Sign Up Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4E95E4] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E95E4] disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </div>

      {/* Terms and Conditions */}
      <p className="text-xs text-center text-gray-500 mt-4">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-[#F5B041] hover:text-orange-600 font-medium" onClick={(e) => e.preventDefault()}>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-[#F5B041] hover:text-orange-600 font-medium" onClick={(e) => e.preventDefault()}>
          Privacy Policy
        </a>
      </p>
    </form>
  );
};

// ==================== REGISTER PAGE PRINCIPALE ====================
const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async ({ data, error: formError }) => {
    if (formError) {
      return setError(formError);
    }

    setError('');
    setLoading(true);

    try {
      const result = await register(data);
      
      if (result.success) {
        // Rediriger vers login avec message
        navigate('/login', {
          state: {
            message: 'Registration successful! Please login to continue.',
            registeredEmail: data.email
          },
          replace: true
        });
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <Header />

      {/* Centered Register Card */}
      <div className="flex flex-col justify-center items-center py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          
          {/* Logo and Title */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src={ahLogo} alt="suisdigitalia Logo" className="w-14 h-14 object-contain" />
            </div>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Join SUISDIGITALIA
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Create your account to get started
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Account Information</span>
            </div>
          </div>
          
          {/* Register Form */}
          <RegisterForm 
            onSubmit={handleRegister} 
            error={error} 
            loading={loading}
          />

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-[#4E95E4] hover:text-blue-600 transition duration-150"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;