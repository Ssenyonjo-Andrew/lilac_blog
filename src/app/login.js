"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  // Check for saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    setIsLoading(true);

    // Advanced validation
    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:2001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies if using session-based auth
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and handle remember me
        localStorage.setItem('token', data.token);
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }

        // Success notification
        alert('Login successful! Welcome back!');
        
        // Role-based redirect with transition
        const redirectMap = {
          admin: '/admin-dashboard',
          president: '/president-dashboard',
          default: '/user-dashboard'
        };
        
        const redirectPath = redirectMap[data.role] || redirectMap.default;
        router.prefetch(redirectPath); // Preload the destination page
        setTimeout(() => router.push(redirectPath), 300); // Slight delay for better UX
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo">WEBER</h1>
      <h2 className="title">Login to Your Account</h2>
      
      {error && (
        <div className="error-message alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={emailError ? 'input-error' : ''}
            disabled={isLoading}
            autoComplete="email"
            aria-describedby="email-error"
          />
          {emailError && (
            <span id="email-error" className="error-text">{emailError}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-container">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={passwordError ? 'input-error' : ''}
              disabled={isLoading}
              autoComplete="current-password"
              aria-describedby="password-error"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {passwordError && (
            <span id="password-error" className="error-text">{passwordError}</span>
          )}
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            Remember me
          </label>
          <a href="/forgot-password" className="forgot-password">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className={`login-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner">Loading...</span>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <p className="signup-link">
        Don't have an account?{' '}
        <a href="/signup" className="signup-anchor">
          Sign up here
        </a>
      </p>
    </div>
  );
};

export default LoginPage;