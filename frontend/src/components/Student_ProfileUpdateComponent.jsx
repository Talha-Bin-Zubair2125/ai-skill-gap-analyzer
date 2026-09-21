import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Student_ProfileUpdateComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    Firstname: "",
    Middlename: "",
    Lastname: "",
    email: "",
    password: "",
    role: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/auth/student/profile/${id}`,
          {
            withCredentials: true,
          },
        );
        setProfileData(response.data.user);
        setSuccessMessage(
          response.data.message || "Profile fetched successfully",
        );
        setErrorMessage(null);
        console.log("Fetched student profile data:", response.data.user);
      } catch (error) {
        setErrorMessage("Error fetching student profile data");
        setSuccessMessage(null);
        console.error("Error fetching student profile data:", error);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/auth/student/profile-update/${id}`,
        profileData,
        {
          withCredentials: true,
        },
      );
      setSuccessMessage(
        response.data.message || "Profile updated successfully",
      );
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Error updating student profile");
      setSuccessMessage(null);
      console.error("Error updating student profile:", error);
    }
  };
  return (
    <>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="Firstname"
            value={profileData.Firstname}
            onChange={(e) =>
              setProfileData({ ...profileData, Firstname: e.target.value })
            }
          />
        </label>
        <label>
          Middle Name:
          <input
            type="text"
            name="Middlename"
            value={profileData.Middlename}
            onChange={(e) =>
              setProfileData({ ...profileData, Middlename: e.target.value })
            }
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="Lastname"
            value={profileData.Lastname}
            onChange={(e) =>
              setProfileData({ ...profileData, Lastname: e.target.value })
            }
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profileData.email}
            autoComplete="new-email"
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={profileData.password}
            autoComplete="new-password"
            onChange={(e) =>
              setProfileData({ ...profileData, password: e.target.value })
            }
          />
        </label>
        <label>
          Role:
          <input
            type="text"
            name="role"
            value={profileData.role}
            onChange={(e) =>
              setProfileData({ ...profileData, role: e.target.value })
            }
            disabled
          />
        </label>
        <button type="submit">Update Profile</button>
        <button type="button" onClick={() => navigate("/student-dashboard")}>
          Back
        </button>
      </form>
    </>
  );
}
