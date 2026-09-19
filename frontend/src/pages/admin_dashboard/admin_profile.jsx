import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/authcontext";

export default function admin_profile() {
  const { profile } = useContext(AuthContext);

  return (
    <>
      <h1>Admin Profile</h1>
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
    </>
  );
}
