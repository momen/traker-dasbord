import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

function UserManagementGuard({ children }) {
  const { user, userToken, userPermissions } = useSelector((state) => {
    return { user: state.user, userToken: state.userToken, userPermissions: state.userPermissions };
  });

  if (!userToken) {
    alert("Expired")
    return <Redirect to="/sign-in" />;
  }

  return userPermissions?.includes("user_management_access") ? children : null
}

export default UserManagementGuard;
