import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterComponent() {
  const [Firstname, setFirstname] = useState("");
  const [Middlename, setMiddlename] = useState("");
  const [Lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const data = {
    Firstname,
    Middlename,
    Lastname,
    email,
    password,
    role,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", data, { withCredentials: true });
      setFirstname("");
      setMiddlename("");
      setLastname("");
      setEmail("");
      setPassword("");
      setRole("");
      setError(null);
      setSuccess(response.data.message || "Registration successful");

      if (response.data.message === "Registration successful") {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setSuccess(null);
    }
  };

  return (
    <>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="Firstname">First Name:</label>
        <input
          type="text"
          placeholder="Enter First Name"
          value={Firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <label htmlFor="Middlename">Middle Name:</label>
        <input
          type="text"
          placeholder="Enter Middle Name"
          value={Middlename}
          onChange={(e) => setMiddlename(e.target.value)}
        />
        <label htmlFor="Lastname">Last Name:</label>
        <input
          type="text"
          placeholder="Enter Last Name"
          value={Lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
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
        Already have an account? <Link to="/">Login</Link>
      </p>
    </>
  );
}
