import React from "react";
import { useStateValue } from "../StateProvider";

function UserManagementGuard({ children }) {
  const [{ userPermissions }] = useStateValue();

  return (userPermissions?.includes("product_management_access") ? children : null)
}

export default UserManagementGuard;
