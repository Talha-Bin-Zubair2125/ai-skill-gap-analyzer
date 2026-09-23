import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage_Mentor() {
  const { token } = useParams();
  // log the token to the console for debugging
  console.log("Token from URL:", token);

  // State to hold the new password input value
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/mentor/reset-password`,
        { token, newPassword },
      );
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
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </>
  );
}
