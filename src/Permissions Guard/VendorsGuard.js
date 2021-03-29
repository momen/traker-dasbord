import React from "react";
import { useSelector } from "react-redux";

function UserManagementGuard({ children }) {
  const { user, userPermissions } = useSelector((state) => {
    return { user: state.user, userToken: state.userPermissions };
  });

  const isAdmin = user.roles[0].title === "Admin";

  return userPermissions?.includes("vendor_access") && isAdmin ? (
    children
  ) : (
    <h1>Unauthorized</h1>
  );
}

export default UserManagementGuard;
