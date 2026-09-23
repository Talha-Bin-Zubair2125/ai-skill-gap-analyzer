import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Mentor_profile() {
  const { profile, setProfile } = useContext(AuthContext);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/mentor/profile",
          {
            withCredentials: true,
          },
        );
        setProfile(response.data.user);
        setId(response.data.user._id);
        setLoading(false);
        setSuccess(response.data.message || "Profile fetched successfully");
        setError(null);
        console.log("Mentor ID:", response.data.user._id);
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
        setLoading(false);
        setError("Error fetching mentor profile");
        setSuccess(null);
      }
    };

    fetchProfile();
  }, [setProfile]);

  return (
    <>
      {loading ? (
        <p>Loading profile...</p>
      ) : error ? (
        <p>{error}</p>
      ) : success ? (
        <p>{success}</p>
      ) : null}
      <h1>Mentor Profile</h1>
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
              navigate("/mentor-login"); // Redirect to login page
            } catch (error) {
              console.error("Error during logout:", error);
            }
          };
          logout();
        }}
      >
        Logout
      </button>
      <button onClick={() => navigate(`/mentor/profile/update/${id}`)}>
        Update Profile
      </button>
    </>
  );
}
