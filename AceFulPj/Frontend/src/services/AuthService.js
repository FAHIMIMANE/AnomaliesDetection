const BASE_URL = process.env.REACT_APP_GATEWAY_URL || "http://localhost:8080";

const AuthService = {
  login: async (username, password) => {
    const response = await fetch(`${BASE_URL}/userservice/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }
    return response.json();
  },

  register: async (username, email, password, role = "ROLE_USER") => {
    const response = await fetch(`${BASE_URL}/userservice/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        roles: [{ name: role }],
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register');
    }
    return response.json();
  },
};

export default AuthService;
