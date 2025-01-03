import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import '../../styles/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/admin/companies');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const testCredentials = {
    admin: {
      email: 'admin@test.com',
      password: 'admin123',
    },
    user: {
      email: 'user@test.com',
      password: 'user123',
    },
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    setError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let fieldError = '';

    if (name === 'email') {
      fieldError = validateEmail(value);
    } else if (name === 'password') {
      fieldError = validatePassword(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const emailError = validateEmail(credentials.email);
    const passwordError = validatePassword(credentials.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    // If there are any validation errors, don't proceed
    if (emailError || passwordError) {
      return;
    }

    // Check credentials
    if (credentials.email === testCredentials.admin.email && 
        credentials.password === testCredentials.admin.password) {
      // Login as admin
      dispatch({ 
        type: 'auth/login', 
        payload: { 
          role: 'admin',
          user: { email: credentials.email }
        } 
      });
      navigate('/admin/companies');
    } else if (credentials.email === testCredentials.user.email && 
               credentials.password === testCredentials.user.password) {
      // Login as user
      dispatch({ 
        type: 'auth/login', 
        payload: { 
          role: 'user',
          user: { email: credentials.email }
        } 
      });
      navigate('/user/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Calendar App Login</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button type="submit">Login</Button>
        </form>

        <div className="test-credentials">
          <h3>Test Credentials</h3>
          <div className="credentials-box">
            <strong>Admin Account:</strong>
            <br />
            Email: {testCredentials.admin.email}
            <br />
            Password: {testCredentials.admin.password}
          </div>
          <div className="credentials-box">
            <strong>User Account:</strong>
            <br />
            Email: {testCredentials.user.email}
            <br />
            Password: {testCredentials.user.password}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 