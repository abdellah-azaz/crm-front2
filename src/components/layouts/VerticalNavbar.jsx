import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronsLeft,
  Search,
  Grid,
  BarChart2,
  Facebook,
  MessageSquare,
  Users,
  Briefcase,
  Layers,
  HardHat,
  Monitor,
  Calendar, // Added for Calendar button
  Brain, // Added for Knowledge Base button
} from 'lucide-react';
import ahLogo from '../../logos/ahlogo.png';

// Navigation data now includes paths for router linking
const getNavLinksData = (t) => [
  { name: t('setup'), icon: Grid, path: '/setup' },
  { name: t('dashboard'), icon: BarChart2, path: '/dashboard' },
  { name: t('knowledge_base'), icon: Brain, path: '/knowledge-base' },
  { name: t('calendar'), icon: Calendar, path: '/calendar' },
  { name: t('facebook_ads'), icon: Facebook, path: '/facebookads' },
  { name: t('conversations'), icon: MessageSquare, path: '/conversations' },
  { name: t('team_chat'), icon: Users, path: '/team-chat' },
  { name: t('apps'), icon: Briefcase, path: '/apps' },
  { name: t('pipeline'), icon: HardHat, path: '/pipelines' },
  { name: t('clients'), icon: Users, path: '/clients' },
  { name: t('landing_pages'), icon: Monitor, path: '/landing-pages' },
  { type: 'separator', name: '' },
  { name: t('enterprise'), icon: Briefcase, path: '/entreprise' },
  { name: t('profile'), icon: Users, path: '/profile' },
  { name: t('team'), icon: Users, path: '/equipe' }
];

/**
 * VerticalNavbar component.
 * @param {boolean} isCollapsed - Whether the navbar is in a collapsed (minimized) state.
 * @param {function} toggleCollapse - Function to toggle the collapsed state.
 */
const VerticalNavbar = ({ isCollapsed, toggleCollapse }) => {
  const { t } = useTranslation();
  const navLinksData = getNavLinksData(t);
  const location = useLocation();
  const widthClass = isCollapsed ? 'w-20' : 'w-64';
  const logoSize = isCollapsed ? 'w-8 h-8' : 'w-6 h-6';

  // Helper to determine active link state based on router location
  const isCurrent = (path) => {
    // Treat '/' as active for '/setup' for the default case
    if (path === '/setup') {
        return location.pathname === '/' || location.pathname === '/setup';
    }
    // Simple startWith check for other routes
    return location.pathname.startsWith(path);
  };
  
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30 flex flex-col ${widthClass}`}
    >
      {/* Top Section: Logo, App Name, and Collapse Button */}
      <div className="flex items-center justify-between h-16 px-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img src={ahLogo} alt="AH Digital Logo" className={`${logoSize} object-contain`} />
            <div>
              <span className="text-lg font-semibold text-gray-900 leading-none">Suis Digital</span>
              <p className="text-xs text-gray-500 leading-none">MA</p>
            </div>
          </div>
        )}
        {/* Toggle Button */}
        <button
          className={`p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-150 ${isCollapsed ? 'mx-auto' : ''}`}
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronsLeft size={20} className={isCollapsed ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Profile/Search Section (only when expanded) */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            {/* Suis Digital MA Profile */}
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full text-sm">
              MA
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900 leading-none">Suis Digital</p>
              <p className="text-xs text-gray-500 leading-none">MA</p>
            </div>
            <ChevronsLeft size={16} className="ml-auto text-gray-500" />
          </div>
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              className="w-full pl-10 pr-2 py-1 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 p-1 border border-gray-300 rounded">
              ctrl K
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto pt-2 pb-4">
        {!isCollapsed && (
          <div className="px-4 mb-2">
            <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">{t('main')}</span>
          </div>
        )}
        <nav className="space-y-1">
          {navLinksData.map((item) => {
              if (item.type === 'separator') {
                return !isCollapsed ? (
                  <div key={item.name} className="px-4 py-2">
                    <div className="border-t border-gray-200 pt-2">
                      <span className="text-xs text-gray-400">{item.name}</span>
                    </div>
                  </div>
                ) : (
                  <div key={item.name} className="px-4 py-2">
                    <div className="border-t border-gray-200"></div>
                  </div>
                );
              }
            const Icon = item.icon;
            const current = isCurrent(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center w-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  current
                    ? 'bg-blue-500 text-white rounded-r-full shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''} ${
                    current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer (if needed) */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">v1.0.0</p>
      </div>
    </div>
  );
};

export default VerticalNavbar;