import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Mentor_LoginComponent() {
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
        "http://localhost:3000/api/auth/login/mentor",
        { email, password },
        { withCredentials: true },
      );
      console.log("Mentor login response:", response.data); // Debugging: Log the response data
      setUser(response.data.user); // Store user data in state
      setSuccess(response.data.message || "Login successful");
      setError(null);
      if (response.data.user.role === "mentor") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/");
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      setSuccess(null);
      console.error("Error during mentor login:", error); // Debugging: Log the error
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
