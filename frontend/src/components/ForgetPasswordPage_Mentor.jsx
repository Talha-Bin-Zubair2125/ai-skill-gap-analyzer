import React, { useState } from "react";
import axios from "axios";

export default function ForgetPasswordPage_Mentor() {
  // State to hold the email input value
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/mentor/forgot-password",
        { email },
      );
      // debugging: log the response data to the console
      console.log("Response data:", response.data);
      setSuccessMessage(response.data.message);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while processing your request.",
      );
    }
  };

  return (
    <>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </>
  );
}
