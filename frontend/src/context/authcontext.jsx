import { useState, useEffect, createContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("", { withCredentials: true });
        console.log("Fetched user data:", response.data.user);
        setUser(response.data.user);
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
    <AuthContext.Provider value={{ user, loading, error, success }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
