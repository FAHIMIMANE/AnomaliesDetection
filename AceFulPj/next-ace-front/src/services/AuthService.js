import axios from 'axios';

const BASE_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080";

const AuthService = {
  login: async (username, password) => {
    console.log(username, password)
    try {
      const response = await axios.post(`${BASE_URL}/userservice/auth/login`, {
        username,
        password,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to login');
      } else if (error.request) {
        throw new Error('No response received from the server');
      } else {
        throw new Error(error.message || 'Failed to login');
      }
    }
  },

  register: async (username, email, password, role = "ROLE_USER") => {
    try {
      const response = await axios.post(`${BASE_URL}/userservice/auth/register`, {
        username,
        email,
        password,
        roles: [{ name: role }],
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to register');
      } else if (error.request) {
        throw new Error('No response received from the server');
      } else {
        throw new Error(error.message || 'Failed to register');
      }
    }
  },
};

export default AuthService;
