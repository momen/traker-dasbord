import React from "react";
import { useSelector } from "react-redux";

function UserManagementGuard({ children }) {
  const userPermissions = useSelector((state) => state.userPermissions);

  return (userPermissions?.includes("product_management_access") ? children : null)
}

export default UserManagementGuard;
