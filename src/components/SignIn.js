import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5050/users/signin', {
        email,
        password,
      });

      // Save JWT token in localStorage
      localStorage.setItem('authToken', response.data.token);

      // Navigate to profile page or any protected route
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="container" style={{ marginLeft: '25%', display: 'flex', width: '50%', height: 'max-content', padding: '100px 0px', marginTop: '100px' }}>
      <div className="topnav" style={{ alignItems: 'center', alignContent: 'center', alignSelf: 'center', textAlign: 'center', display: 'block' }}>
        <div className="brand" onClick={() => window.location.href = "/"}>CourseMate</div>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-title">LOG IN</div>
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Enter Button */}
        <button className="enter-btn" type="submit">Enter</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="login-link" onClick={() => window.location.href = "/SignUp"}>
        CREATE AN ACCOUNT? Sign Up!
      </div>
    </div>
  );
};

export default SignIn;