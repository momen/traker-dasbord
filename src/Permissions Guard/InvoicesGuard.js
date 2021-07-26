import React from "react";
import { useSelector } from "react-redux";

function InvoicesGuard({ children }) {
  const { userPermissions, user } = useSelector((state) => state);

  return userPermissions?.includes("show_invoices_access") &&
    user.roles[0].title !== "Manager"
    ? children
    : null;
}

export default InvoicesGuard;
