import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNav from './topnav';
import SideNav from './sidenav';

const Layout = ({ children, toggleNav, sideNavOpen }) => {
  const location = useLocation();

  return (
    <div className="layout">
      {/* Conditionally render Top Navigation */}
      {location.pathname !== '/profile' && (
        <TopNav toggleNav={toggleNav} />
      )}

      {/* Conditionally render Side Navigation */}
      {location.pathname !== '/profile' && (
        <SideNav isOpen={sideNavOpen} />
      )}

      {/* Main Content Area */}
      <div className={`main-content ${sideNavOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;