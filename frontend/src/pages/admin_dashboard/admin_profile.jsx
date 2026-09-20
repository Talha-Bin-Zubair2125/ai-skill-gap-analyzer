import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin_profile() {
  const { profile, setProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch the profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/admin/profile",
          {
            withCredentials: true,
          },
        );
        setProfile(response.data.user);
        setLoading(false);
        setSuccess(response.data.message || "Profile fetched successfully");
        setError(null);
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        setLoading(false);
        setError("Error fetching admin profile");
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

      <h1>Admin Profile</h1>
      {profile ? (
        <div>
          <p>Name : {profile.name}</p>
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
