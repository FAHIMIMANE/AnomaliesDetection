"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthService from "@/services/AuthService"; // Adjust the path based on your project structure

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const data = await AuthService.login(username, password);

      // Save the token in cookies
      Cookies.set("token", data.token);
      Cookies.set("loggedin", true);

      // Extract role names from the roles array
      const roleNames = data.roles.map((role) => role.name);

      // Role-based redirection
      if (roleNames.includes("ROLE_ADMIN")) {
        router.push("/admin/home");
      } else if (roleNames.includes("ROLE_USER")) {
        router.push("/client/home");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="container mt-5 p-4 border rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {error && <div className="alert alert-danger">{error}</div>}
          <div>
            <label htmlFor="username" className="form-label">Username:</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                required
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label">Password:</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
  );
};

export default Login;
