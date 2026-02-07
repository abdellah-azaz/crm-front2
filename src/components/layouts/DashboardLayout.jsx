import React, { useState } from 'react';
import VerticalNavbar from './VerticalNavbar';
import HorizontalNavbar from './HorizontalNavbar';
// We remove page imports since the content is passed as children

/**
 * DashboardLayout component.
 * This component wraps the entire dashboard view, including the two navigation bars
 * and manages the state for the vertical navbar's collapse. It renders content via children.
 */
const DashboardLayout = ({ children }) => { 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  // All internal page state management logic (activePage, handlePageChange, renderPage) is removed.

  // Adjust content margin based on sidebar state
  const contentMarginClass = isSidebarCollapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Vertical Sidebar (always visible) */}
      <VerticalNavbar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebar}
        // activePage and onNavClick props are no longer passed as VerticalNavbar uses react-router-dom hooks.
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Horizontal Navbar (fixed top) */}
        <HorizontalNavbar isCollapsed={isSidebarCollapsed} />

        {/* Page Content */}
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto pt-16 transition-all duration-300 ease-in-out ${contentMarginClass}`}
        >
          {/* Padding for content inside the main area */}
          {children} {/* Render children (the routed page component) */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;