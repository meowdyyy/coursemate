import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import TopNav from './components/topnav';
import SideNav from './components/sidenav';
import Hero from './components/hero';
import Features from './components/features';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Upload from './components/Upload';
import Browse from './components/Browse';
import DocumentView from './components/DocumentView';
import VideoHub from './components/VideoHub';
import Star from './components/starr';
import FileDetails from './components/FileDetails';
import EditFilePage from './components/EditFilePage';
import Dashboard from './components/Dashboard';
import ContactUs from './components/ContactUs';

import './App.css';

function App() {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const toggleNav = () => {
    setSideNavOpen((prevState) => !prevState);
  };

  
  // Check if the user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  // Close the sidenav if the user navigates to /signin, /signup or any unauthenticated page
  useEffect(() => {
    // We only want to close the sidenav if the user is navigating to login/signup,
    // or the user is not authenticated and trying to access restricted pages.
    const closeNavOnAuthChange = () => {
      if (isAuthenticated()) {
        // User is authenticated, don't close the nav
        return;
      } else {
        setSideNavOpen(false);
      }
    };

    closeNavOnAuthChange();
  }, [isAuthenticated()]);

  const HomePage = () => (
    <div className="main-content">
      <Hero />
      <Features />
    </div>
  );

  return (
    // Wrapping with BrowserRouter
    <BrowserRouter>
      <div className="App">
        <TopNav toggleNav={toggleNav} />
        <SideNav isOpen={sideNavOpen} setIsOpen={setSideNavOpen} />
        <div className={`main-content ${sideNavOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path="/" element={HomePage()} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/signin" />} />
            <Route path="/upload" element={isAuthenticated() ? <Upload /> : <Navigate to="/signin" />} />
            <Route path="/browse" element={isAuthenticated() ? <Browse /> : <Navigate to="/signin" />} />
            <Route path="/starred" element={isAuthenticated() ? <Star /> : <Navigate to="/signin" />} />
            <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/editfile/:fileId" element={<EditFilePage/>} />
            <Route path="/fileview/:fileId" element={<FileDetails/>} />
            <Route path="/videohub" element={isAuthenticated() ? <VideoHub /> : <Navigate to="/signin" />} />
            <Route path="/document/:id" element={<DocumentView />} />
            <Route path="/document" element={<DocumentView />} />
            {/* Add the ContactUs route */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="*" element={<div>404 Page Not Found</div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
