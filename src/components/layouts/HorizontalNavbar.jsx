import React, { useState, useRef, useEffect } from 'react';
import { Moon, Bell, ChevronDown } from 'lucide-react';
import ProfileDropdown from '../ui/ProfileDropdown';

/**
 * HorizontalNavbar component.
 * This component will be fixed at the top and span the full window width.
 * The Vertical Navbar (z-30) will display on top of it (z-20).
 * @param {boolean} isCollapsed - The collapsed state of the Vertical Navbar.
 */
const HorizontalNavbar = ({ isCollapsed }) => {
  // Removed marginLeftClass and style={{ left: ... }} to ensure full width.
  const [activeLang, setActiveLang] = useState('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref is used on the container div

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside the entire dropdown container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);


  const languages = [
    { code: 'Arabic', label: 'Arabic' },
    { code: 'English', label: 'English' },
    { code: 'French', label: 'French' },
  ];
  const handleLangChange = (lang) => {
    setActiveLang(lang);
    console.log(`Language changed to: ${lang}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-white shadow-sm border-b border-gray-200 transition-all duration-300 ease-in-out z-20 flex items-center justify-between px-6`}
    >
      {/* Left side: (Empty based on image, but reserved for breadcrumbs/title) */}
      <div className="flex items-center">
        {/* Placeholder for left-side content */}
      </div>

      {/* Right side: Icons and Profile */}
      <nav className="flex items-center space-x-4 text-gray-600">
        {/* Languages Selector (MOVED HERE) */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`px-3 py-1 rounded-md transition-colors duration-150 ${
                activeLang === lang.code
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'hover:bg-white'
              }`}
              onClick={() => handleLangChange(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
        
        <button className="p-2 rounded-full hover:bg-gray-100 transition duration-150" title="Dark Mode">
          <Moon size={18} />
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-100 transition duration-150 relative" title="Notifications">
            <Bell size={18} />
            {/* Notification dot placeholder */}
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative border-l pl-4" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white font-bold rounded-full text-sm">
              W
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          <ProfileDropdown isOpen={isDropdownOpen} />
        </div>
      </nav>
    </header>
  );
};

export default HorizontalNavbar;