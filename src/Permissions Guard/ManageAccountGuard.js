import React from "react";
import { useSelector } from "react-redux";

function ManageAccountGuard({ children }) {
  const userPermissions = useSelector((state) => state.userPermissions);

  return userPermissions?.includes("profile_password_edit") ? children : <h1>Not Authorized</h1>
}

export default ManageAccountGuard;
