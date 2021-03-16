import React from "react";
import { useStateValue } from "../StateProvider";

function UserManagementGuard({ children }) {
  const [{ userPermissions }] = useStateValue();

  return (userPermissions?.includes("show_invoices_access") ? children : null)
}

export default UserManagementGuard;
