import React, { useState } from "react";
import axios from "axios";

export default function ForgetPasswordPage_Student() {
  // State to hold the email input
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/students/forget-password",
        { email },
      );
      setSuccessMessage(response.data.message);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Enter your email:
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </>
  );
}
