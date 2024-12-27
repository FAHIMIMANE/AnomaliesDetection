import React, { useState } from 'react';
import Swal from 'sweetalert2';
import AuthService from '../../services/AuthService';
import './signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_USER');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await AuthService.register(username, email, password, role);
      Swal.fire({
        icon: 'success',
        title: 'User registered successfully!',
        text: 'Your account has been created.',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.href = '/login';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Error',
        text: error.message || 'An error occurred.',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
      <div className="signup-container">
        <div className="signup-left">
          <h2>Sign up</h2>
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
              <label>Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
            <button type="submit" className="signup-button">
              Sign up
            </button>
          </form>
          <div className="options">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
        <div className="signup-right">
          <img src={LoginImage} alt="Signup Illustration" className="signup-image"/>
        </div>
      </div>
  );
}

export default Signup;
