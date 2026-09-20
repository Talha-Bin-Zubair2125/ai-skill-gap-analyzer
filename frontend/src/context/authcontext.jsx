import { useState, createContext } from "react";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  
  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
