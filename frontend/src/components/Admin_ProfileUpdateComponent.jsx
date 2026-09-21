import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Admin_ProfileUpdateComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("Admin ID from URL:", id);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // You can use the `id` to fetch the admin profile data or perform any other operations as needed.
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/auth/admin/profile/${id}`,
          {
            withCredentials: true,
          },
        );

        setProfileData(response.data.user);
        setSuccessMessage(
          response.data.message || "Profile fetched successfully",
        );
        setErrorMessage(null);
        console.log("Fetched admin profile data:", response.data.user);
        setProfileData(response.data.user);
      } catch (error) {
        setErrorMessage("Error fetching admin profile data");
        setSuccessMessage(null);
        console.error("Error fetching admin profile data:", error);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/auth/admin/profile-update/${id}`,
        profileData,
        {
          withCredentials: true,
        },
      );
      setSuccessMessage(
        response.data.message || "Profile updated successfully",
      );
      setErrorMessage(null);
      console.log("Updated admin profile data:", response.data.user);
    } catch (error) {
      setErrorMessage("Error updating admin profile data");
      setSuccessMessage(null);
      console.error("Error updating admin profile data:", error);
    }
  };

  return (
    <>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
          />
        </label>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            value={profileData.email}
            autoComplete="new-email"
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            value={profileData.password}
            autoComplete="new-password"
            onChange={(e) =>
              setProfileData({ ...profileData, password: e.target.value })
            }
          />
        </label>
        <label htmlFor="role">
          Role:
          <input
            type="text"
            id="role"
            value={profileData.role}
            onChange={(e) =>
              setProfileData({ ...profileData, role: e.target.value })
            }
            disabled
          />
        </label>
        <button type="submit">Update Profile</button>
        <button type="button" onClick={() => navigate("/admin-dashboard")}>
          Back
        </button>
      </form>
    </>
  );
}
