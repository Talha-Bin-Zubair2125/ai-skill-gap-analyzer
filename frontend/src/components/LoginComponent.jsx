import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginComponent() {
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "",
        { email, password },
        { withCredentials: true },
      );
      setEmail("");
      setPassword("");
      setError(null);
      setSuccess(response.data.message || "Login successful");

      if (
        response.data.message === "Login successful" &&
        response.data.user.role === "student"
      ) {
        navigate("/student-dashboard");
      } else if (
        response.data.message === "Login successful" &&
        response.data.user.role === "admin"
      ) {
        navigate("/admin-dashboard");
      } else if (
        response.data.message === "Login successful" &&
        response.data.user.role === "mentor"
      ) {
        navigate("/mentor-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </>
  );
}
