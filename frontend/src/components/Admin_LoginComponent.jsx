import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin_LoginComponent() {
  // States
  const [user, setUser] = useState(null); // for storing user data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login/admin",
        { email, password },
        { withCredentials: true },
      );
      console.log("Admin login response:", response.data);
      setUser(response.data.user); // Store user data in state
      setSuccess(response.data.message || "Login successful");
      setError(null);
      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      setSuccess(null);
      console.error("Error during admin login:", error);
    }
  };

  return (
    <>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          autoComplete="new-email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
