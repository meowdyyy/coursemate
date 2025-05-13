import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function SideNav({ isOpen, setIsOpen }) {
  const location = useLocation();

  // Close sidenav when navigating to Sign In or Sign Up
  useEffect(() => {
    if (location.pathname === "/signin" || location.pathname === "/signup") {
      setIsOpen(false);
    }
  }, [location, setIsOpen]);

  return (
    <div id="mySidenav" className="sidenav" style={{ width: isOpen ? '12%' : '0' }}>
      <Link to="/"><i className="fas fa-home"></i> Home</Link>
      <Link to="/dashboard"><i className="fas fa-th-large"></i> Dashboard</Link>
      <Link to="/videohub"><i className="fas fa-video"></i> VideoHub</Link>
      <Link to="/upload"><i className="fas fa-upload"></i> Publish</Link>
      <Link to="/browse"><i className="fas fa-search"></i> Browse</Link>
      {/* Add Contact Us link */}
      <Link to="/contact"><i className="fas fa-envelope"></i> Contact Us</Link>

      <div>
        <a href="#"> &copy; CourseMate</a>
      </div>
    </div>
  );
}

export default SideNav;