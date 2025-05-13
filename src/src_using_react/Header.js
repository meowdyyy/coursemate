import React, { useState } from 'react';

function Header() {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const toggleNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  return (
    <>
      <div className="topnav">
        <span className="toggle-btn" onClick={toggleNav}>☰</span>
        <div className="brand">LearnLink</div>
        <div className="nav-right">
          <button className="login-btn">Sign In</button>
          <a href="profile.html"><div className="profile-img"></div></a>
        </div>
      </div>

      <div id="mySidenav" className="sidenav" style={{ width: sideNavOpen ? '250px' : '0' }}>
        
        <a href="#"><i className="fas fa-home"></i> Home</a>
        <a href="#"><i className="fas fa-file-alt"></i> Shared Documents</a>
        <a href="#"><i className="fas fa-video"></i> VideoHub</a>
        <a href="#"><i className="fas fa-edit"></i> Editor</a>
        <a href="#"><i className="fas fa-upload"></i> Publish</a>
        <a href="#"><i className="fas fa-search"></i> Browse</a>
        <div>
          <a href="#">Contact Us</a>
          <p> &copy; LearnLink</p>
        </div>
      </div>
    </>
  );
}

export default Header;
