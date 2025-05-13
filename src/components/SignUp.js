import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      console.log('Sending signup request with data:', { fullName, email, phone, password: '***' });

      const response = await axios.post('http://localhost:5050/users/signup', {
        fullName,
        email,
        phone,
        password,
      });
      console.log('User registered:', response.data);

      // Navigate to the signin page
      navigate('/signin');
    } catch (err) {
      console.error('Signup error:', err);

      // More detailed error handling
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Server response:', err.response.data);
        setError(`Registration failed: ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', err.message);
        setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="container" style={{ marginLeft: '25%', display: 'flex', width: '50%', height: 'max-content', padding: '100px 0px', marginTop: '100px' }}>
      <div className="topnav" style={{ alignItems: 'center', alignContent: 'center', alignSelf: 'center', textAlign: 'center', display: 'block' }}>
        <div className="brand" onClick={() => navigate("/")}>CourseMate</div> {/* Use navigate() for routing */}
      </div>
      <h1>SIGN UP</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full-name">Full Name:</label>
          <input
            type="text"
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="sign-in" onClick={() => navigate('/SignIn')}> {/* Use navigate() for routing */}
        Already have an account? Sign In
      </div>
    </div>
  );
};

export default SignUp;