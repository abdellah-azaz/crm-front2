import React, { useState } from 'react';
import { Mail, Key, UserPlus, LogIn, Moon, Globe, HelpCircle } from 'lucide-react';
import ahLogo from '../../logos/ahlogo.png';

// Estimated colors from the image:
// Primary blue: #4E95E4 (used for buttons and accents)
// Orange-yellow accent: #F5B041 (used for links/forgot password)
// Logo colors: Multi-colored, will use a simplified placeholder or just text.

const Header = () => {
  // Navigation component with logo and right-side icons/buttons
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          {/* Using the imported logo: front/src/logos/ahlogo.png */}
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

          {/* S'inscrire Button (Blue solid) */}
          <button
            className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-[#4E95E4] rounded-md shadow-md hover:bg-blue-600 transition duration-150"
            onClick={() => console.log('Button: S\'inscrire clicked')}
          >
            <UserPlus size={16} />
            <span>S'inscrire</span>
          </button>

          {/* Connexion Button (Outline) */}
          <button
            className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-[#4E95E4] border border-[#4E95E4] rounded-md hover:bg-blue-50 transition duration-150"
            onClick={() => console.log('Button: Connexion clicked')}
          >
            <LogIn size={16} />
            <span>Connexion</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="appearance-none block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {/* Placeholder icon for showing password (like the eye or the cursor hand) */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
            <span className="text-yellow-600 cursor-pointer" title="Show Password">
                {/* Using a placeholder character/emoji for the icon */}
                <span role="img" aria-label="cursor">✍️</span>
            </span>
          </div>
        </div>
      </div>

      {/* Account Links (Create and Forgot) */}
      <div className="flex justify-between text-sm">
        <button
            type="button"
            className="font-medium text-[#F5B041] hover:text-orange-600"
            onClick={() => console.log('Link: Create an account clicked')}
        >
            Create an account
        </button>
        <button
            type="button"
            className="font-medium text-[#F5B041] hover:text-orange-600"
            onClick={() => console.log('Link: Forgot password clicked')}
        >
            Forgot password?
        </button>
      </div>

      {/* Sign In Button */}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4E95E4] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E95E4]"
        >
          Sign in
        </button>
      </div>

      {/* Terms and Conditions */}
      <p className="text-xs text-center text-gray-500 mt-6">
        By signing in you agree to our{' '}
        <a href="#" className="text-[#F5B041] hover:text-orange-600" onClick={(e) => { e.preventDefault(); console.log('Link: Terms and Conditions clicked'); }}>
            Terms and Conditions
        </a>
      </p>
    </form>
  );
};


const LoginPage = () => {
    // Function to handle form submission (logs data instead of fetching)
    const handleLogin = ({ email, password }) => {
        console.log('Login attempt with data:');
        console.log('Email:', email);
        console.log('Password:', password);
        // You can add further dummy logic here if needed
    };

    // The entire layout is a full page centered login form with a persistent header
    return (
        <div className="min-h-screen bg-gray-50 pt-16"> {/* Add pt-16 for header clearance */}
            <Header />

            {/* Centered Login Card */}
            <div className="flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    
                    {/* AH Digital Logo and Sign In Text */}
                    <div className="text-center">
                         {/* Using the imported logo: front/src/logos/ahlogo.png */}
                        <div className="flex justify-center mb-4">
                            <img src={ahLogo} alt="suisdigitalia Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                            SUISDIGITALIA
                        </h2>
                        <p className="mt-2 text-center text-xl text-gray-600">
                            Sign into your account
                        </p>
                    </div>
                    
                    {/* The Login Form */}
                    <LoginForm onSubmit={handleLogin} />

                </div>
            </div>
        </div>
    );
};

export default LoginPage;