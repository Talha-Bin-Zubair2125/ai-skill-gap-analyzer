import { useState, useEffect, createContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // fetch student, admin and mentor profile data from the backend
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          { withCredentials: true },
        );
        console.log("Fetched user data:", response.data.user);
        setProfile(response.data.user);
        setSuccess(response.data.message || "User data fetched successfully");
      } catch (error) {
        setError(error.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        error,
        setError,
        success,
        setSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
