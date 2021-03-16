import React from "react";
import { useStateValue } from "../StateProvider";

function UserManagementGuard({ children }) {
  const [{ user, userPermissions }] = useStateValue();

  const isAdmin = user.roles[0].title === "Admin"

  return userPermissions?.includes("vendor_access") && isAdmin ? children : <h1>Unauthorized</h1>
}

export default UserManagementGuard;
