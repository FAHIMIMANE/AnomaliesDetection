import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './login.css';
import LoginImage from '../../assets/login.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Ensure this is defined
  const [isLoading, setIsLoading] = useState(false);

  const validateInputs = () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username and password are required.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setIsLoading(true);
    const loginData = { username, password };

    try {
      const response = await fetch('http://localhost:8082/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseText = await response.text();

      if (response.ok) {
        let result;
        try {
          result = JSON.parse(responseText);
        } catch {
          result = { token: responseText };
        }

        if (result.token) {
          const decodedToken = JSON.parse(atob(result.token.split('.')[1]));
          const roles = decodedToken.roles || [];

          Swal.fire({
            icon: 'success',
            title: 'Connected successfully!',
            text: `Welcome back, ${username}.`,
            confirmButtonText: 'OK',
          }).then(() => {
            localStorage.setItem('token', result.token);
            localStorage.setItem('roles', JSON.stringify(roles));
            window.location.href = '/home';
          });
        } else {
          setErrorMessage('Token not provided by the server.');
        }
      } else {
        let errorResponse;
        try {
          errorResponse = JSON.parse(responseText);
        } catch {
          errorResponse = { message: responseText };
        }
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: errorResponse.message || 'Invalid credentials.',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred',
        text: 'Please try again later.',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="login-container">
        <div className="login-left">
          <h2>Login</h2>
          {errorMessage && (
              <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                {errorMessage}
              </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
              />
            </div>
            <button
                type="submit"
                className="login-button"
                disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="signup">
            <p>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </div>
        <div className="login-right">
          <img src={LoginImage} alt="Login Illustration" className="login-image" />
        </div>
      </div>
  );
}

export default Login;
