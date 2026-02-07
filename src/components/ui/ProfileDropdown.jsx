import React from 'react';
import { User, Settings, Moon, LogOut } from 'lucide-react';

const menuItems = [
  { icon: User, label: 'Profile', color: 'text-gray-700', action: () => console.log('Action: Go to Profile') },
  { icon: Settings, label: 'Settings', color: 'text-gray-700', action: () => console.log('Action: Go to Settings') },
  { icon: Moon, label: 'Dark Mode', color: 'text-gray-700', action: () => console.log('Action: Toggle Dark Mode') },
  { icon: LogOut, label: 'Log Out', color: 'text-red-500', action: () => console.log('Action: Log Out') },
];

/**
 * ProfileDropdown component.
 * Displays a dropdown menu for user actions.
 * @param {boolean} isOpen - Controls the visibility of the dropdown.
 */
const ProfileDropdown = ({ isOpen, user = { name: 'ws', email: 'quiosk.ah@gmail.com' } }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu"
    >
      {/* User Info Header */}
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">
          Welcome {user.name}
        </p>
        <p className="truncate text-xs text-gray-500">
          {user.email}
        </p>
      </div>

      {/* Menu Items */}
      <div className="py-1" role="none">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150 ${item.color} hover:bg-gray-50`}
              role="menuitem"
            >
              <Icon size={18} className={`mr-3 ${item.color} group-hover:text-gray-900`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileDropdown;