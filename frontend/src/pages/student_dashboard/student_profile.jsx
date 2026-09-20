import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Student_profile() {
  const { profile, setProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/student/profile",
          {
            withCredentials: true,
          },
        );
        setProfile(response.data.user);
        setLoading(false);
        setSuccess(response.data.message || "Profile fetched successfully");
        setError(null);
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setLoading(false);
        setError("Error fetching student profile");
        setSuccess(null);
      }
    };

    fetchProfile();
  }, [setProfile]);

  const navigate = useNavigate();
  return (
    <>
      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p>{error}</p>
      ) : success ? (
        <p>{success}</p>
      ) : null}
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
                "http://localhost:3000/api/auth/logout",
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
