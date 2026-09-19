import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Student_profile() {
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      <h1>Student Profile</h1>
      {profile ? (
        <div>
          <p>First Name: {profile.Firstname}</p>
          <p>Middle Name: {profile.Middlename}</p>
          <p>Last Name: {profile.Lastname}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      <button
        onClick={() => {
          const logout = async () => {
            try {
              const response = await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                { withCredentials: true },
              );
              console.log(response.data.message); // Logout successful
              navigate("/"); // Redirect to login page
            } catch (error) {
              console.error("Error during logout:", error);
            }
          };
          logout();
        }}
      >
        Logout
      </button>
    </>
  );
}
