import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Student_LoginComponent() {
  // States
  const [user, setUser] = useState(null); // for storing user data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Login function of student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login/student",
        { email, password },
        { withCredentials: true },
      );
      setEmail("");
      setPassword("");
      setError(null);
      setUser(response.data.user); // Store user data in state
      setSuccess(response.data.message || "Login successful");
      if (response.data.user.role === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.response?.data?.message || "Login failed");
      setSuccess(null);
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

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Forgot your password?{" "}
        <Link to="/forget-password-student">Reset Password</Link>
      </p>
    </>
  );
}
