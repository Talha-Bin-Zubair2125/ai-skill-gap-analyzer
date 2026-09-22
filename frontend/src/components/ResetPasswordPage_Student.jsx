import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage_Student() {
  const { token } = useParams();
  // debugging: log the token to the console
  console.log("Token from URL:", token);

  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/api/auth/student/reset-password", {
          token,
          password,
        });
        if (response.data.success) {
          setSuccessMessage("Password reset successfully!");
          setErrorMessage("");
        } else {
          setErrorMessage(response.data.message);
          setSuccessMessage("");
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        setErrorMessage("An error occurred while resetting the password.");
        setSuccessMessage("");
      }
  };

  return (
    <>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">
          Enter your new password:
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </>
  );
}
