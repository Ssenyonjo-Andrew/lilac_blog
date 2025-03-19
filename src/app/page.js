"use client"; // Mark this component as a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of react-router-dom
import './globals.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // Use useRouter from next/navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:2001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token to localStorage
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        
        // Redirect to the appropriate dashboard based on role
        if (data.role === 'admin') {
          router.push('/admin-dashboard');
        } else if (data.role === 'president') {
          router.push('/president-dashboard');
        } else {
          router.push('/user-dashboard');
        }
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>WEBER</h1>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      {/* Link to the sign-up page */}
      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign up here</a>.
      </p>
    </div>
  );
};

export default LoginPage;