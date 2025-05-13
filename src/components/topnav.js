import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function TopNav({ toggleNav }) {
  const navigate = useNavigate();
  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="topnav">
      <span className="toggle-btn" onClick={toggleNav}>☰</span>
      <Link to="/" className="brand">CourseMate</Link>
      <div className="nav-right">
        {/* Only show the "Sign In" link if the user is not authenticated */}
        {!isAuthenticated() ? (
          <>
            <Link to="/signin"><button className="login-btn">Sign In</button></Link>
            <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
          </>
        ) : (
          <>
            {/* If authenticated, show the "Log Out" button */}
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            <Link to="/profile"><div className="profile-img"></div></Link>
          </>
        )}
      </div>
    </div>
  );
}

export default TopNav;